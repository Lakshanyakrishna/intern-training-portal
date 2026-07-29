import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface AnalysisRequest {
  applicationId: string;
}

interface ScoreWeights {
  technical: number;
  projects: number;
  github: number;
  portfolio: number;
  education: number;
  experience: number;
  communication: number;
  learningPotential: number;
  motivation: number;
}

interface AIAnalysisResult {
  technicalScore: number;
  projectsScore: number;
  githubScore: number;
  portfolioScore: number;
  educationScore: number;
  experienceScore: number;
  communicationScore: number;
  learningPotentialScore: number;
  motivationScore: number;
  resumeQualityScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  riskIndicators: string[];
  positiveFindings: string[];
  topReasons: string[];
  recommendation: 'strongly_recommend' | 'recommend' | 'neutral' | 'weak' | 'reject';
  confidenceScore: number;
  reasoning: string;
}

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let applicationId: string | undefined;

  try {
    // 0. Only admin/mentor may trigger screening
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401 });
    }

    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { status: 401 });
    }

    const { data: callerProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', caller.id)
      .maybeSingle();
    if (!callerProfile || !['admin', 'mentor'].includes(callerProfile.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden: admin or mentor role required' }), { status: 403 });
    }

    const body = await req.json() as AnalysisRequest;
    applicationId = body.applicationId;
    if (!applicationId) {
      return new Response(JSON.stringify({ error: 'applicationId required' }), { status: 400 });
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    // 1. Fetch application with resume and opportunity
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*, resume_files(*), opportunities(*)')
      .eq('id', applicationId)
      .single();
    if (appError || !application) {
      return new Response(JSON.stringify({ error: 'Application not found' }), { status: 404 });
    }

    const resumeFile = application.resume_files?.[0];
    if (!resumeFile) {
      return new Response(JSON.stringify({ error: 'No resume file found' }), { status: 400 });
    }

    const opportunity = application.opportunities;
    const category = opportunity?.category || 'general';

    // 2. Get scoring weights for this opportunity category
    const { data: weights } = await supabase
      .from('opportunity_scoring_weights')
      .select('*')
      .eq('opportunity_category', category)
      .maybeSingle();

    const w: ScoreWeights = weights ? {
      technical: Number(weights.technical_weight) / 100,
      projects: Number(weights.projects_weight) / 100,
      github: Number(weights.github_weight) / 100,
      portfolio: Number(weights.portfolio_weight) / 100,
      education: Number(weights.education_weight) / 100,
      experience: Number(weights.experience_weight) / 100,
      communication: Number(weights.communication_weight) / 100,
      learningPotential: Number(weights.learning_potential_weight) / 100,
      motivation: Number(weights.motivation_weight) / 100,
    } : {
      technical: 0.20, projects: 0.20, github: 0.10, portfolio: 0.10,
      education: 0.05, experience: 0.10, communication: 0.05,
      learningPotential: 0.10, motivation: 0.10,
    };

    // 3. Extract resume text (download from storage if not extracted yet)
    let resumeText = resumeFile.extracted_text;
    if (!resumeText) {
      const { data: fileData } = await supabase.storage
        .from('resumes')
        .download(resumeFile.file_path);
      if (fileData) {
        resumeText = await fileData.text();
      }
    }

    // 4. Build AI prompt
    const prompt = buildPrompt(resumeText, application, opportunity, resumeFile.file_name);

    // 5. Call OpenAI
    if (!openaiKey) {
      await supabase.from('applications').update({ screening_status: 'failed' }).eq('id', applicationId);
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const startTime = Date.now();
    let analysis: AIAnalysisResult;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert resume screener for internship programs. Analyze the resume and provide structured scores and feedback. Respond with valid JSON only.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI request failed with status ${response.status}`);
      }

      const completion = await response.json();
      const rawContent = completion.choices?.[0]?.message?.content;
      if (!rawContent) {
        throw new Error('No response from OpenAI');
      }
      analysis = JSON.parse(rawContent) as AIAnalysisResult;
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      await supabase.from('applications').update({ screening_status: 'failed' }).eq('id', applicationId);
      return new Response(JSON.stringify({
        error: 'AI analysis failed',
        reason: aiError instanceof Error ? aiError.message : 'Unknown error',
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const processingTime = Date.now() - startTime;

    // 6. Calculate weighted overall score
    const overallScore = calculateWeightedScore(analysis, w);

    // 7. Check existing analysis for versioning
    const { data: existingAnalysis } = await supabase
      .from('resume_analyses')
      .select('id, analysis_version')
      .eq('application_id', applicationId)
      .maybeSingle();

    const newVersion = (existingAnalysis?.analysis_version || 0) + 1;

    // 8. Store analysis
    const analysisData = {
      application_id: applicationId,
      opportunity_id: opportunity?.id || null,
      technical_score: analysis.technicalScore,
      projects_score: analysis.projectsScore,
      github_score: analysis.githubScore,
      portfolio_score: analysis.portfolioScore,
      education_score: analysis.educationScore,
      experience_score: analysis.experienceScore,
      communication_score: analysis.communicationScore,
      learning_potential_score: analysis.learningPotentialScore,
      motivation_score: analysis.motivationScore,
      resume_quality_score: analysis.resumeQualityScore,
      overall_score: overallScore,
      recommendation: analysis.recommendation,
      confidence_score: analysis.confidenceScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missing_skills: analysis.missingSkills,
      risk_indicators: analysis.riskIndicators,
      positive_findings: analysis.positiveFindings,
      top_reasons: analysis.topReasons,
      raw_response: { raw: analysis },
      model_used: 'gpt-4o-mini',
      analysis_version: newVersion,
      processing_time_ms: processingTime,
      analyzed_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from('resume_analyses')
      .upsert({
        ...analysisData,
        id: existingAnalysis?.id || undefined,
      }, { onConflict: 'application_id' });

    if (upsertError) throw upsertError;

    // 9. Create version history entry
    await supabase.from('resume_analysis_versions').insert({
      application_id: applicationId,
      analysis_id: existingAnalysis?.id || analysisData.id,
      version_number: newVersion,
      trigger_reason: existingAnalysis ? 'reanalysis' : 'initial',
      scores: {
        technical: analysis.technicalScore,
        projects: analysis.projectsScore,
        github: analysis.githubScore,
        portfolio: analysis.portfolioScore,
        education: analysis.educationScore,
        experience: analysis.experienceScore,
        communication: analysis.communicationScore,
        learningPotential: analysis.learningPotentialScore,
        motivation: analysis.motivationScore,
        resumeQuality: analysis.resumeQualityScore,
        overall: overallScore,
      },
      recommendation: analysis.recommendation,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missing_skills: analysis.missingSkills,
      risk_indicators: analysis.riskIndicators,
      raw_response: { raw: analysis },
      model_used: 'gpt-4o-mini',
      processing_time_ms: processingTime,
    });

    // 10. Update application screening status
    await supabase.from('applications').update({ screening_status: 'analyzed' }).eq('id', applicationId);

    return new Response(JSON.stringify({
      success: true,
      overallScore,
      recommendation: analysis.recommendation,
      confidenceScore: analysis.confidenceScore,
      processingTime,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Analysis error:', err);
    if (applicationId) {
      await supabase.from('applications').update({ screening_status: 'failed' }).eq('id', applicationId);
    }
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

function buildPrompt(
  resumeText: string,
  application: Record<string, unknown>,
  opportunity: Record<string, unknown> | null,
  fileName: string
): string {
  return `Analyze this resume for the ${opportunity?.title || 'Internship'} program.

OPPORTUNITY: ${opportunity?.title || 'General Internship'}
CATEGORY: ${opportunity?.category || 'general'}
DESCRIPTION: ${opportunity?.description || ''}

APPLICANT INFO:
Name: ${application.name}
College: ${application.college || 'Not specified'}
Major: ${application.major || 'Not specified'}
Year of Study: ${application.year_of_study || 'Not specified'}
Why Join: ${application.why_join || 'Not specified'}

RESUME (${fileName}):
${resumeText || 'No text extracted'}

Provide a JSON response with:
{
  "technicalScore": 0-100,
  "projectsScore": 0-100,
  "githubScore": 0-100,
  "portfolioScore": 0-100,
  "educationScore": 0-100,
  "experienceScore": 0-100,
  "communicationScore": 0-100,
  "learningPotentialScore": 0-100,
  "motivationScore": 0-100,
  "resumeQualityScore": 0-100,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1"],
  "missingSkills": ["skill1"],
  "riskIndicators": ["indicator1"],
  "positiveFindings": ["finding1"],
  "topReasons": ["Top reason for recommendation"],
  "recommendation": "strongly_recommend | recommend | neutral | weak | reject",
  "confidenceScore": 0-100,
  "reasoning": "Brief explanation"
}`;
}

function calculateWeightedScore(analysis: AIAnalysisResult, w: ScoreWeights): number {
  return Math.round(
    analysis.technicalScore * w.technical +
    analysis.projectsScore * w.projects +
    analysis.githubScore * w.github +
    analysis.portfolioScore * w.portfolio +
    analysis.educationScore * w.education +
    analysis.experienceScore * w.experience +
    analysis.communicationScore * w.communication +
    analysis.learningPotentialScore * w.learningPotential +
    analysis.motivationScore * w.motivation
  );
}

