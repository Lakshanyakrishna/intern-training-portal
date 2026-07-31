import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface SendEmailRequest {
  emailLogId: string;
}

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. Caller must have a valid session. Any authenticated role may trigger
    // a send -- this function only ever sends the content of a row that was
    // already written to email_logs under that table's own RLS, never
    // arbitrary caller-supplied content, so there is no open relay here.
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

    const { emailLogId } = await req.json() as SendEmailRequest;
    if (!emailLogId) {
      return new Response(JSON.stringify({ error: 'emailLogId required' }), { status: 400 });
    }

    // 2. Load the authoritative content -- never trust a caller-supplied
    // to/subject/body, only what was already recorded server-side.
    const { data: log, error: logError } = await supabase
      .from('email_logs')
      .select('*')
      .eq('id', emailLogId)
      .single();

    if (logError || !log) {
      return new Response(JSON.stringify({ error: 'Email log not found' }), { status: 404 });
    }

    if (log.status === 'sent') {
      return new Response(JSON.stringify({ success: true, alreadySent: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const emailFrom = Deno.env.get('EMAIL_FROM') ?? 'noreply@intern-training.com';

    // 3. No provider configured -- log mode. Keeps local/dev environments
    // working without a real Resend key, mirroring the previous client-side
    // default, but the decision now lives server-side only.
    if (!resendApiKey) {
      console.log(`[EMAIL] To: ${log.recipient_email} | Subject: ${log.subject}`);
      await supabase.from('email_logs').update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      }).eq('id', emailLogId);
      return new Response(JSON.stringify({ success: true, mode: 'log' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const maxRetries = 3;
    let lastError: string | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: emailFrom,
            to: log.recipient_email,
            subject: log.subject,
            html: log.body,
          }),
        });

        if (!res.ok) {
          throw new Error(`Resend responded with ${res.status}`);
        }

        const result = await res.json();
        await supabase.from('email_logs').update({
          status: 'sent',
          provider_message_id: result.id ?? null,
          sent_at: new Date().toISOString(),
        }).eq('id', emailLogId);

        return new Response(JSON.stringify({ success: true, providerMessageId: result.id }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Unknown error';
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
        }
      }
    }

    await supabase.from('email_logs').update({
      status: 'failed',
      failure_reason: lastError,
      retry_count: maxRetries,
    }).eq('id', emailLogId);

    return new Response(JSON.stringify({ error: 'Send failed', reason: lastError }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('send-email error:', err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
