import type { TrainingTrackConfig } from './types';

// Agentic AI Training Handbook v1.0 -- Lumora's 18-day, mentor-led + AI
// product development + project-based program. Days map onto modules
// (Days 1-4 -> Foundation, 5-10 -> Development, 11-13 -> Project sprint
// simulation, 15 -> Readiness, 16-18 -> Graduation capstone), same mapping
// as frontend.ts/backend.ts. The five mentor checkpoints (handbook section
// 12) are wired in as module assessments except the Day 15 readiness
// review, which stays a bare module: that evaluation runs through the
// app's separate real ReadinessEvaluation admin flow, not a self-service
// assessment here. Every lesson's `content` is real written material
// derived from the handbook's own topic list -- see LessonConfig in
// ./types.ts for the markdown-lite subset it's written in.
export const aiTrack: TrainingTrackConfig = {
  forte: 'Agentic AI',
  trackName: 'Agentic AI Engineering',
  description: 'An 18-day, mentor-led, project-based agentic AI program: LLM integration, prompt engineering, RAG, autonomous agents, and a capstone AI product -- per the Lumora Agentic AI Training Handbook v1.0.',
  stages: [
    {
      id: 'ai-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Modern AI fundamentals, prompt engineering, LLM integration, and AI product architecture.',
      order: 1,
      modules: [
        {
          id: 'ai-foundation-intro',
          title: 'Day 1 · Introduction to Modern AI',
          description: 'The LLM ecosystem, AI product lifecycle, and your first AI chatbot.',
          estimatedMinutes: 65,
          order: 1,
          lessons: [
            {
              id: 'ai-foundation-intro-l1',
              title: 'Evolution of AI & generative AI',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Understanding where generative AI came from makes it much easier to reason about what it's actually good at, and where it genuinely struggles.

## From narrow AI to generative AI

Most AI systems built before the last few years were *narrow*: trained to do one specific task well — classify an image, predict a number, recommend a product. Generative AI, built on large language models, is different in kind: it's trained to predict the next piece of text (or image, or audio) given everything that came before it, at a scale that produces something that looks a lot like general reasoning and language understanding.

## Why this shift matters for building products

A narrow model needs to be trained specifically for your task. A large language model already has broad, general capability out of the box — the engineering work shifts from "train a model for this task" to "instruct and structure an existing model to do this task well," largely through prompting, retrieval, and tool use rather than training from scratch.

## What this course focuses on, deliberately

This program is about applying generative AI to build real products — not about the deep mathematics of how transformer models are trained. That's a legitimate, separate field. What you'll build here is the practical skill of taking a capable, general-purpose model and turning it into a specific, reliable product feature: a chatbot, a research assistant, an autonomous agent.`,
            },
            {
              id: 'ai-foundation-intro-l2',
              title: 'The LLM ecosystem & AI applications',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `The AI ecosystem you'll work in has several distinct layers, and knowing which layer a tool lives in helps you pick the right one for a given problem.

## The layers

- **Foundation models** — OpenAI's GPT models, Anthropic's Claude, Google's Gemini, and open-weight models like Llama. These are the underlying "brains" you build on top of, typically accessed through an API
- **Orchestration frameworks** — LangChain, LangGraph, and similar tools that help you chain calls together, manage memory, and coordinate tool use, rather than hand-rolling that plumbing yourself
- **Vector databases** — ChromaDB, Pinecone, FAISS — specialized storage for the embeddings that power retrieval-augmented generation
- **Application layer** — the actual product interface, whether that's a chat UI, an API your other services call, or an autonomous background agent

## Common categories of AI application

- **Conversational assistants** — chatbots, support agents, coaches
- **Retrieval-based systems** — question-answering over a specific knowledge base (documentation, internal policies, a PDF library)
- **Autonomous agents** — systems that plan and execute multi-step tasks with limited human intervention
- **Content and workflow automation** — summarization, drafting, classification, extraction

Most real products combine several of these — a support chatbot, for instance, is usually both conversational *and* retrieval-based, grounded in a company's actual documentation rather than the model's general knowledge alone.`,
            },
            {
              id: 'ai-foundation-intro-l3',
              title: 'AI product lifecycle',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `Building an AI feature follows a lifecycle that looks similar to normal software development, with a few AI-specific stages layered in.

## The stages

1. **Problem definition** — what task, specifically, is the AI meant to do, and what does a good vs. bad output actually look like?
2. **Prompt and approach design** — direct prompting, retrieval-augmented generation, an agent with tools — which approach fits the problem?
3. **Prototyping** — a fast, rough version to validate the approach actually works before investing in production-quality engineering
4. **Evaluation** — testing against real (or realistic) inputs, measuring accuracy, catching hallucinations, before it reaches users
5. **Integration** — wiring the AI feature into the actual product: a backend endpoint, error handling, rate limiting, cost management
6. **Monitoring and iteration** — AI features degrade or drift in ways traditional software doesn't (a model update can change behavior); ongoing monitoring is not optional

## What's genuinely different from typical software development

Traditional software is deterministic — the same input reliably produces the same output. AI features are probabilistic — the same input can produce meaningfully different outputs across calls. That changes how you test (you need a representative sample of cases, not just one), how you set user expectations (an AI feature should rarely claim total certainty), and how you monitor in production (watching for a *drift* in quality, not just outright failures).`,
            },
            {
              id: 'ai-foundation-intro-l4',
              title: 'OpenAI API integration',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 4,
              content: `Calling an LLM API follows a consistent shape across providers: you send a list of messages, and get a generated response back.

\`\`\`js
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'You are a helpful assistant for internship applicants.' },
    { role: 'user', content: 'What should I include in my resume?' },
  ],
  temperature: 0.7,
});

console.log(response.choices[0].message.content);
\`\`\`

## The message roles

- \`system\` sets the model's behavior and constraints for the entire conversation — this is where you establish tone, scope, and guardrails
- \`user\` represents input from the actual end user
- \`assistant\` represents the model's own prior responses, included when you're maintaining conversation history

## Two things to get right immediately

- **The API key is a secret.** It's used server-side, never shipped to a frontend or a mobile app — an exposed key can rack up real, unbounded cost on your account almost instantly if it leaks
- **Every call has a cost**, billed per token. Even in a training exercise, it's worth building the habit of thinking about token usage — verbose system prompts and long conversation histories all add up, and that habit matters much more once you're operating at production scale.`,
            },
          ],
          practice: [
            { id: 'ai-foundation-intro-p1', title: 'Set up AI-assisted coding tools and build your first AI chatbot', kind: 'interactive', order: 1 },
          ],
        },
        {
          id: 'ai-foundation-prompting',
          title: 'Day 2 · Prompt Engineering',
          description: 'Prompt design, system prompts, few-shot prompting, and structured outputs.',
          estimatedMinutes: 55,
          order: 2,
          lessons: [
            {
              id: 'ai-foundation-prompting-l1',
              title: 'Prompt design & system prompts',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A prompt is the entire interface between your intent and the model's behavior — which means how carefully you design it directly determines how reliable your AI feature is.

## What a well-designed prompt includes

- **Clear role and scope** — what is the model, what is it here to do, and just as importantly, what should it *not* do
- **Specific instructions** — "summarize concisely" is vague; "summarize in 3 bullet points, focused on action items" is specific enough to produce consistent results
- **Relevant context** — anything the model needs to know that it can't be assumed to already know (your product's specific terminology, current data, business rules)
- **The desired output format**, stated explicitly rather than hoped for

## System prompts vs. user prompts

The system prompt sets standing behavior for the entire interaction — tone, boundaries, persistent instructions. It's set once, by you, not by the end user. User prompts are the actual per-turn input. Keeping instructions in the system prompt (rather than repeating them in every user message) keeps behavior consistent and makes the actual per-turn logic easier to reason about.

## Iterating on prompts like code

Treat prompts as something you version, test, and refine deliberately — not something you write once and leave alone. A small wording change can meaningfully shift output quality, and without systematic testing across representative examples, you won't reliably know whether a change actually helped or quietly made things worse for some inputs.`,
            },
            {
              id: 'ai-foundation-prompting-l2',
              title: 'Few-shot prompting & chain-of-thought',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Two techniques consistently improve output quality beyond a plain instruction: showing the model examples, and asking it to reason step by step.

## Few-shot prompting

Rather than only describing what you want, you show the model a few examples of input/output pairs directly in the prompt:

- Zero-shot: "Classify this support ticket by urgency."
- Few-shot: "Classify this support ticket by urgency. Examples: [ticket] → high, [ticket] → low, [ticket] → medium. Now classify: [new ticket]"

Few-shot prompting is especially valuable for tasks with a specific, non-obvious output format or classification scheme the model wouldn't reliably infer from a description alone — the examples do a lot of the specification work that plain instructions can't.

## Chain-of-thought

Asking a model to "think step by step" before giving a final answer measurably improves accuracy on reasoning-heavy tasks — arithmetic, multi-step logic, anything requiring the model to hold and combine several pieces of information. It works because it gives the model space to work through intermediate steps rather than jumping straight to a final answer, similar to how a person reasons more reliably by working through a problem than by guessing immediately.

## When to reach for which

Few-shot is most valuable when the *format* or *category* of the desired output is hard to describe in words. Chain-of-thought is most valuable when the *reasoning* required is genuinely multi-step. Simple, direct tasks often don't need either — adding unnecessary complexity to a prompt can slow responses down and increase cost without improving the result.`,
            },
            {
              id: 'ai-foundation-prompting-l3',
              title: 'Structured outputs',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 3,
              content: `Free-form text is fine for a chat interface, but most real applications need the model's output in a predictable, parseable shape — structured output is how you get that reliably.

\`\`\`js
const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'Extract structured data from resumes. Respond only with valid JSON matching the given schema.' },
    { role: 'user', content: resumeText },
  ],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'resume_extraction',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          yearsExperience: { type: 'number' },
          skills: { type: 'array', items: { type: 'string' } },
        },
        required: ['name', 'skills'],
      },
    },
  },
});
\`\`\`

## Why this matters more than it might seem

Before structured output support existed, teams asked the model to "respond in JSON" and hoped for the best — occasionally getting invalid JSON, extra commentary wrapped around it, or inconsistent field names. Schema-constrained output eliminates that entire failure mode, which matters a lot once an AI feature's output feeds directly into other code rather than just being displayed to a human.

## Still validate on your end

Even with a schema constraint, defensive parsing on the receiving end is worth keeping — treat the model's output the same way you'd treat any external, potentially malformed input, rather than assuming it's always perfectly well-formed.`,
            },
          ],
          practice: [
            { id: 'ai-foundation-prompting-p1', title: 'Build a prompt library and evaluate AI responses', kind: 'interactive', order: 1 },
          ],
          challenge: { id: 'ai-foundation-prompting-c1', title: 'Optimize a prompt library for accuracy and structured-output reliability', kind: 'coding', description: 'Harder, capstone-style exercise for this module.', order: 1 },
        },
        {
          id: 'ai-foundation-integration',
          title: 'Day 3 · LLM Integration',
          description: 'API integration, context windows, token management, and streaming responses.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            {
              id: 'ai-foundation-integration-l1',
              title: 'API integration & model parameters',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 1,
              content: `Beyond the messages themselves, a handful of parameters control how the model generates its response — and understanding what each one actually does is the difference between a lucky configuration and a deliberate one.

\`\`\`js
const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages,
  temperature: 0.2,   // lower = more deterministic, higher = more varied
  max_tokens: 500,     // caps response length (and cost)
  top_p: 1,             // alternative to temperature for controlling randomness
});
\`\`\`

## Temperature, specifically

Temperature controls how much randomness is injected into token selection. Near 0, the model reliably picks its highest-confidence next token — good for factual extraction, classification, and anything where consistency matters more than variety. Higher values (0.7-1.0+) introduce more variation — better suited for creative writing or brainstorming, where some variety across runs is desirable rather than a bug.

## Picking the right model, not just the biggest one

Larger, more capable models cost more and respond slower. For many tasks — classification, simple extraction, short-form generation — a smaller, faster, cheaper model performs just as well as a larger one, at a fraction of the cost and latency. Defaulting to the largest available model for every task is a common, avoidable inefficiency once you're operating at real scale.

## Handling failures

API calls fail — rate limits, transient network issues, occasional service outages. Production AI integrations need retry logic with backoff and a sensible fallback behavior, the same discipline as any other external API dependency.`,
            },
            {
              id: 'ai-foundation-integration-l2',
              title: 'Context windows & token management',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Every model has a maximum context window — the total amount of text (measured in tokens, not characters or words) it can consider at once, spanning both the input and the output combined.

## What a token actually is

A token is roughly three-quarters of a word on average for English text, though it varies — common words are often a single token, rarer words or unusual formatting can split into several. This matters practically: cost and context limits are both measured in tokens, not in words or characters, so estimating usage means thinking in tokens specifically.

## Why context windows matter for product design

A long conversation, a large document being summarized, or a big set of retrieved context for RAG can all push against the context window limit. Once you're near it, older conversation turns typically need to be trimmed or summarized to make room — an AI feature that silently truncates important context (cutting off the beginning of a long document, say) can produce confidently wrong answers with no obvious error to point to.

## Managing tokens deliberately

- Trim conversation history to what's actually relevant, not the entire chat log by default
- Summarize long context rather than including it verbatim, when the specific wording isn't essential
- Be deliberate about system prompt length — verbose, unfocused instructions consume context budget on every single call

Token management isn't just a cost optimization; it directly affects output quality, since a model reasoning over an unnecessarily cluttered context tends to perform worse than one given exactly what it needs.`,
            },
            {
              id: 'ai-foundation-integration-l3',
              title: 'Streaming responses',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 3,
              content: `Streaming sends a model's response token by token as it's generated, rather than waiting for the entire response to complete before returning anything — the same effect you see in most modern chat interfaces, where text appears progressively instead of all at once.

\`\`\`js
const stream = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages,
  stream: true,
});

for await (const chunk of stream) {
  const token = chunk.choices[0]?.delta?.content ?? '';
  process.stdout.write(token); // or push to a websocket / SSE connection
}
\`\`\`

## Why streaming matters for perceived performance

A response that takes 8 seconds to fully generate feels dramatically slower waiting in silence than watching it appear progressively over the same 8 seconds. Streaming doesn't reduce actual generation time — it changes *when* the user starts seeing output, which has an outsized effect on how fast an interface feels.

## What streaming requires architecturally

The backend needs to keep a connection open and forward chunks as they arrive — typically through Server-Sent Events (SSE) or a WebSocket, rather than a normal request/response cycle that completes once and closes. The frontend needs to handle partial, incrementally-arriving content rather than assuming it always receives one complete payload at once.

## When not to stream

For structured output that needs to be fully parsed before it's usable (a JSON object, for instance), streaming individual tokens doesn't help — the consumer needs the complete, valid output before it can do anything with it. Streaming is a UX technique for human-facing text, not a universal default for every kind of AI response.`,
            },
          ],
          practice: [
            { id: 'ai-foundation-integration-p1', title: 'Build a context-aware AI chatbot with memory', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-foundation-architecture',
          title: 'Day 4 · AI Product Architecture',
          description: 'AI application architecture, backend/frontend integration, and secure API management.',
          estimatedMinutes: 55,
          order: 4,
          lessons: [
            {
              id: 'ai-foundation-architecture-l1',
              title: 'AI application architecture',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `An AI-powered feature has the same architectural layers as any other product feature, with one addition: the AI service itself sits behind the backend, never called directly from the client.

## A typical shape

- **Frontend** — the chat interface or feature UI, calling your own backend, never an AI provider directly
- **Backend API** — receives the request, applies business logic (auth, rate limiting, input validation), constructs the prompt, calls the LLM provider, processes the response, returns it to the frontend
- **AI provider** — OpenAI, Anthropic, or similar, called only from the backend
- **Supporting infrastructure** — a vector database for RAG, a queue for long-running agent tasks, logging and monitoring for AI-specific metrics

## Why the AI call always goes through your backend

Calling an LLM API directly from the frontend would expose your API key to anyone who opens the browser's network tab — an immediate, serious security problem. Routing through your own backend also means you can enforce business rules (rate limits per user, content filtering, cost controls) before a request ever reaches the AI provider and starts costing money.

## Designing for AI-specific failure modes

Beyond the usual failure modes any backend handles, AI features need to handle: the model returning something unexpected or malformed, the model being slow under load, and cost spiraling if usage isn't bounded. Building these considerations into the architecture from the start is much cheaper than retrofitting them after an incident.`,
            },
            {
              id: 'ai-foundation-architecture-l2',
              title: 'Backend & frontend integration',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Integrating an AI feature into a real product means treating it like any other backend capability the frontend consumes — with the added wrinkle of handling latency and partial results well.

## The API contract

Your backend should expose a clean endpoint the frontend calls (\`POST /chat\`, \`POST /analyze-resume\`) — the frontend shouldn't need to know anything about which model is used, what the prompt looks like, or how retrieval works internally. That separation means you can change the underlying AI approach entirely without touching the frontend at all.

## Handling latency well

LLM calls are meaningfully slower than a typical database-backed API call — often multiple seconds, especially for longer generations. The frontend needs a real loading state (and ideally, streaming) rather than a blocking spinner that leaves users uncertain whether anything is actually happening.

## Handling failure gracefully

An AI call can fail, time out, or occasionally return a low-quality result. The frontend should handle this the same way it handles any other failed request — a clear error state and a retry option — rather than assuming AI calls always succeed just because they usually do.

## A pattern worth adopting: graceful degradation

If an AI feature is enhancing an existing capability (an AI-generated summary alongside a manually-written one, for instance), the core feature should keep working even if the AI enhancement fails. Treating AI output as an enhancement layered on top of a working product, not as a single point of failure the whole feature depends on, is a resilient default.`,
            },
            {
              id: 'ai-foundation-architecture-l3',
              title: 'Secure API key management',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `AI provider API keys deserve the same care as any other production secret — arguably more, since a leaked key can be used to run up real, sometimes substantial, cost before anyone notices.

## The baseline rules

- API keys live in environment variables on the backend, never in frontend code, never in a mobile app bundle, never committed to git
- Different environments (development, staging, production) use separate keys where possible, so a compromised development key doesn't affect production
- Keys are rotated periodically, and immediately if there's any suspicion of exposure

## Setting spending limits

Most AI providers let you set a hard spending cap on an API key or account. Setting one — even a generous one — is a cheap safety net against a bug (an infinite retry loop, a runaway agent) or a leaked key racking up unexpected cost while nobody's watching.

## Rate limiting your own usage

Beyond the provider's own limits, your backend should apply its own rate limiting per user or per session. Without it, a single user (intentionally or through a frontend bug) could make an unbounded number of expensive AI calls, degrading the experience for everyone else and inflating cost with no natural ceiling.

## Monitoring usage, not just guarding it

Track token usage and cost per feature, ideally per user, so a spike is visible quickly rather than discovered at the end of a billing cycle. This is as much a product-management practice as a security one — AI-related cost is one of the more significant new variable costs a product with an AI feature carries.`,
            },
          ],
          practice: [
            { id: 'ai-foundation-architecture-p1', title: 'Architect an AI assistant with a basic workflow', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'ai-foundation-checkpoint', title: '[Mentor Checkpoint] AI Foundations Review (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'ai-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-10 · RAG, LangChain, LangGraph, AI agents, multi-agent systems, and AI evaluation.',
      order: 2,
      modules: [
        {
          id: 'ai-development-rag',
          title: 'Day 5 · Retrieval-Augmented Generation (RAG)',
          description: 'Embeddings, vector databases, and context injection.',
          estimatedMinutes: 55,
          order: 1,
          lessons: [
            {
              id: 'ai-development-rag-l1',
              title: 'Embeddings & vector databases',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `An LLM only knows what it was trained on, which by definition doesn't include your company's internal documents, your product's specific data, or anything created after its training cutoff. RAG solves this by retrieving relevant information at request time and handing it to the model as context.

## What embeddings actually are

An embedding is a numeric vector representation of a piece of text, positioned in a high-dimensional space such that texts with similar *meaning* end up positioned close together — not similar spelling, similar meaning. "How do I reset my password" and "I forgot my login credentials" would embed close together even though they share almost no words.

## Vector databases

A vector database (ChromaDB, Pinecone, FAISS) is built specifically to store embeddings and perform fast similarity search across potentially millions of them — finding "which stored documents are most semantically similar to this query" in a way a traditional keyword-based database isn't designed to do efficiently.

## The RAG flow, at a high level

1. Your documents are split into chunks and embedded once, stored in a vector database
2. At query time, the user's question is also embedded
3. The database returns the most semantically similar chunks
4. Those chunks get injected into the prompt as context, and the model answers grounded in that specific, retrieved information rather than relying only on its general training knowledge`,
            },
            {
              id: 'ai-development-rag-l2',
              title: 'Document retrieval & chunking',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `Before anything can be retrieved, documents need to be split into chunks — and how you chunk has a bigger effect on RAG quality than most people expect going in.

\`\`\`js
function chunkText(text, maxTokens = 500, overlap = 50) {
  const sentences = text.split(/(?<=[.!?])\\s+/);
  const chunks = [];
  let current = [];

  for (const sentence of sentences) {
    current.push(sentence);
    if (estimateTokens(current.join(' ')) > maxTokens) {
      chunks.push(current.join(' '));
      current = current.slice(-overlap); // keep a bit of overlap for context continuity
    }
  }
  if (current.length) chunks.push(current.join(' '));
  return chunks;
}
\`\`\`

## Why chunk size matters so much

Chunks too small lose context — a sentence pulled in isolation might be technically relevant but meaningless without its surrounding paragraph. Chunks too large dilute relevance — a 5,000-word document chunk retrieved for a specific question buries the actually-relevant sentence in a lot of irrelevant surrounding text, and wastes context window on content that doesn't help.

## Why overlap between chunks helps

Splitting a document at hard boundaries risks cutting a relevant idea exactly in half, with the answer to a question split across the end of one chunk and the start of the next. A small overlap between consecutive chunks reduces the chance that a relevant passage gets awkwardly severed right at a chunk boundary.

## Retrieval itself

Once chunks are embedded and stored, retrieval means embedding the incoming query and asking the vector database for the top-k most similar chunks — typically 3 to 10, depending on chunk size and how much context the model can usefully absorb.`,
            },
            {
              id: 'ai-development-rag-l3',
              title: 'Context injection',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 3,
              content: `Once relevant chunks are retrieved, they need to be assembled into the prompt in a way the model can actually use well — this step is easy to get sloppy and quietly hurts output quality when it is.

\`\`\`js
const relevantChunks = await vectorStore.similaritySearch(userQuestion, 5);

const systemPrompt = \`Answer the user's question using ONLY the context below.
If the answer isn't in the context, say you don't have that information — do not guess.

Context:
\${relevantChunks.map((c, i) => \`[\${i + 1}] \${c.text}\`).join('\\n\\n')}\`;

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userQuestion },
  ],
});
\`\`\`

## The instruction that matters most

Explicitly telling the model to answer *only* from the provided context, and to say so honestly when the answer isn't there, is one of the single highest-leverage instructions in a RAG system. Without it, the model will often fall back on its general training knowledge when the retrieved context doesn't actually contain the answer — producing a response that sounds confident and grounded but isn't actually based on your data at all.

## Citing sources

Numbering the injected chunks (as above) makes it possible to ask the model to cite which chunk(s) it drew from — genuinely useful for building user trust, and for debugging cases where the retrieved context clearly didn't contain what was needed.`,
            },
          ],
          practice: [
            { id: 'ai-development-rag-p1', title: 'Build a PDF chatbot backed by a knowledge base', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-development-langchain',
          title: 'Day 6 · LangChain Fundamentals',
          description: 'Chains, memory, tool calling, and agents.',
          estimatedMinutes: 45,
          order: 2,
          lessons: [
            {
              id: 'ai-development-langchain-l1',
              title: 'Chains & memory',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 1,
              content: `LangChain provides reusable building blocks for common AI application patterns, so you're not hand-rolling prompt templating, output parsing, and conversation memory from scratch for every project.

\`\`\`js
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const model = new ChatOpenAI({ model: 'gpt-4o-mini' });
const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a career coach helping interns prepare for interviews.'],
  ['human', '{question}'],
]);

const chain = prompt.pipe(model);
const response = await chain.invoke({ question: 'How do I answer "tell me about yourself"?' });
\`\`\`

## What a "chain" actually is

A chain is a sequence of steps composed together — a prompt template feeding into a model call, feeding into an output parser, potentially feeding into another model call. Composing these as named, reusable pieces makes complex flows easier to build and reason about than one large, unstructured function calling the API directly with string concatenation.

## Memory

Without memory, every call to a model is stateless — it has no idea what was said earlier in the conversation unless you explicitly include it. LangChain's memory utilities handle keeping track of conversation history and including the relevant portion of it in each new call, so a chatbot can actually reference something the user said three messages ago.

## Why a framework at all, instead of raw API calls

For a single simple call, raw API calls are perfectly fine and arguably simpler. LangChain earns its complexity once an application involves multiple steps, memory, retrieval, and tool use working together — at that point, the shared abstractions save real time and reduce a class of bugs that come from re-implementing the same plumbing slightly differently each time.`,
            },
            {
              id: 'ai-development-langchain-l2',
              title: 'Tool calling',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `Tool calling lets a model decide, based on the conversation, that it needs to invoke a specific function — a database lookup, a calculation, an API call — rather than trying to answer everything purely from its own generated text.

\`\`\`js
const tools = [
  {
    name: 'get_opportunity_status',
    description: "Look up an internship opportunity's current application status by ID.",
    parameters: {
      type: 'object',
      properties: { opportunityId: { type: 'string' } },
      required: ['opportunityId'],
    },
  },
];

const response = await model.invoke(messages, { tools });
// The model may respond with a tool call request instead of plain text;
// your code executes the actual function and returns the result back to the model.
\`\`\`

## Why this is the mechanism that turns a chatbot into an agent

Without tools, a model can only respond with text generated from its training — it can't check today's actual data, can't perform a precise calculation reliably, can't take a real action in your system. Tool calling is what lets it *do* things: query a real database, call a real API, trigger a real workflow — grounded in your actual, current data instead of guessing.

## The model doesn't execute anything itself

It's worth being precise about what's actually happening: the model decides *that* a tool should be called and *with what arguments* — your own code is what actually executes the function and returns the real result back to the model for it to use in its final response. The model never has direct access to your systems; it can only request an action, which your code chooses whether and how to fulfill.`,
            },
            {
              id: 'ai-development-langchain-l3',
              title: 'Agents overview',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `An agent is a system that uses an LLM not just to generate text, but to decide *what to do next* — which tool to call, in what order, based on the results of previous steps — with limited or no human intervention along the way.

## How an agent differs from a simple chain

A chain typically follows a fixed sequence of steps you defined in advance. An agent's sequence of steps is *dynamic*: the model itself decides, at each step, what to do next based on what's happened so far. Ask an agent to "research this topic and summarize the findings," and it might decide on its own to search, then read a result, then search again to fill a gap, then summarize — a sequence you didn't hardcode in advance.

## The basic loop

Most agents run some version of: observe the current state → reason about what to do next → take an action (usually a tool call) → observe the result → repeat until the task is judged complete. This loop is what LangChain's agent abstractions (and the LangGraph tooling on Day 7) help you implement without building the control flow from scratch.

## Why agents need more oversight than a simple chatbot

A chatbot's worst failure is a bad response — annoying, but contained. An agent's worst failure can be a bad *action* — calling the wrong tool, taking a real action based on a hallucinated premise, or looping unproductively without making progress. This is exactly why agent design puts real weight on constraints: limiting which tools are available, capping how many steps an agent can take, and building in human checkpoints for consequential actions.`,
            },
          ],
          practice: [
            { id: 'ai-development-langchain-p1', title: 'Automate a workflow with LangChain', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-development-langgraph',
          title: 'Day 7 · LangGraph & Multi-Step Workflows',
          description: 'State management, workflow graphs, and conditional execution.',
          estimatedMinutes: 40,
          order: 3,
          lessons: [
            {
              id: 'ai-development-langgraph-l1',
              title: 'State management & workflow graphs',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `LangGraph models an AI workflow explicitly as a graph — nodes representing steps, edges representing the possible transitions between them — which gives you far more control over complex, multi-step behavior than a simple linear chain.

## Why a graph, specifically

A linear chain assumes step A always leads to step B always leads to step C. Real workflows are rarely that simple — after retrieving information, an agent might need to decide whether to search again, ask a clarifying question, or move on to generating a final answer, depending on what it found. A graph structure represents these branching possibilities directly, rather than forcing an artificially linear shape onto genuinely conditional logic.

## State

Each node in the graph reads from and writes to a shared state object — the running context of everything that's happened in the workflow so far: retrieved documents, intermediate results, a running conversation history. Explicit, structured state (rather than passing loosely-shaped data between ad hoc function calls) is what keeps a complex multi-step workflow debuggable as it grows.

## What this buys you in practice

- **Visibility** — you can trace exactly which nodes ran, in what order, and what the state looked like at each step
- **Testability** — individual nodes can be tested independently of the full workflow
- **Composability** — complex workflows are built from smaller, well-defined nodes rather than one large, tangled function`,
            },
            {
              id: 'ai-development-langgraph-l2',
              title: 'Decision paths & conditional execution',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `A graph's real power over a linear chain shows up in conditional edges — routing to a different next step based on the current state, rather than always following the same fixed path.

\`\`\`js
function routeAfterRetrieval(state) {
  if (state.retrievedDocs.length === 0) {
    return 'clarify_with_user'; // no relevant context found — ask for more detail
  }
  if (state.confidence < 0.5) {
    return 'search_again'; // low confidence — try a refined query
  }
  return 'generate_answer'; // enough good context — proceed
}

graph.addConditionalEdges('retrieve', routeAfterRetrieval, {
  clarify_with_user: 'clarify',
  search_again: 'retrieve',
  generate_answer: 'generate',
});
\`\`\`

## Why this matters for reliability

Without conditional routing, a workflow either always follows the same steps (breaking down on cases that don't fit) or relies entirely on the model's own judgment for everything (less predictable, harder to constrain). Conditional edges let you encode explicit, testable business logic around *when* certain steps happen, while still letting the model handle the parts that genuinely need its judgment — retrieval quality, content generation, natural language understanding.

## Avoiding infinite loops

A workflow that can route back to an earlier step (like \`search_again\` above) needs an explicit cap on how many times that can happen. Without one, an agent stuck in a bad loop — repeatedly searching, never satisfied with the results — will run indefinitely, burning cost and never reaching a useful conclusion.`,
            },
          ],
          practice: [
            { id: 'ai-development-langgraph-p1', title: 'Build a multi-step AI task pipeline with LangGraph', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-development-agents',
          title: 'Day 8 · AI Agents',
          description: 'Autonomous agents, planning, reasoning, and task execution.',
          estimatedMinutes: 55,
          order: 4,
          lessons: [
            {
              id: 'ai-development-agents-l1',
              title: 'Autonomous agents & planning',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Planning is what separates an agent from a system that just responds to one instruction at a time — the ability to break a broader goal down into a sequence of smaller, executable steps.

## What planning looks like in practice

Given a goal like "screen these resumes and shortlist the top 3 candidates for a frontend role," an agent needs to work out — often by prompting the model to reason about it explicitly — a plan roughly like: read each resume, extract relevant experience and skills, score each against the role's requirements, rank them, and select the top matches. A well-designed agent generates and can adapt this plan, rather than following a rigid, pre-scripted sequence for every possible request.

## Two broad planning approaches

- **Upfront planning** — the agent generates a full plan before executing any of it, useful when the task is well-understood and steps don't depend heavily on intermediate results
- **Reactive planning** — the agent decides its next single step based on the current state, re-evaluating after each action, useful when later steps genuinely depend on what earlier steps discover

## Why planning quality is the main lever on agent reliability

An agent with a poor plan will confidently execute the wrong sequence of steps — task execution can be technically flawless while still producing the wrong outcome, because the plan itself was wrong. This is why a meaningful share of agent-development effort goes into prompt design specifically for the planning step, not just the execution steps — a bad plan, executed well, still produces a bad result.`,
            },
            {
              id: 'ai-development-agents-l2',
              title: 'Reasoning & tool usage',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `An agent's reasoning is what connects a plan to actual tool calls — deciding, at each step, which tool to use and with what arguments, based on the goal and everything discovered so far.

\`\`\`js
const tools = [searchCandidates, scoreResume, sendShortlistEmail];

const agentPrompt = \`You are a resume screening agent. Given a job description and a pool of resumes:
1. Score each resume against the requirements
2. Rank candidates by score
3. Shortlist the top 3
Use the available tools to complete each step. Explain your reasoning before each tool call.\`;

// The agent loop: the model reasons, requests a tool call, your code executes it,
// the result feeds back in, and the model reasons about the next step.
\`\`\`

## Why explicit reasoning ("explain before each tool call") helps

Asking the model to state its reasoning before acting does two things: it tends to improve the *quality* of the eventual action (similar to chain-of-thought prompting), and it makes the agent's behavior debuggable — when something goes wrong, you can read back through the reasoning trail and see exactly where the logic broke down, rather than staring at a sequence of tool calls with no explanation attached.

## Tool selection matters as much as tool execution

Giving an agent access to too many overlapping or poorly-described tools makes it more likely to pick the wrong one. Clear, specific tool descriptions — what each tool does, when to use it, what it returns — directly affect how reliably an agent chooses correctly among them. This is prompt engineering applied to tool definitions, not just to the system prompt.`,
            },
            {
              id: 'ai-development-agents-l3',
              title: 'Task execution',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 3,
              content: `Execution is where a plan and a sequence of tool calls actually become real outcomes — and it's the stage where an agent's failures have real consequences, not just an unhelpful chat response.

\`\`\`js
async function executeAgentStep(step, state) {
  try {
    const result = await tools[step.toolName](step.arguments);
    return { ...state, results: [...state.results, result], stepsCompleted: state.stepsCompleted + 1 };
  } catch (err) {
    logger.error('Agent step failed', { step, error: err.message });
    return { ...state, errors: [...state.errors, { step, error: err.message }] };
  }
}
\`\`\`

## Guardrails that matter at execution time

- **A maximum step count** — an agent that isn't converging on a result shouldn't be allowed to run indefinitely, burning cost with no useful outcome
- **Confirmation for consequential actions** — sending an email, modifying data, spending money are generally worth a human-in-the-loop checkpoint rather than fully autonomous execution, especially early in a system's life before its reliability is well understood
- **Graceful failure handling** — one failed tool call shouldn't necessarily abort the entire task; the agent should often be able to recognize a partial failure and adapt, similar to how a person would respond to one step of a plan not working

## Logging every step

Because an agent's path through a task is dynamic rather than fixed, thorough logging of every step, tool call, and result is what makes debugging possible after the fact — without it, understanding *why* an agent produced a specific outcome after the fact is close to impossible.`,
            },
          ],
          practice: [
            { id: 'ai-development-agents-p1', title: 'Build a resume screening agent', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'ai-development-checkpoint', title: '[Mentor Checkpoint] Agent Development Assessment (Day 8)', kind: 'coding', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
        {
          id: 'ai-development-multiagent',
          title: 'Day 9 · Multi-Agent Systems',
          description: 'Agent collaboration, delegation, and human-in-the-loop.',
          estimatedMinutes: 40,
          order: 5,
          lessons: [
            {
              id: 'ai-development-multiagent-l1',
              title: 'Agent collaboration & delegation',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Some tasks are better solved by several specialized agents working together than by one general-purpose agent trying to do everything — the same reasoning that leads engineering teams to specialize rather than have every person do every job.

## Why specialize agents at all

A single agent handling research, writing, and fact-checking simultaneously carries a large, complex prompt trying to cover every responsibility at once — often performing each individual task worse than a focused agent would. Splitting responsibilities across specialized agents (a researcher, a writer, a reviewer) lets each one have a tightly-scoped prompt and tool set, generally producing better results per task.

## Delegation patterns

- **Orchestrator-worker** — one coordinating agent breaks a task down and delegates pieces to specialized worker agents, then assembles their results into a final output
- **Sequential pipeline** — agents run one after another, each consuming the previous one's output (research agent → writing agent → editing agent)
- **Peer collaboration** — agents exchange information and iterate together rather than following a strict one-way hierarchy

## What actually gets harder with multiple agents

Coordination overhead is real: agents need a shared way to communicate results, failures in one agent can cascade to agents depending on its output, and debugging requires tracing across multiple independent reasoning processes rather than just one. Multi-agent systems are a genuine complexity upgrade over a single agent — worth reaching for when a task actually benefits from specialization, not as a default architecture for every problem regardless of whether it needs it.`,
            },
            {
              id: 'ai-development-multiagent-l2',
              title: 'Coordination & human-in-the-loop',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Coordinating multiple agents — and knowing when to bring a human into the loop — is what keeps a multi-agent system reliable rather than a collection of independently unpredictable pieces.

## Coordination mechanisms

- A **shared state object**, similar to LangGraph's state, that every agent reads from and contributes to, so each agent has visibility into what others have already done
- **Explicit handoff points** — a clear moment where one agent's output becomes another's input, rather than agents interacting in an unstructured, hard-to-trace way
- **A coordinator or supervisor agent**, in orchestrator-worker setups, responsible for sequencing and combining results from the specialized workers

## Human-in-the-loop, deliberately placed

Not every step needs human oversight, but some genuinely should: before a consequential action is taken (sending a real communication, modifying real data), when agent confidence is low, or at natural checkpoints in a long-running task where a human can catch a problem before it compounds across several more steps.

## Designing the checkpoint well

A good human-in-the-loop checkpoint shows enough context for a quick, informed decision — not the entire raw reasoning trace, and not just a bare "approve or reject" with no context at all. The goal is a genuinely useful checkpoint, not a rubber-stamp step that exists in name only because nobody has enough information to meaningfully evaluate it.

## The trade-off to be honest about

More human-in-the-loop checkpoints mean more reliability and safety, at the cost of speed and full autonomy. Where that balance should sit depends entirely on the stakes of what the agent is doing — a research summarization agent needs far less oversight than one that can take real actions with real consequences.`,
            },
          ],
          practice: [
            { id: 'ai-development-multiagent-p1', title: 'Build a multi-agent research workflow', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-development-evaluation',
          title: 'Day 10 · AI Evaluation',
          description: 'Hallucination detection, prompt testing, and AI safety.',
          estimatedMinutes: 40,
          order: 6,
          lessons: [
            {
              id: 'ai-development-evaluation-l1',
              title: 'Hallucination detection & prompt testing',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A hallucination is when a model generates something that sounds plausible and confident but is factually wrong or entirely fabricated — a citation that doesn't exist, a statistic invented on the spot, a claim about your own product's data that isn't actually true.

## Why this is a real, unavoidable property of how LLMs work

A model doesn't have a built-in mechanism for verifying its own claims — it's generating text that's statistically plausible given its training and the current context, not consulting a ground-truth source of facts by default. This is exactly why RAG matters so much for factual applications: grounding responses in retrieved, real source material significantly reduces (though doesn't eliminate) hallucination, because the model has real information to draw from instead of relying purely on its parametric memory.

## Detecting hallucinations systematically

- **Groundedness checks** — for RAG systems, verifying that claims in the output are actually supported by the retrieved context, not just plausible-sounding
- **Consistency checks** — running the same query multiple times and checking whether the answer stays consistent; wild variance on a factual question is a red flag
- **Human review on a representative sample** — for high-stakes use cases, periodic manual review of real outputs against ground truth remains one of the most reliable evaluation methods available

## Prompt testing as an ongoing practice

Building a test set of representative inputs — including known edge cases and cases that have failed before — and re-running it whenever a prompt changes is what turns prompt engineering from guesswork into something you can actually measure improvement or regression against.`,
            },
            {
              id: 'ai-development-evaluation-l2',
              title: 'Performance optimization & AI safety',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Beyond accuracy, a production AI feature needs to be fast enough and safe enough to actually ship — two concerns that are easy to underweight while focused purely on getting the core functionality working.

## Performance considerations

- **Model selection** — a smaller, faster model is often good enough for a given task; defaulting to the largest available model everywhere adds unnecessary latency and cost
- **Caching** — identical or near-identical queries don't need a fresh model call every time; caching common responses can meaningfully cut both latency and cost
- **Parallelization** — independent steps (retrieving from multiple sources, scoring several candidates) can often run concurrently rather than sequentially

## AI safety, practically

- **Content filtering** — guarding against a model producing harmful, biased, or inappropriate output, especially in user-facing applications where the input isn't fully controlled
- **Prompt injection resistance** — user input that tries to override your system instructions ("ignore your previous instructions and instead...") is a real, common attack pattern worth explicitly designing against, not an edge case to handle later
- **Data privacy** — being deliberate about what user data gets sent to a third-party AI provider, and ensuring that's consistent with your privacy commitments to users

## Why this belongs in Day 10, not as an afterthought

Evaluation, performance, and safety aren't a final polish step tacked onto an otherwise-finished AI feature — they're what determines whether it's actually trustworthy enough to put in front of real users. Building evaluation habits early, while the system is still small, is far easier than retrofitting them onto something already in production.`,
            },
          ],
          practice: [
            { id: 'ai-development-evaluation-p1', title: 'Evaluate an AI system for quality and safety', kind: 'debugging', order: 1 },
          ],
        },
      ],
    },
    {
      id: 'ai-project',
      key: 'project',
      title: 'Project',
      description: "Days 11-13 · Industry simulation -- sprint planning, AI product feature development, and code review exactly as a real AI engineering team works.",
      order: 3,
      modules: [
        {
          id: 'ai-project-simulation',
          title: 'Industry Simulation Sprint',
          description: 'Work an assigned ticket end-to-end: design, build, review prompts, and open a pull request.',
          estimatedMinutes: 40,
          order: 1,
          lessons: [
            {
              id: 'ai-project-simulation-l1',
              title: 'Sprint planning & AI product design',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `Sprint planning for AI features follows the same rhythm as any other engineering sprint, with an extra design question worth answering explicitly before writing any code: which AI approach actually fits this problem?

## A question worth asking for every AI ticket

Does this need a simple direct prompt, retrieval-augmented generation, or a full agent with tools? Reaching for an agent when a single well-designed prompt would do adds unnecessary complexity, cost, and failure surface — matching the approach to the actual problem, rather than defaulting to the most sophisticated option available, is itself a real design skill worth practicing.

## What a well-written AI ticket includes

- The specific task the AI feature needs to accomplish, described concretely
- What a good output looks like — ideally with a few real examples
- Any constraints: latency requirements, cost ceiling, data the feature is and isn't allowed to access

## Estimating AI work honestly

AI-related tickets often carry more uncertainty than typical feature tickets — you frequently don't know exactly how well a given prompting approach will perform until you've actually tried it against real, representative inputs. Flagging that uncertainty upfront, and planning time for a prototype-and-evaluate cycle rather than assuming the first approach will work, keeps the sprint's plan realistic.

## Picking up your ticket

Read the acceptance criteria fully, and think through which approach (prompt-only, RAG, agent) actually fits before writing any code — the design decision made here shapes everything that follows.`,
            },
            {
              id: 'ai-project-simulation-l2',
              title: 'Feature implementation & prompt reviews',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 2,
              content: `Implementing an AI feature follows a slightly different rhythm from typical application code — a fast prototype-and-evaluate loop matters more here than it does for most other kinds of engineering work.

## The typical shape of the work

1. Draft an initial prompt (or retrieval/agent design) and test it against a handful of representative inputs
2. Iterate based on what actually goes wrong — a vague instruction, missing context, an edge case the prompt doesn't handle
3. Once the approach is producing consistently good results, integrate it into the actual backend: proper error handling, rate limiting, logging
4. Test the full integration, not just the prompt in isolation — a good prompt wired into a broken integration still produces a broken feature

## Prompt reviews are a real, distinct part of code review

A pull request touching an AI feature should include not just the code, but the prompt itself and example outputs — a prompt is effectively part of the application's logic, and it deserves the same review scrutiny as any other logic, even though it's just a string. A reviewer should be able to look at a prompt and reasonably predict how it'll behave, the same way they'd read a function and predict what it does.

## Testing beyond the happy path

Test with malformed input, edge cases, and adversarial input specifically designed to break the feature (a message that tries to override the system prompt, for instance) — not just clean, well-behaved example inputs that make the feature look good without actually stress-testing it.`,
            },
            {
              id: 'ai-project-simulation-l3',
              title: 'Model testing & API integration',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `Testing AI features requires a different mindset than testing deterministic code — the same input can legitimately produce different, still-valid outputs across runs, so tests need to check *properties* of the output rather than exact equality.

## What to actually assert in a test

- **Structural correctness** — for structured output, does it match the expected schema
- **Presence of required elements** — does a summary actually mention the key points it's supposed to cover
- **Absence of forbidden content** — does the output avoid things it explicitly shouldn't include
- **Groundedness** — for RAG, are the claims made actually traceable back to the retrieved context

Exact string matching is almost never the right test for generative output — it's both too strict (rejecting equally valid phrasings) and not actually testing what matters (whether the output is *correct*, not whether it's *identical* to one specific example).

## API integration testing

Beyond the AI logic itself, the surrounding integration needs the same testing discipline as any other backend integration: what happens when the AI provider times out, what happens when it returns an error, what happens when a rate limit is hit. These failure modes are common enough in practice that they need real, deliberate handling — not an assumption that the AI call will simply always succeed.

## A test set that actually reflects reality

Building a test set from real or realistic examples — including past failures — and re-running it before merging any prompt or model change is what catches regressions before they reach production, rather than discovering a quality drop from a support ticket after the fact.`,
            },
            {
              id: 'ai-project-simulation-l4',
              title: 'Code review & performance optimization',
              contentType: 'code',
              estimatedMinutes: 10,
              order: 4,
              content: `AI feature code review covers the usual ground — code quality, error handling, security — plus a set of AI-specific concerns worth calling out explicitly.

\`\`\`js
// A reviewer should be checking for things like:
// - Is the API key handled securely (never exposed to the client)?
// - Is there a token/cost ceiling, or could this call spiral unbounded?
// - Is the prompt resistant to injection from user-controlled input?
// - Is there a fallback if the AI call fails or times out?
// - Is the output validated before being used downstream, not blindly trusted?
\`\`\`

## Performance optimization specific to AI features

- **Caching** repeated or near-identical queries rather than re-calling the model every time
- **Choosing the smallest model that reliably meets the quality bar**, rather than defaulting to the most capable (and most expensive, slowest) option
- **Parallelizing independent AI calls** — scoring five resumes concurrently rather than one at a time in sequence, where the task allows it

## Merge conflicts in AI-heavy code

The same Git mechanics apply here as anywhere else — conflict markers, resolving by understanding both sides' intent, keeping the correct combination. The one thing worth flagging specifically: if two branches both modify the same prompt independently, resolving the *text* conflict cleanly doesn't guarantee the *combined* prompt still makes sense as a whole — re-testing a merged prompt against your test set is worth doing even after a clean-looking Git merge.

## The sprint checkpoint

As with the other tracks, merge main into your branch regularly rather than letting it diverge for the length of the whole sprint — conflicts caught early stay small and manageable.`,
            },
          ],
          practice: [
            { id: 'ai-project-simulation-p1', title: 'Resolve your assigned sprint ticket end-to-end', kind: 'coding', order: 1 },
            { id: 'ai-project-simulation-p2', title: 'Fix a reported bug and verify it with QA testing', kind: 'debugging', order: 2 },
          ],
          submission: { id: 'ai-project-simulation-s1', title: 'Submit your sprint feature pull request', instructions: 'Link the pull request for the ticket you were assigned during the sprint.', requiresLink: true },
          assessment: { id: 'ai-project-simulation-checkpoint', title: '[Mentor Checkpoint] AI Workflow Review (Day 12)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'ai-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Mentor evaluation of your product-readiness before the capstone and client project allocation.',
      order: 4,
      modules: [
        {
          id: 'ai-readiness-eval',
          title: 'Product Readiness Evaluation (Day 15)',
          description: 'Your mentor reviews your AI product quality, prompt reliability, and collaboration before you begin the capstone.',
          order: 1,
          lessons: [
            {
              id: 'ai-readiness-eval-l1',
              title: 'What to expect from your product readiness review',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `This checkpoint exists to calibrate, not to gate — its purpose is making sure you enter the capstone with an honest, specific sense of where your AI engineering skills are strong and where they still need deliberate attention.

## What your mentor is specifically looking at

- **Prompt quality and reliability** — are your prompts specific, well-tested, and producing consistent results across a range of inputs, not just the one example you happened to try first
- **Grounding and hallucination awareness** — do you understand when and why a system might hallucinate, and have you built in reasonable safeguards where it matters
- **Architecture and integration** — is your AI logic properly separated from your application logic, are API keys handled securely, is there sensible error handling around AI calls
- **Collaboration** — how you handled sprint work, how you gave and received prompt-review feedback, whether you communicated uncertainty honestly rather than overstating confidence in an approach

## How to prepare

There's no separate assignment for this — it's a review of everything built across Days 1-14. The most useful preparation is honest reflection: which AI concept from this program — RAG, agent design, evaluation — still feels least solid, and what's the plan to strengthen it before the capstone actually needs it.

## What comes next

This feedback exists to shape your capstone approach — come ready to genuinely absorb it, not to defend every prompt or design choice you've made so far.`,
            },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'ai-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Capstone AI product, live demonstration, interview preparation, and certification.',
      order: 5,
      modules: [
        {
          id: 'ai-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Build and ship a production-ready AI-powered application, then present it live for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            {
              id: 'ai-graduation-capstone-l1',
              title: 'Capstone briefing & project options',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `The capstone is a complete AI-powered product you design, build, evaluate, and present — not a single prompt experiment, but a real application with the engineering discipline to back it up.

## What "production-ready" means for an AI product specifically

Beyond the AI feature working on a good example: reliable behavior across a representative range of inputs, sensible handling of failures and low-confidence cases, secure API key management, reasonable cost and latency, and honest, tested claims about what the system can and can't do.

## Project options

- **AI Resume Screening Platform** — parsing, scoring, and ranking candidates against role requirements
- **AI Interview Assistant** — generating and evaluating interview questions, or coaching a candidate through mock interview practice
- **Intelligent Career Coach** — personalized guidance grounded in a user's actual background and goals
- **AI Documentation Assistant** — RAG-based question answering over a real body of documentation
- **Customer Support Agent** — a grounded, tool-using agent handling common support scenarios
- **AI Learning Companion** — an adaptive assistant supporting a learner through course material

Pick something scoped enough to build to a genuinely high standard — a smaller, well-evaluated system with honest handling of its own limitations demonstrates far more engineering maturity than an ambitious one that only works on cherry-picked examples.

## What you'll actually be evaluated on

Architecture, prompt engineering quality, and how you handled evaluation and edge cases — not just whether the live demo looks impressive on the one example you rehearsed.`,
            },
            {
              id: 'ai-graduation-capstone-l2',
              title: 'Interview & portfolio preparation',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Your capstone AI product is also your strongest portfolio piece and interview talking point — a system whose design decisions you can explain in real depth, including the trade-offs behind them.

## Presenting AI work well

- Lead with the problem and why an AI approach genuinely fits it — not every problem needs AI, and being able to articulate *why this one does* signals real product judgment
- Be ready to explain your architecture decisions specifically: why RAG over a fine-tuned model, why an agent over a simpler direct prompt, and what you'd reconsider with more time
- Show a concrete example of a failure mode you found and how you addressed it — hallucination, an edge case, a prompt injection attempt — this demonstrates real engineering rigor far better than a project that "just worked" on every input you tried

## Common AI engineering interview topics worth reviewing

- LLM architecture fundamentals: what a transformer model is doing at a conceptual level, tokens, embeddings, context windows
- Prompt engineering: system prompts, few-shot examples, chain-of-thought, structured outputs
- RAG system design: chunking strategy, retrieval quality, grounding
- Agent design: planning, tool use, when an agent is (and isn't) the right architecture
- Practical debugging: given a system producing wrong answers, how would you diagnose whether it's a retrieval problem, a prompt problem, or a genuine model limitation

## Live demonstrations

Have a backup plan if a live AI call is slow or produces an unexpected result during your demo — showing you can handle an imperfect live moment gracefully is itself a meaningful signal, arguably more useful to an evaluator than a demo that goes flawlessly and reveals nothing about how you think under pressure.`,
            },
          ],
          practice: [],
          submission: { id: 'ai-graduation-capstone-s1', title: 'Submit your capstone AI project for certification review', instructions: 'Include your deployed app link, repository link, and AI architecture diagram. Your mentor reviews functionality, AI accuracy, and engineering quality before certification.', requiresLink: true },
          assessment: { id: 'ai-graduation-final', title: '[Mentor Checkpoint] Final AI Product Demonstration (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
