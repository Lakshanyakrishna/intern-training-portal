import type { TrainingTrackConfig } from './types';

// Lumora UI/UX Design Internship Program handbook (18-20 day fast track).
// Days map onto modules following the handbook's own phase boundaries
// (Days 1-4 -> Foundation, 5-9 -> Development, 10-14 -> Project design
// sprint, 15 -> Readiness, 16-18 -> Graduation capstone) -- the same
// Program -> Stage -> Module -> Lesson/Practice/Challenge/Assessment/
// Submission schema as frontend.ts/backend.ts/ai.ts/mobile.ts, so the
// existing generic UI needs no changes. Each day's "Exercise" maps to
// `practice`, its "Assignment" maps to `challenge` (a harder, distinct
// step the module page renders separately) -- this handbook is the only
// one of the five that gives every foundation/development day both, so
// the mapping is used consistently through Day 9. The three "Mentor
// Review" checkpoints (Days 4, 9, 14) and the Day 18 capstone
// presentation are wired in as module assessments; the Day 15 "Design
// Review Session" stays a bare module, same as every other track's
// Readiness stage -- that evaluation runs through the app's separate
// real ReadinessEvaluation admin flow. Every lesson's `content` is real
// written material derived from the handbook's own topic list -- see
// LessonConfig in ./types.ts for the markdown-lite subset it's written in.
export const uiuxTrack: TrainingTrackConfig = {
  forte: 'UI / UX Design',
  trackName: 'UI / UX Design',
  description: 'An 18-day, mentor-led, project-based UI/UX design program: research, information architecture, visual design systems, prototyping, and a capstone platform design -- per the Lumora UI/UX Design Internship Program handbook.',
  stages: [
    {
      id: 'uiux-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Product design process, user research, information architecture, and wireframing.',
      order: 1,
      modules: [
        {
          id: 'uiux-foundation-intro',
          title: 'Day 1 · Introduction to Product Design',
          description: 'UI vs UX, the product design process, and the Lumora design workflow.',
          estimatedMinutes: 55,
          order: 1,
          lessons: [
            {
              id: 'uiux-foundation-intro-l1',
              title: 'UI vs UX',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `These two terms get used almost interchangeably in casual conversation, but they describe genuinely different (though closely related) disciplines — and understanding the distinction shapes how you approach every project that follows.

## UX: the experience as a whole

User Experience design is concerned with *how something works* — the flow a user moves through, the logic of the information architecture, how easy it is to accomplish a goal, how the product feels to actually use from start to finish. UX work often happens before a single pixel is styled: research, flows, wireframes, testing.

## UI: the surface a user touches

User Interface design is concerned with *how something looks and feels moment to moment* — typography, color, spacing, the visual weight of a button, the specific interaction detail of a toggle switch. UI is what you see; UX is the reasoning underneath why it's arranged and structured that way in the first place.

## Why the distinction matters practically

A beautifully designed UI on top of a confusing, poorly-structured UX still fails — users get lost regardless of how polished each individual screen looks. And a perfectly logical UX with a rough, inconsistent UI feels unfinished and untrustworthy, even if every flow technically works. Strong product design requires both working together, which is exactly why this program moves from UX fundamentals (Days 1-4) into UI craft (Days 5-9) before combining them on a real project.`,
            },
            {
              id: 'uiux-foundation-intro-l2',
              title: 'Product design process & design thinking',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Design thinking is a structured approach to solving problems for real people — it's the underlying process most professional product design work actually follows, whether or not a team explicitly names it.

## The five stages

1. **Empathize** — understand the actual people you're designing for: their goals, frustrations, and context, not your own assumptions about them
2. **Define** — turn what you learned into a clear, specific problem statement worth solving
3. **Ideate** — generate a genuinely wide range of possible solutions before narrowing down, rather than jumping to the first idea that comes to mind
4. **Prototype** — build a low-cost, testable version of a solution — a wireframe, a sketch, a clickable mockup
5. **Test** — put the prototype in front of real users and learn from how they actually respond, not how you assumed they would

## Why this isn't strictly linear

Real design work loops back constantly — testing often reveals the problem definition itself was wrong, sending you back to redefine before moving forward again. Treating design thinking as a rigid, one-way pipeline misses the point; the value is in the willingness to revisit earlier stages when new information demands it, not in following the five steps once, in order, and calling it done.

## Why this matters for engineers-turned-designers, and vice versa

If you're coming from a technical background, design thinking will feel familiar in spirit to iterative software development — build something small, test it against reality, adjust based on what you learn, repeat. The core discipline is the same: don't fall in love with your first idea before it's actually been tested against real users.`,
            },
            {
              id: 'uiux-foundation-intro-l3',
              title: 'Role of a UI/UX designer & the Lumora design workflow',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `A product designer's job spans a wider range of responsibilities than "making things look nice" — understanding the full scope of the role from Day 1 sets realistic expectations for what this program is training you to actually do.

## What the role actually covers

- Understanding user needs through research, not assumption
- Structuring information and flows so a product is genuinely easy to use, not just visually appealing
- Crafting a coherent visual language — typography, color, spacing — applied consistently across an entire product
- Collaborating closely with engineers to ensure designs are genuinely buildable, not just beautiful in a design file
- Advocating for the user inside the room, especially when business pressure pulls toward shortcuts that would hurt the actual experience

## The Lumora design workflow

Design work here moves through the same broad structure as the program itself: research and problem definition, structure (information architecture and flows), interface design (visual system and components), prototyping, and developer handoff. Each stage produces a concrete deliverable that the next stage builds directly on — a flow informs a wireframe, a wireframe informs a high-fidelity screen, a screen informs a prototype.

## Working with developers, not just handing off to them

The best design outcomes come from designers who understand enough about implementation constraints to design things that are genuinely buildable — and engineers who understand enough about design intent to preserve it faithfully during implementation. This program's later developer-handoff module (Day 16) exists specifically because that collaboration is where a lot of design intent is otherwise lost.`,
            },
          ],
          practice: [
            { id: 'uiux-foundation-intro-p1', title: 'Analyze 3 popular apps and identify good and bad UX', kind: 'interactive', order: 1 },
          ],
          challenge: { id: 'uiux-foundation-intro-c1', title: 'Write a UX audit for an existing application', kind: 'file-upload', description: "The day's assignment -- a harder, take-home deliverable beyond the in-class exercise.", order: 1 },
        },
        {
          id: 'uiux-foundation-research',
          title: 'Day 2 · User Research',
          description: 'Personas, journey mapping, empathy maps, and problem statements.',
          estimatedMinutes: 55,
          order: 2,
          lessons: [
            {
              id: 'uiux-foundation-research-l1',
              title: 'User personas',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A persona is a semi-fictional representation of a real user segment, built from actual research rather than invented from assumption — its job is to keep design decisions grounded in a specific, real kind of person instead of an abstract, imaginary "everyone."

## What a useful persona actually contains

- **Goals** — what is this person trying to accomplish by using the product
- **Frustrations and pain points** — what currently gets in their way, in this product or a comparable one
- **Context** — when, where, and under what conditions do they actually use this kind of product
- **Relevant background** — only details that genuinely affect design decisions, not decorative biographical filler that doesn't change anything about how you'd design for them

## The mistake worth avoiding

A persona built from imagination rather than real research or data is worse than no persona at all — it creates false confidence, letting a team believe they understand their users when they're actually just designing for a stereotype they made up. Personas should be built from real interviews, real usage data, or realistic, well-reasoned assumptions explicitly flagged as such, not treated as settled fact.

## Using a persona in practice

A well-built persona earns its place by being referenced during actual design decisions — "would this genuinely work for [persona name], given their specific context and goals?" A persona created once and never looked at again isn't actually doing any work; it's decoration.`,
            },
            {
              id: 'uiux-foundation-research-l2',
              title: 'User journey mapping & empathy maps',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Both of these tools help a design team see a product from the user's actual point of view — journey mapping across time, empathy mapping across a single moment.

## Journey mapping

A journey map lays out the full sequence of steps a user goes through to accomplish a goal — discovering the product, signing up, completing a core task, and beyond — along with their thoughts, emotions, and friction points at each stage. Mapped visually, a journey often reveals problems that aren't visible when looking at any single screen in isolation: a moment of confusion between two steps, an unnecessary detour, a point where users are likely to drop off entirely.

## Empathy maps

An empathy map captures what a user is likely thinking, feeling, saying, and doing at one specific moment or in one specific context — a compact tool for building genuine understanding of a user's mental and emotional state, not just their literal clicks and actions.

## Why both matter for the same underlying reason

It's easy, especially as a designer who deeply understands a product, to lose sight of how confusing or effortful it can feel to someone encountering it for the first time. Both of these tools exist specifically to counteract that — forcing a deliberate, structured perspective shift from "how the product works" to "how a specific user actually experiences it," which are frequently not the same thing at all.

## Building these from real input

Like personas, journey and empathy maps are only as good as what they're built from. Real user interviews, support tickets, or usage analytics produce a far more useful map than pure assumption — treat these as tools for organizing real evidence, not as creative writing exercises.`,
            },
            {
              id: 'uiux-foundation-research-l3',
              title: 'User interviews & problem statements',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `User interviews are one of the most direct ways to understand real user needs — and how well you conduct one significantly affects how useful what you learn actually is.

## Conducting a genuinely useful interview

- **Ask open-ended questions** — "walk me through the last time you did this" reveals far more than "do you like this feature?", which tends to produce a shallow yes/no with little real insight
- **Ask about past behavior, not hypothetical future behavior** — what someone actually did is a much more reliable signal than what they predict they'd do, since people are often inaccurate at forecasting their own future behavior
- **Avoid leading questions** — "don't you find this confusing?" nudges toward a particular answer rather than genuinely discovering what the person actually thinks
- **Listen more than you talk** — the interviewer's job is to draw out the user's genuine experience, not to explain or defend the product's design decisions mid-interview

## From research to a problem statement

A problem statement distills research findings into a clear, specific, and actionable articulation of the actual problem worth solving. "Users are confused" is too vague to act on. "First-time applicants abandon the application form when they reach the resume upload step because the accepted file types aren't stated anywhere" is specific enough to actually design against.

## Why the problem statement matters so much

A well-defined problem statement keeps a design effort focused on solving something real, rather than drifting into generating solutions for a vaguely-understood, poorly-articulated issue — a large share of wasted design effort traces back to skipping this step and moving straight to visual solutions before the actual problem was ever clearly defined.`,
            },
          ],
          practice: [
            { id: 'uiux-foundation-research-p1', title: 'Create a persona for an internship platform', kind: 'file-upload', order: 1 },
          ],
          challenge: { id: 'uiux-foundation-research-c1', title: 'Build a journey map', kind: 'file-upload', description: "The day's assignment -- a harder, take-home deliverable beyond the in-class exercise.", order: 1 },
        },
        {
          id: 'uiux-foundation-ia',
          title: 'Day 3 · Information Architecture',
          description: 'Site maps, navigation systems, content hierarchy, and user flows.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            {
              id: 'uiux-foundation-ia-l1',
              title: 'Site maps & navigation systems',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Information architecture is the structural skeleton underneath a product — how content and features are organized, grouped, and connected — and it's largely invisible when done well, and glaringly obvious when done poorly.

## What a site map actually shows

A site map lays out every page or screen in a product and how they relate to and connect with each other — not the visual design of any individual screen, just the overall structure. Building one early forces explicit decisions about grouping (what belongs together) and hierarchy (what's more or less important) before any visual design work begins.

## Navigation systems

- **Primary navigation** — the main way users move between a product's top-level sections, usually always visible
- **Secondary navigation** — sub-sections within a primary area, visible only once you've entered that area
- **Contextual navigation** — links or actions that appear based on the specific content currently in view, not always present

## The core principle behind good IA

Users should always be able to answer three questions without effort: where am I, where can I go from here, and how do I get back to where I was. A navigation system that leaves users unsure of any of these three things is a genuine, correctable structural problem, not a minor visual detail — and it's usually worth fixing at the IA level rather than trying to paper over with visual styling alone.

## Designing IA before visual design

Skipping straight to visual design without first working through the underlying structure tends to produce a product that looks appealing but is genuinely confusing to navigate. Getting the structure right first is a large part of why this module comes before the visual design work in Days 5-9.`,
            },
            {
              id: 'uiux-foundation-ia-l2',
              title: 'Content hierarchy',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 2,
              content: `Content hierarchy is the deliberate ordering of information by importance — what a user sees first, second, and last, both across a whole page and within any individual section of it.

## Why hierarchy matters so much

Users don't read a screen top to bottom, left to right, word for word — they scan, and hierarchy is what guides that scan toward what actually matters most. Without a deliberate hierarchy, every element competes equally for attention, and a user is left to guess what's actually important on their own, which they usually won't do carefully or correctly.

## Tools for establishing hierarchy

- **Size** — larger elements read as more important
- **Position** — content positioned higher and further left (in left-to-right reading contexts) tends to get noticed first
- **Contrast** — a high-contrast element stands out against lower-contrast surroundings
- **Whitespace** — isolating an element with generous surrounding space draws attention to it, the same way a pause in speech emphasizes what comes next

## A common mistake: hierarchy through decoration instead of structure

Making everything bold, everything a bright color, or everything the same large size defeats the entire purpose of hierarchy — if everything is emphasized, nothing actually is. Genuine hierarchy requires real, deliberate restraint: most content should recede so that what actually matters most can stand out clearly against it.

## Testing hierarchy quickly

A useful, low-cost test: squint at a screen (or blur it) until individual words are illegible. What still visually stands out is what your hierarchy is actually communicating — if the wrong thing is dominant, or nothing is, that's the hierarchy telling on itself before a single user ever needs to say so.`,
            },
            {
              id: 'uiux-foundation-ia-l3',
              title: 'User flows & task flows',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `A user flow maps the path a user takes through a product to accomplish a specific goal — the sequence of screens and decisions between "I want to do X" and actually having done it.

## User flows vs. task flows

A task flow is typically linear — a straightforward, single path with no real branching, useful for simple, well-defined actions (resetting a password, for instance). A user flow is broader and includes decision points and branches — what happens if a step fails, what alternate paths exist, what a user does if they change their mind partway through.

## Why mapping flows before designing screens matters

A flow diagram makes the *structure* of an interaction visible and reviewable before any visual design work is invested — it's far cheaper to notice a flow has an awkward dead end, a missing back-navigation option, or an unnecessary step while it's still a simple diagram than after several polished screens have already been built around a flawed underlying structure.

## What a good flow diagram includes

- Every screen or state the user might genuinely encounter, including error states and edge cases, not just the ideal happy path
- Every decision point, and what happens down each resulting branch
- Entry and exit points — where does this flow actually begin, and what marks it as genuinely complete

## Designing for the edges, not just the happy path

The happy path (everything goes smoothly) is usually the easiest part of a flow to design well. The real craft is in the edges: what happens on a validation error, what happens if a user abandons partway through and comes back later, what happens if something the flow depends on fails unexpectedly. A flow that only accounts for the ideal case isn't actually finished.`,
            },
          ],
          practice: [
            { id: 'uiux-foundation-ia-p1', title: 'Create a sitemap', kind: 'file-upload', order: 1 },
          ],
          challenge: { id: 'uiux-foundation-ia-c1', title: 'Design the user flow for the applicant journey', kind: 'file-upload', description: "The day's assignment -- a harder, take-home deliverable beyond the in-class exercise.", order: 1 },
        },
        {
          id: 'uiux-foundation-wireframing',
          title: 'Day 4 · Wireframing',
          description: 'Low-fidelity wireframes, layout principles, spacing, and grid systems.',
          estimatedMinutes: 60,
          order: 4,
          lessons: [
            {
              id: 'uiux-foundation-wireframing-l1',
              title: 'Low-fidelity wireframes',
              contentType: 'image',
              estimatedMinutes: 15,
              order: 1,
              content: `A low-fidelity wireframe is a deliberately rough, simplified representation of a screen's layout — boxes, lines, and placeholder text standing in for real content and styling — used to work through structure fast, before investing time in visual polish.

## Why deliberately rough, on purpose

Low fidelity keeps the conversation focused on layout and structure — where things sit, how much space they take, what the overall hierarchy is — without visual polish distracting from those more foundational questions. A rough wireframe also invites faster, more honest feedback: reviewers are far more comfortable suggesting a structural change to a rough sketch than to something that already looks close to finished, where feedback can feel like criticizing "real" work.

## What belongs in a wireframe

- Layout and general placement of key elements
- Approximate content length (a placeholder line of a realistic length, not literal lorem ipsum that obscures how real content would actually fit)
- Basic hierarchy — what's clearly emphasized versus what's secondary

## What deliberately doesn't belong yet

Specific colors, exact typography, polished iconography, final copy — all of that comes later, once the underlying structure is validated and settled. Introducing visual polish too early risks anchoring a review conversation on surface-level opinions ("I don't like that color") instead of the structural questions wireframing is actually meant to answer.

## Speed is the entire point

Wireframes should be fast to produce and fast to revise — if a wireframe is taking as long to create as a polished screen would, something about the process has drifted away from what wireframing is actually for.`,
            },
            {
              id: 'uiux-foundation-wireframing-l2',
              title: 'Layout principles, spacing & visual hierarchy',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `A handful of layout principles show up again and again across good design work, across every tool and platform — they're worth internalizing early since they'll inform essentially everything you design going forward.

## Alignment

Elements that share an edge — left-aligned text, evenly aligned form fields — read as organized and intentional. Misaligned elements, even by a small, easy-to-miss amount, create a subtle but real sense that something is off, even when a viewer can't immediately articulate exactly what's wrong.

## Proximity

Elements that are related should be positioned close together; elements that are unrelated should have more space between them. This is one of the simplest, highest-leverage tools for communicating structure and grouping without needing a single visible dividing line or border.

## Consistency

Repeated patterns — the same spacing rhythm, the same alignment approach — used consistently throughout a product let users learn a system once and then reliably apply that same understanding everywhere else in it, rather than needing to relearn the interface's logic on every new screen.

## Spacing as a genuinely deliberate system

Rather than picking spacing values arbitrarily on a case-by-case basis, most professional design systems use a spacing scale — a fixed, limited set of values (commonly increments of 4px or 8px) applied consistently everywhere. This produces visual rhythm and consistency automatically, and it's exactly the same underlying principle as design tokens in an engineering design system — a small, deliberate set of values, reused everywhere, rather than one-off numbers invented fresh for every single case.`,
            },
            {
              id: 'uiux-foundation-wireframing-l3',
              title: 'Grid systems',
              contentType: 'image',
              estimatedMinutes: 10,
              order: 3,
              content: `A grid system is an invisible structural framework — columns and consistent spacing — that layouts align to, giving a design a sense of underlying order even when a viewer never consciously notices the grid itself.

## Why grids matter

Without a grid, every element's position is a one-off decision, and small inconsistencies accumulate across a product — one screen's card is 24px from the edge, another's is 28px, for no real reason. A grid removes that ambiguity: elements align to defined columns and a defined gutter width, producing visual consistency automatically rather than depending on painstaking manual attention to get right, and staying right, everywhere.

## A typical grid setup

- **Desktop**: commonly a 12-column grid, giving flexible options for how content can be divided and combined across the available width
- **Tablet**: often 8 columns, reflecting the narrower available space
- **Mobile**: often 4 columns, or sometimes a single flexible column depending on how much genuine layout variation the design needs at that size

## Grids and responsive design

A well-designed grid system is what makes translating a layout across screen sizes coherent rather than ad hoc — content that spans 6 of 12 columns on desktop has a clear, principled equivalent at tablet and mobile widths, rather than needing an arbitrary, disconnected redesign at every single breakpoint.

## Breaking the grid deliberately

Occasionally breaking the grid — letting one element intentionally deviate — can create emphasis, precisely because it stands out against an otherwise consistent structure. This only works as a genuine technique when the grid is followed consistently everywhere else; breaking a grid that was never really established in the first place doesn't read as intentional emphasis, it just reads as inconsistency.`,
            },
          ],
          practice: [
            { id: 'uiux-foundation-wireframing-p1', title: 'Sketch dashboard wireframes', kind: 'file-upload', order: 1 },
          ],
          challenge: { id: 'uiux-foundation-wireframing-c1', title: 'Wireframe the Applicant Interface', kind: 'file-upload', description: "The day's assignment -- a harder, take-home deliverable beyond the in-class exercise.", order: 1 },
          assessment: { id: 'uiux-foundation-checkpoint', title: '[Mentor Checkpoint] Mentor Review 1 (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'uiux-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-9 · Figma fundamentals, visual design, components, responsive design, and prototyping.',
      order: 2,
      modules: [
        {
          id: 'uiux-development-figma',
          title: 'Day 5 · Figma Fundamentals',
          description: 'Frames, components, auto layout, constraints, and variables.',
          estimatedMinutes: 45,
          order: 1,
          lessons: [
            {
              id: 'uiux-development-figma-l1',
              title: 'Frames & components',
              contentType: 'video',
              estimatedMinutes: 15,
              order: 1,
              content: `Figma is the industry-standard tool for interface design, and its two most foundational concepts — frames and components — are worth understanding thoroughly before anything else, since nearly everything you build sits on top of them.

## Frames

A frame is Figma's container for a screen or a section of layout — similar in spirit to an \`<div>\` or a \`Container\` in code, but with built-in support for responsive resizing behavior, clipping content to its bounds, and holding structured, nested content. Every screen you design starts as a frame.

## Components

A component is a reusable, master version of an element — a button, a card, a form field — that can be placed anywhere in a file as an *instance*. Editing the master component propagates that change to every instance automatically, which is the exact same underlying idea as a reusable code component: define the pattern once, and every place it's used updates together, consistently, without manual duplication.

## Why this distinction is worth understanding deeply, not just operationally

Designing with components from the start — rather than manually duplicating and tweaking similar-looking elements — is what makes a design system actually maintainable as a product grows. A button redesigned as a component updates everywhere it's used in one action; a button that was copy-pasted forty separate times across a file needs forty individual manual edits, and inevitably, a few of them get missed or drift out of sync over time.

## Instances and overrides

An instance can override specific properties (text, an icon, a color variant) without breaking its connection back to the master component — this is what lets one button component serve as a primary button, a secondary button, and a danger button, all while remaining a single, centrally maintained component underneath.`,
            },
            {
              id: 'uiux-development-figma-l2',
              title: 'Auto layout & constraints',
              contentType: 'video',
              estimatedMinutes: 15,
              order: 2,
              content: `Auto layout is what makes Figma designs behave dynamically rather than as static, fixed-size images — it's the direct design-tool equivalent of flexbox in CSS, and understanding it well is what separates designs that translate cleanly into real, working code from ones that don't.

## What auto layout actually does

Applied to a frame, auto layout automatically arranges its children in a row or column, with consistent spacing and padding you define once — add or remove content, and the frame resizes and reflows automatically, the same way a flexbox container does in the browser. This is a significant improvement over manually positioning every element by hand and needing to re-adjust everything whenever content changes.

## Constraints

Constraints define how an element behaves when its parent frame is resized — pinned to the top, stretching to fill available width, centered regardless of the parent's size. Getting constraints right is what makes a design's behavior across different screen sizes predictable, rather than needing an entirely separate, manually-built design for every possible width.

## Why this genuinely matters for developer handoff

A design built with auto layout and well-considered constraints maps far more directly onto how a frontend engineer will actually implement it in code — the design tool's own spacing and sizing behavior closely mirrors real CSS flexbox behavior. A design built without these tools, using manual, fixed pixel positioning throughout, forces the engineer to reverse-engineer the *intended* responsive behavior from a single static screenshot, which is slower, more error-prone, and a common, avoidable source of design-to-code inconsistency.

## Building the habit early

Using auto layout by default, rather than as an occasional special case reached for only when convenient, is what makes designs genuinely resilient to real content — content that's longer or shorter than your original placeholder text, which is essentially guaranteed to happen once real data enters the picture.`,
            },
            {
              id: 'uiux-development-figma-l3',
              title: 'Variables',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `Figma's variables feature lets you define reusable values — colors, spacing, typography — once, and reference them throughout a file, rather than hardcoding the same raw value repeatedly in dozens of separate places.

## Why this matters, and to whom it should sound familiar

This is the exact same design-tokens concept engineers rely on in code — a single named value (\`accent-color\`, \`spacing-md\`) referenced everywhere it's needed, changed once, and updated everywhere it's used automatically. Variables in Figma are the design-tool-side half of that same shared underlying idea, and keeping them consistent with what engineering actually implements is a meaningful part of what makes design-to-development handoff smooth rather than lossy.

## What's commonly defined as a variable

- Color values (and, critically, semantic aliases like "accent" or "surface" rather than just raw hex codes — a value with a role, not just a color)
- Spacing values, matching a defined spacing scale
- Typography styles — font, size, weight, line height, bundled together as one named, reusable style

## Modes: supporting light and dark themes

Figma variables support multiple *modes* — the same variable name (\`background\`) can resolve to a different actual value depending on which mode (light or dark) is active, letting you design both themes using the exact same underlying components and layouts, changing only the resolved values beneath them, not the structure itself.

## The payoff of doing this properly

A file built entirely on well-organized variables can have its entire visual system updated — a rebrand, a new accent color, a refined spacing scale — by changing a small number of variable definitions, rather than manually hunting down and updating every individual instance of an old, hardcoded value scattered throughout the file.`,
            },
          ],
          practice: [
            { id: 'uiux-development-figma-p1', title: 'Recreate an existing landing page in Figma', kind: 'file-upload', order: 1 },
          ],
        },
        {
          id: 'uiux-development-visual',
          title: 'Day 6 · Visual Design',
          description: 'Typography, color systems, contrast, icons, and accessibility.',
          estimatedMinutes: 45,
          order: 2,
          lessons: [
            {
              id: 'uiux-development-visual-l1',
              title: 'Typography',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Typography carries far more of a product's actual usability and personality than it might initially seem — most of what a user reads on any given screen is text, which makes typographic decisions genuinely high-leverage, not a minor finishing touch.

## Building a type scale

A type scale is a defined, limited set of font sizes used consistently throughout a product — commonly following a ratio-based progression (each size a consistent multiple of the one below it) so the overall hierarchy feels proportionate and deliberate rather than arbitrary. Picking sizes freely and inconsistently, screen by screen, tends to produce a visually chaotic result even if each individual screen looks fine considered entirely in isolation.

## Font pairing

Most products use one or two typefaces total — often a single versatile family across multiple weights, or a distinct pairing (a distinctive display face for headings alongside a highly legible body face) for a bit more visual character. More than two typefaces in a single product is uncommon and often reads as visually unfocused rather than intentional.

## Legibility fundamentals

- **Line height** — roughly 1.4-1.6x the font size for body text is a reliable, comfortable default for extended reading
- **Line length** — somewhere around 50-75 characters per line reads most comfortably; lines that are too long or too short both measurably increase reading effort and fatigue
- **Font size** — body text should rarely go below 14-16px on most digital products; smaller sizes create real accessibility problems, particularly for older or visually-impaired users

## Typography as brand voice

Beyond pure legibility, typeface choice communicates tone — a rounded, friendly typeface reads very differently from a sharp, geometric one, even when displaying the exact same words. This is a genuine design decision worth making deliberately, not a default left unconsidered.`,
            },
            {
              id: 'uiux-development-visual-l2',
              title: 'Color systems & contrast',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `A color system is a deliberate, limited palette with defined roles — not just "colors that look good together," but colors assigned specific, consistent jobs throughout the product.

## What a well-structured color system typically includes

- **Neutrals** — a range of grays (or a subtly tinted near-gray) used for text, borders, and backgrounds — usually the colors used most extensively throughout any real interface
- **An accent or brand color** — used deliberately and somewhat sparingly, for primary actions and key emphasis, so it retains genuine visual weight rather than being diluted through overuse everywhere
- **Semantic colors** — distinct colors specifically for success, warning, and error states, kept separate from the brand accent so a status color never gets confused with a purely decorative one

## Contrast and accessibility

WCAG AA requires a 4.5:1 contrast ratio between text and its background for normal-sized text (3:1 for large text) — this isn't a nice-to-have suggestion, it's the baseline needed for genuinely legible content for a meaningful share of real users, including anyone with low vision, and it noticeably helps everyone else too, especially in bright or low-quality viewing conditions.

## Checking contrast, not just eyeballing it

A color combination can look fine to a designer's own eye on a calibrated monitor and still fail contrast requirements in practice. Using an actual contrast checker (built into Figma, or available as a dedicated tool) rather than relying on visual judgment alone is the only reliable way to confirm text is genuinely legible for the range of people who'll actually be reading it.

## Color alone is never enough to convey meaning

Never rely purely on color to communicate something important — a red border alone marking an error is invisible to a colorblind user. Pairing color with an icon, a label, or a text change ensures the same information reaches everyone, not just users with fully typical color vision.`,
            },
            {
              id: 'uiux-development-visual-l3',
              title: 'Icons & accessibility',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `Icons are a compact, universal visual language — when used well, they communicate meaning instantly; when used poorly, they add genuine ambiguity and confusion instead of clarity.

## Choosing and using icons well

- **Consistency of style** — mixing outline icons with filled icons, or icons from several different sets with subtly different visual weights and details, reads as visually unpolished even when each individual icon looks fine in isolation
- **Recognizability** — favor icons with a widely-understood, conventional meaning (a magnifying glass for search, a trash can for delete) over a novel symbol that requires a user to learn what it means from scratch, with no real payoff for the added ambiguity
- **Pairing with labels** — an icon alone is genuinely ambiguous more often than designers tend to assume; a label alongside it (or at minimum a well-written accessible label, even if visually hidden) removes that ambiguity entirely, for every user

## Accessibility beyond color contrast

- **Touch target size** — interactive elements need to be large enough to tap reliably and comfortably, generally at least 44×44px, especially relevant for icon-only buttons that might otherwise be rendered visually smaller than that
- **Alt text for meaningful images** — any image conveying real information (not purely decorative) needs a text alternative a screen reader can announce to a user who can't see the image itself
- **Focus states** — every interactive element needs a visible state indicating keyboard focus, exactly as covered in the frontend accessibility material, since it's just as much a design responsibility as an implementation one — a focus state has to actually be designed, not left for an engineer to improvise

## Designing accessibly from the start

Retrofitting accessibility into an already-finished design is dramatically more expensive than designing with it in mind from the beginning. A color palette that passes contrast requirements from the outset, icons consistently paired with labels, and touch targets sized correctly from the first draft all cost nothing extra when built in from day one — and a great deal more to fix after the fact.`,
            },
          ],
          practice: [
            { id: 'uiux-development-visual-p1', title: 'Build a color system', kind: 'file-upload', order: 1 },
          ],
        },
        {
          id: 'uiux-development-components',
          title: 'Day 7 · Components',
          description: 'Design systems, buttons, inputs, cards, and reusable components.',
          estimatedMinutes: 50,
          order: 3,
          lessons: [
            {
              id: 'uiux-development-components-l1',
              title: 'Design systems overview',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A design system is a shared, documented library of components, patterns, and principles that a product's design and engineering consistently draw from — it's what keeps a large or fast-growing product feeling coherent even as many different people contribute to it over time.

## What a design system typically includes

- **Foundations** — the color palette, type scale, spacing scale, and other base design tokens
- **Components** — buttons, inputs, cards, navigation patterns, and every other reusable interface element, each with defined variants and states
- **Patterns** — larger, established solutions to common, recurring problems (how a form validates and reports errors, how an empty state should generally look and read)
- **Guidelines** — the documented reasoning for when and how to use each piece correctly, and what specifically to avoid

## Why a design system earns the investment

Without one, every screen risks becoming a slightly different, independently-invented reimplementation of the same underlying ideas — a form field styled slightly differently on three different screens, spacing that's inconsistent from one section to the next for no real reason. A design system doesn't just look better; it measurably speeds up future design work, since new screens compose from existing, already-solved pieces rather than starting from a blank canvas every single time.

## Building a design system incrementally

Especially at the start of a product, waiting to have every possible pattern designed and documented before building anything is impractical and unrealistic. Most real design systems grow organically — extracted from actual product work as genuine repetition emerges, then formalized and documented once a pattern has proven itself, rather than exhaustively speculated on and designed upfront in isolation from real usage.

## Consistency is a form of respect for the user

A consistent system means a user only has to learn how the product works once — encountering a button that behaves the way every other button in the product already behaves. Inconsistency, even when each individual instance looks fine in isolation, quietly adds real cognitive load across the entire product.`,
            },
            {
              id: 'uiux-development-components-l2',
              title: 'Buttons, inputs & cards',
              contentType: 'video',
              estimatedMinutes: 15,
              order: 2,
              content: `These three components appear more often than almost anything else in a typical product — designing them well, with every state genuinely accounted for, pays off across the entire rest of the design.

## Buttons

A complete button component needs every real state designed, not just its default appearance: default, hover, pressed/active, disabled, and loading. A button with only a default state designed leaves an engineer improvising the rest, which reliably produces visual inconsistency between what the designer intended and what actually ships.

## Inputs

A text input similarly needs its full range of states designed: empty (with placeholder text), focused, filled, error, and disabled. Error states specifically need real, deliberate design attention — where does the error message appear, what visual treatment does the input itself take on, how does this all fit into the overall page layout without noticeably shifting other content around it.

## Cards

A card is a flexible container used to group related content — an opportunity listing, a stat summary, a user profile preview. Good card design keeps internal spacing and hierarchy consistent across every place a card gets used, and defines clearly how a card responds to varying amounts of content (a longer title, an optional secondary line of text that's sometimes present and sometimes not) rather than only being designed against one convenient, idealized example.

## Why these three specifically deserve extra care

Because buttons, inputs, and cards repeat constantly throughout a real product, a small design flaw in any one of them compounds visibly across dozens or hundreds of instances. Getting these three genuinely right, with every state properly accounted for, delivers an outsized return relative to the design time actually invested in them.`,
            },
            {
              id: 'uiux-development-components-l3',
              title: 'Navigation & reusable components',
              contentType: 'video',
              estimatedMinutes: 15,
              order: 3,
              content: `Navigation components — headers, sidebars, tab bars, breadcrumbs — need particular design care, because they appear on nearly every single screen and directly shape how confidently users can find their way around the entire product.

## Designing a navigation component well

- **Active state clarity** — it should always be immediately obvious which section a user is currently in, through a clear, consistent visual treatment applied the same way everywhere
- **Consistent placement** — navigation should generally stay in the same location across screens; moving it around between different sections of a product creates real, unnecessary disorientation
- **Scalability** — a navigation design tested only against 4 menu items may break down entirely once real content grows to 12 — design and test against a realistic range of content, not just a convenient, idealized minimum

## Building genuinely reusable components more broadly

- Design for the range of realistic content a component will actually need to handle, not just one convenient example — a card component tested with only a short title will often break in subtle, easy-to-miss ways once a genuinely long one is used in production
- Build in the flexibility a component actually needs (optional icon, optional secondary text) without over-engineering options that will never realistically be used — unused flexibility just adds complexity for no real payoff
- Name components and their variants clearly and consistently, so anyone can find and correctly use the right one without needing to ask, or without landing on a subtly wrong option by mistake

## The connection to engineering component design

This mirrors the same principles engineers apply when designing reusable code components — sensible, well-considered defaults, a small, closed set of clearly-named variants, and genuine flexibility for realistic content, avoiding the trap of designing rigidly for only one convenient, idealized case.`,
            },
          ],
          practice: [
            { id: 'uiux-development-components-p1', title: 'Create a reusable UI kit', kind: 'file-upload', order: 1 },
          ],
        },
        {
          id: 'uiux-development-responsive',
          title: 'Day 8 · Responsive Design',
          description: 'Desktop, tablet, mobile layouts, breakpoints, and adaptive layouts.',
          estimatedMinutes: 40,
          order: 4,
          lessons: [
            {
              id: 'uiux-development-responsive-l1',
              title: 'Desktop, tablet & mobile layouts',
              contentType: 'image',
              estimatedMinutes: 15,
              order: 1,
              content: `Designing responsively means designing for a genuine range of screen sizes from the start — not designing once for desktop and only afterward figuring out how to compress it down to fit a smaller screen as an afterthought.

## Mobile-first thinking, even for a desktop-primary product

Starting from the smallest, most constrained screen forces genuinely hard, necessary prioritization decisions early: what's truly essential content, and what can be safely deferred or removed at smaller sizes? Designing desktop-first and compressing downward afterward tends to produce a cramped, compromised mobile experience, since decisions were originally made assuming abundant, uncontested space that mobile simply doesn't have.

## What meaningfully changes across screen sizes

- **Layout structure** — a multi-column desktop layout typically collapses into a single column on mobile, not just proportionally shrinking every element in place
- **Navigation pattern** — a visible horizontal navigation bar on desktop often becomes a hidden hamburger menu or a bottom tab bar on mobile, a real structural change to how navigation itself works, not merely a smaller version of the same visible menu
- **Content density** — mobile screens generally need more generous spacing and fewer simultaneously visible items, since touch targets need to be larger and there's simply less available screen real estate to work with overall
- **Interaction patterns** — hover states, meaningful and useful on desktop, don't exist at all on touch devices; every interaction relying on hover needs a real touch-friendly equivalent designed for it

## Designing all three, not just two

It's tempting to treat tablet as "somewhere between mobile and desktop" and skip designing it explicitly. In practice, tablet often needs its own deliberate design attention — content that fits awkwardly, neither optimized for touch nor genuinely making use of the additional available space the way a true desktop layout would.`,
            },
            {
              id: 'uiux-development-responsive-l2',
              title: 'Breakpoints & adaptive layouts',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `A breakpoint is a defined screen width at which a layout's structure changes to better suit the available space — the design-side equivalent of the same \`sm\`/\`md\`/\`lg\` breakpoints an engineer would implement directly in code.

## Common breakpoint ranges

- **Mobile**: roughly up to 640px
- **Tablet**: roughly 640-1024px
- **Desktop**: roughly 1024px and above

These are reasonable, commonly-used defaults, not rigid rules — the right breakpoints for a specific product depend on its actual content and how a given layout genuinely behaves as it's resized, not purely on the specific pixel dimensions of any particular popular device.

## Designing for the breakpoints, not just for one width within each

A layout that only gets designed and tested at exactly 375px and 1440px risks looking noticeably broken at the messier, more common in-between widths — 800px, 1200px — that real users actually visit a product at just as often as the two convenient preset sizes. Testing (or at minimum genuinely considering) how a layout behaves across the full range, not just at the two most convenient endpoints, catches problems before they ever reach an engineer's implementation.

## Adaptive vs. fluid layouts

An adaptive layout has a small number of genuinely distinct, fixed layouts, one that snaps into place at each defined breakpoint. A fluid layout continuously resizes and reflows smoothly between breakpoints rather than jumping abruptly between fixed states. Most real, modern products use a hybrid of both: fluid resizing within a breakpoint's range, combined with genuine structural changes to layout at the breakpoints themselves — not purely one strategy applied everywhere to the exclusion of the other.

## Communicating this clearly to engineering

Designing and clearly documenting the intended behavior at each breakpoint — not just providing static screens for three arbitrary widths — is what lets an engineer confidently implement the *intended* responsive behavior, rather than needing to guess what should happen at all the messy widths in between the specific screens they were actually handed.`,
            },
          ],
          practice: [
            { id: 'uiux-development-responsive-p1', title: 'Convert desktop screens to mobile', kind: 'file-upload', order: 1 },
          ],
        },
        {
          id: 'uiux-development-prototyping',
          title: 'Day 9 · Prototyping',
          description: 'Interactive components, Smart Animate, microinteractions, and design handoff.',
          estimatedMinutes: 50,
          order: 5,
          lessons: [
            {
              id: 'uiux-development-prototyping-l1',
              title: 'Interactive components & Smart Animate',
              contentType: 'video',
              estimatedMinutes: 15,
              order: 1,
              content: `A prototype turns a set of static screens into something that can actually be clicked through and experienced — connecting screens with interactions so reviewers and test users experience something much closer to the real, finished product than a series of disconnected static images could ever convey.

## Building interactive flows

Figma's prototyping tools let you connect frames with defined interactions (on click, on hover, on drag) and transitions (an instant change, a smooth animated transition, a slide). A well-built prototype should closely mirror the real intended user flow — the same screens, in the same order, with the same available interactions a user would genuinely encounter in the finished, real product.

## Smart Animate

Smart Animate automatically animates the differences between two connected frames — an element that changes position, size, or color between them transitions smoothly rather than jumping abruptly. This is what makes state changes (a menu opening, a card expanding, a toggle switching) feel genuinely real and considered in a prototype, rather than looking like an abrupt jump-cut between two unrelated static frames.

## Why prototyping matters beyond just looking impressive in a demo

A prototype reveals problems that static screens alone simply can't — does a transition feel appropriately fast or frustratingly slow, does an interaction actually make logical sense once experienced in its proper sequence and context, does a flow feel genuinely smooth or unexpectedly clunky once actually clicked through end to end rather than just imagined. Testing with real users on a working prototype surfaces usability problems well before any engineering effort has been spent building the real thing.

## Fidelity matched to purpose

An early-stage prototype testing a rough concept doesn't need every single micro-interaction refined and polished — that level of detail is much better spent later, once the underlying flow itself is already validated and confirmed to work. Match how much prototyping effort and fidelity you invest to what you're actually trying to learn or demonstrate at that particular stage.`,
            },
            {
              id: 'uiux-development-prototyping-l2',
              title: 'Microinteractions',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `A microinteraction is a small, focused moment of feedback — a button subtly depressing when tapped, a checkbox animating in when checked, a gentle shake indicating an invalid form field. Individually tiny, but collectively, they're a huge part of what makes a product feel genuinely responsive and considered rather than mechanical.

## Why microinteractions matter more than their small size suggests

Every action a user takes deserves some form of acknowledgment — without it, the product feels unresponsive, and users are frequently left uncertain whether their action actually registered at all. A subtle scale or color change on tap confirms "yes, that worked" almost instantly, without needing any explicit written confirmation message.

## Anatomy of a microinteraction

- **Trigger** — what starts it (a tap, a value changing, a page loading)
- **Rules** — what actually happens once triggered
- **Feedback** — what the user visually perceives happening
- **Loops and modes** — does it repeat, and does its behavior change based on context (a loading spinner that shows a different, more urgent state after an unusually long wait, for instance)

## Restraint matters just as much as the effect itself

Overusing animation — everything bouncing, sliding, or fading dramatically — becomes genuinely distracting and can meaningfully slow down how a product actually feels to use, even though animation is often intended to make things feel *faster* and more responsive. The best microinteractions are usually subtle enough that a user registers the feedback without consciously noticing the animation itself as a distinct, separate thing they had to watch.

## Respecting reduced motion preferences

Some users genuinely need reduced motion, whether due to vestibular disorders or simple personal preference — designing (and clearly specifying to engineering) a reduced-motion alternative for significant animations is a real accessibility consideration, not an optional nice-to-have to skip if time runs short.`,
            },
            {
              id: 'uiux-development-prototyping-l3',
              title: 'Design handoff',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `Design handoff is the process of transferring a finished design to engineering for implementation — done well, it preserves design intent faithfully all the way through to what actually ships; done poorly, meaningful details get lost or subtly reinterpreted along the way.

## What a complete handoff includes

- **Specifications** — exact spacing, sizing, colors, and typography, ideally inspectable directly within the design file rather than manually re-measured by the engineer from a static screenshot
- **Assets** — icons and images exported in the correct formats and resolutions, ready to actually use directly
- **States** — every meaningful state of every component (hover, error, loading, empty), not only the single default state shown in the primary design
- **Behavior notes** — how something should behave that a static design alone genuinely can't convey: what specifically happens on error, how a list behaves when it's empty, what the exact intended transition looks and feels like

## Communication beyond the file itself

The design file rarely tells the entire, complete story on its own — a short walkthrough with the implementing engineer, or clear written notes directly on complex or non-obvious interactions, meaningfully reduces the number of "what should happen here?" questions that would otherwise come up mid-implementation, disrupting both people's flow.

## Handoff is genuinely collaborative, not a one-way handover

The best handoffs involve real back-and-forth — an engineer flagging a technical constraint the designer wasn't fully aware of, a designer clarifying an ambiguous edge case the moment it's actually raised. Treating handoff as a single one-way delivery, rather than as an ongoing collaborative conversation, is exactly what tends to produce the most implementation drift from the original, intended design.

## Why this connects directly to the auto layout and variables work from earlier

A design built with auto layout and well-organized variables translates into code far more directly and predictably than one built with ad hoc manual positioning — good handoff genuinely starts well before the actual handoff moment itself, in the underlying decisions made throughout the entire design process.`,
            },
          ],
          practice: [
            { id: 'uiux-development-prototyping-p1', title: 'Prototype the onboarding flow', kind: 'file-upload', order: 1 },
          ],
          assessment: { id: 'uiux-development-checkpoint', title: '[Mentor Checkpoint] Mentor Review 2 (Day 9)', kind: 'file-upload', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'uiux-project',
      key: 'project',
      title: 'Project',
      description: 'Days 10-14 · Product design sprint -- design the real Lumora platform surfaces end-to-end, exactly as a working product design team would.',
      order: 3,
      modules: [
        {
          id: 'uiux-project-applicant',
          title: 'Day 10 · Applicant Interface',
          description: 'Design the applicant-facing experience for the Lumora platform.',
          estimatedMinutes: 20,
          order: 1,
          lessons: [
            {
              id: 'uiux-project-applicant-l1',
              title: 'Applicant interface brief',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `Today you're designing the applicant-facing experience — the very first surface most people encounter, and one that carries real weight in shaping how someone judges the entire platform.

## What this surface needs to accomplish

An applicant needs to be able to discover relevant opportunities, understand what each one genuinely involves, and apply with as little unnecessary friction as possible. Every design decision here should be weighed against that goal specifically — does this choice make discovering and applying to opportunities genuinely easier, or does it just look good in isolation without actually helping toward that core goal?

## Applying everything from the last nine days

This is where research, information architecture, visual design, and prototyping skills come together on one real, cohesive surface. Think through: what does an applicant's actual journey through this interface look like end to end, what's the information hierarchy for a single opportunity listing, what does your established component library look like when it's genuinely put to real use here rather than just designed in the abstract.

## Working from what already exists

You're not designing this in a vacuum — the Lumora platform already has an established applicant experience (the real product this training portal is built for) with its own real content, real flows, and real constraints. Ground your design decisions in that actual context rather than an entirely hypothetical, unconstrained product with no real precedent to build on.

## What to focus on today specifically

Given the compressed one-day timeframe, prioritize the core flow — browsing opportunities and applying — over exhaustively covering every possible secondary or edge-case screen. Depth on the primary path matters considerably more here than shallow, superficial breadth across everything.`,
            },
          ],
          practice: [{ id: 'uiux-project-applicant-p1', title: 'Design the Applicant Interface', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-training',
          title: 'Day 11 · Training Workspace',
          description: 'Design the training workspace experience for the Lumora platform.',
          estimatedMinutes: 20,
          order: 2,
          lessons: [
            {
              id: 'uiux-project-training-l1',
              title: 'Training workspace brief',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `Today's focus is the training workspace — the environment an accepted intern lives in throughout their program, tracking lessons, progress, and their learning path.

## What makes this surface different from Day 10's

The applicant interface is largely about *discovery and decision* — browsing options, evaluating them, deciding to apply. The training workspace is about *sustained, ongoing use* — an intern returns to it repeatedly over days and weeks, which shifts the design priorities meaningfully: how quickly can a returning user reorient to exactly where they left off, and how clearly does the interface communicate genuine progress and forward momentum over that whole extended period.

## Key screens to consider

- A dashboard summarizing current progress and clearly surfacing the next concrete action to take
- A learning path view showing the full structure — completed, current, and locked/upcoming stages
- A lesson or module detail view

## Designing for motivation, not just function

A training experience that only tracks completion mechanically, without any sense of visible momentum or progress, tends to feel like a chore rather than genuine growth. Consider how visual design choices — progress indicators, a clear, well-defined sense of "what's next," meaningful milestones — can reinforce a learner's sense that they're actually moving forward, not just consuming disconnected content one piece at a time.

## Consistency with the Applicant Interface

Since a real user experiences both of these surfaces as one single, continuous product journey — not two unrelated apps — carry your established design system forward deliberately from Day 10, rather than treating each day's sprint as an isolated, disconnected exercise unrelated to what came before it.`,
            },
          ],
          practice: [{ id: 'uiux-project-training-p1', title: 'Design the Training Workspace', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-mentor',
          title: 'Day 12 · Mentor Dashboard',
          description: 'Design the mentor-facing dashboard for the Lumora platform.',
          estimatedMinutes: 20,
          order: 3,
          lessons: [
            {
              id: 'uiux-project-mentor-l1',
              title: 'Mentor dashboard brief',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `Today shifts to an entirely different user: the mentor, reviewing and guiding several interns' progress at once rather than experiencing a single individual learning journey of their own.

## A meaningfully different design problem

Where the applicant and intern-facing surfaces are about one person's own individual journey, a mentor dashboard is about *overseeing several people at once* — which changes the design priorities substantially: scannability across multiple interns' status at a glance, and quick, low-friction access to the specific detail needed for any one of them when it's actually required.

## Key screens to consider

- An overview showing all assigned interns and each one's current status at a glance
- A detail view for reviewing one specific intern's progress and submissions
- An interface for actually leaving feedback

## Designing for a workflow, not just a set of individual screens

A mentor's actual day-to-day likely involves reviewing several interns in sequence, one after another, in a single sitting. Consider how the design supports that realistic *workflow* — can a mentor move between interns efficiently without re-navigating from scratch each time, is the information they need for each individual review consistently placed exactly where they'd expect to find it every single time.

## Data density done well

Unlike the more spacious applicant and intern-facing screens, a dashboard designed for overseeing multiple people often benefits from somewhat higher information density — more can reasonably be visible at once without unnecessary scrolling. This isn't a contradiction of earlier spacing and hierarchy principles; it's applying those exact same principles thoughtfully to a genuinely different context and use case, not simply cramming more content in without any real consideration.`,
            },
          ],
          practice: [{ id: 'uiux-project-mentor-p1', title: 'Design the Mentor Dashboard', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-admin',
          title: 'Day 13 · Admin Portal',
          description: 'Design the admin portal for the Lumora platform.',
          estimatedMinutes: 20,
          order: 4,
          lessons: [
            {
              id: 'uiux-project-admin-l1',
              title: 'Admin portal brief',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `Today's surface is the admin portal — the highest information density and broadest functional scope of anything you'll design in this sprint, supporting the people running the entire program end to end.

## What admin users actually need

Administrators manage opportunities, review applications at real scale, oversee the whole program's operation, and need visibility across the entire system at once. This is a genuinely different design challenge from anything else in this sprint: less about a carefully crafted individual delight, considerably more about efficient, reliable, at-scale operation across a large amount of information.

## Key screens to consider

- Application management — reviewing, filtering, and acting on a genuinely large volume of applications
- Opportunity management — creating and editing internship postings
- An overview or reporting view surfacing program-wide status across everything

## Designing for efficiency and scale specifically

Data tables, robust filtering, clear and unambiguous bulk actions, and keyboard-friendly workflows matter far more here than they do on the more consumer-facing surfaces you designed on Days 10-12. An admin managing hundreds of applications needs to move through them fast and confidently — every unnecessary click or unclear label has a real, measurable, compounding cost at that kind of scale.

## Admin tools still deserve genuinely good design

It's a common, easy mistake to treat internal admin tooling as "just functional" and therefore not worth real design craft. A poorly-designed admin tool genuinely slows down the actual people running the program every single day — good design here has real, measurable, compounding operational value over time, not merely a cosmetic one.`,
            },
          ],
          practice: [{ id: 'uiux-project-admin-p1', title: 'Design the Admin Portal', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-system',
          title: 'Day 14 · Design System Refinement',
          description: "Consolidate and refine your design system across every screen you've built this sprint.",
          estimatedMinutes: 20,
          order: 5,
          lessons: [
            {
              id: 'uiux-project-system-l1',
              title: 'Design system refinement brief',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `After four days of building four genuinely distinct surfaces quickly, today is about stepping back and consolidating — finding and resolving the inconsistencies that inevitably crept in along the way, and strengthening the underlying system so it holds together as one coherent whole.

## What tends to drift during a fast-moving sprint

Working quickly across several different screens on consecutive days, it's genuinely common for small inconsistencies to accumulate: a button styled slightly differently between two screens, a spacing value that doesn't quite match your established scale, a component variant invented on the fly for one specific screen that should really have been a proper, reusable addition to the system instead.

## The refinement process

- Audit every screen built across Days 10-13 against your actual established components and tokens — where did you deviate, and was that deviation genuinely deliberate, or just an oversight made under time pressure
- Consolidate any one-off patterns that appeared more than once into real, proper reusable components, rather than leaving them as scattered duplicates
- Confirm your color, typography, and spacing systems are applied consistently across every single surface, not just within any one screen considered in isolation

## Why this step matters as much as the four days that came before it

A design system that only holds together on the individual screen where it was first built, but not consistently across the whole product, isn't actually functioning as a real system — it's several disconnected one-off designs that happen to share a broadly similar visual style. This consolidation step is what turns four days of separate, individually-designed work into one genuinely coherent product.

## Preparing for the mini project ahead

This refined, consolidated system is exactly what you'll draw directly on for the mini project that follows — time invested in getting it genuinely right now pays off immediately in how efficiently the next phase of work actually goes.`,
            },
          ],
          practice: [{ id: 'uiux-project-system-p1', title: 'Refine and consolidate your design system across all screens', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-miniproject',
          title: 'Mini Project · Internship Workflow Design',
          description: 'Design one complete internship workflow end-to-end: landing page, opportunities, application, interview scheduling, and training dashboard.',
          estimatedMinutes: 20,
          order: 6,
          lessons: [
            {
              id: 'uiux-project-miniproject-l1',
              title: 'Mini project brief',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `The mini project asks you to design one complete, coherent workflow end to end — landing page, opportunities, application, interview scheduling, and training dashboard — pulling together everything from the entire sprint into a single, cohesive experience.

## Why this is a genuinely different exercise from Days 10-14

Days 10-13 each focused on one surface in relative isolation. This project is explicitly about the connective tissue *between* surfaces — does moving from the landing page into browsing opportunities feel like one single, continuous journey, or does it feel like several separate, disconnected apps that just happen to share a similar visual style? That seam is exactly what this exercise is designed to test and reveal.

## What to focus on

- **Continuity** — consistent navigation patterns, consistent visual language, and a clear, legible sense of progress as a user moves through the entire flow from one end to the other
- **Transitions between stages** — how does a user's mental model carry forward as they genuinely move from browsing, into applying, into being scheduled for an interview
- **Your refined design system, actually in use** — this is where Day 14's consolidation work should visibly pay off in practice, not just as an audit exercise you completed in isolation

## Deliverable

A Figma file covering all five stages of the flow, using your consolidated design system consistently throughout. This is the single deliverable Mentor Review 3 will evaluate most closely, so prioritize genuine coherence across the whole flow over any single, isolated screen looking impressive entirely on its own.

## Treating this as a portfolio piece, not just an exercise

This is realistically one of the strongest pieces you'll walk away from this program with — a complete, coherent product flow with a genuinely consistent design system underneath it. Treat it with the level of care you'd want to put in front of a real hiring manager, not merely as a checkbox exercise to get through.`,
            },
          ],
          practice: [{ id: 'uiux-project-miniproject-p1', title: 'Design the landing page, opportunities, application, and interview scheduling flows', kind: 'file-upload', order: 1 }],
          submission: { id: 'uiux-project-miniproject-s1', title: 'Submit your mini project for review', instructions: 'Link your Figma file covering the landing page, opportunities, application, interview scheduling, and training dashboard.', requiresLink: true },
          assessment: { id: 'uiux-project-checkpoint', title: '[Mentor Checkpoint] Mentor Review 3 (Day 14)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'uiux-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Design review session -- mentor feedback and revisions before the capstone.',
      order: 4,
      modules: [
        {
          id: 'uiux-readiness-eval',
          title: 'Design Review Session (Day 15)',
          description: 'Your mentor reviews your work and you revise designs based on feedback before the final stretch.',
          order: 1,
          lessons: [
            {
              id: 'uiux-readiness-eval-l1',
              title: 'What to expect from your design review session',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `This session exists to calibrate, not to gate — its purpose is making sure you enter the capstone with an honest, specific sense of where your design skills are genuinely strong and where they still need real, deliberate attention.

## What your mentor is specifically looking at

- **UX thinking** — is your work grounded in real, considered research and reasoning, or does it read as design decisions made mostly on visual instinct alone
- **Design system consistency** — does your component usage and visual system genuinely hold together across every different surface, not just within any single screen
- **Craft** — spacing, typography, hierarchy, accessibility — the fundamentals covered across Days 1-9, actually and consistently applied in real practice
- **Developer-handoff readiness** — is your work built (auto layout, organized variables, clearly defined component states) in a way that would translate cleanly into real, working code

## Receiving and actually revising based on feedback

Unlike the earlier Mentor Reviews, this session explicitly includes time to revise your designs based on what comes up — this is a genuine opportunity to strengthen your mini project deliverable before it becomes part of your final portfolio, not a purely passive one-way evaluation you simply sit through.

## How to prepare

There's no separate assignment for this specifically — it's a review of everything built across Days 1-14. The most useful preparation is honest self-reflection: which part of the process — research, information architecture, visual craft, prototyping — still feels least confident, and what's the concrete plan to strengthen it before the capstone actually depends on it.`,
            },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'uiux-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Developer handoff, portfolio preparation, and capstone presentation.',
      order: 5,
      modules: [
        {
          id: 'uiux-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Prepare your developer handoff and portfolio, then present the complete Lumora Internship Platform for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            {
              id: 'uiux-graduation-capstone-l1',
              title: 'Developer collaboration & handoff',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Days 16-18 shift focus from designing new screens to properly finishing what you've already built — starting with preparing your work for real developer handoff, treated with the same seriousness as the design work itself.

## Design tokens

Confirm your Figma variables (color, spacing, typography) are genuinely well-organized and clearly, consistently named — this is precisely what a developer will reference directly while implementing, and disorganized or unclear tokens at this stage create real, avoidable friction during the actual build.

## Assets

Export icons and images in the correct formats and resolutions. SVG is generally preferred for icons specifically, since it scales cleanly to any size without any loss of quality, unlike a fixed-resolution raster image.

## Specifications

Every component needs its complete set of states clearly documented — default, hover, active, disabled, error, loading — not merely the single default state a developer happens to see first when opening the file.

## Handoff documentation

Prepare a short walkthrough or written notes covering the non-obvious interactions and behaviors your static screens alone genuinely can't convey — what specifically happens on a validation error, what an empty state should actually communicate, precisely what a transition should look and feel like in practice.

## Why this stage genuinely matters as much as the design work itself

A beautifully designed product that loses meaningful fidelity during implementation, because handoff was rushed or treated as an afterthought, doesn't fully deliver on the value of the original design work. Treating handoff with real, deliberate care is what actually protects your design intent all the way through to what genuinely ships.`,
            },
            {
              id: 'uiux-graduation-capstone-l2',
              title: 'Portfolio & case study preparation',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Your capstone work — the mini project and the surfaces you built across the entire sprint — is the strongest portfolio material you'll leave this program with. How you present it matters just as much as the underlying design quality itself.

## Building a case study, not just a gallery of screens

A portfolio piece that's purely a set of polished final screens tells a hiring manager relatively little about your actual thinking process. A genuine case study walks through: the problem, your research and reasoning, the alternatives you considered and specifically why you didn't pursue them, the final solution, and — critically — what you'd do differently now with the benefit of hindsight.

## What a strong case study structure includes

- **Context** — what was the problem, and why did it genuinely matter to solve
- **Process** — research, information architecture, key design decisions, and the actual reasoning behind each of them
- **Outcome** — the final design, ideally accompanied by a working, interactive prototype rather than only static images
- **Reflection** — what you learned, and what you'd approach differently if you were starting the same project again today

## Presentation skills

Being able to clearly explain *why* you made a specific design decision is frequently more valuable in an interview setting than the final visual outcome itself. Practice articulating your reasoning out loud, not only the finished result — interviewers are generally trying to understand how you genuinely think, not just evaluating whether the final screens happen to look polished.

## Interview preparation beyond the portfolio review itself

Beyond a portfolio walkthrough, be ready for Figma-based whiteboard exercises, structured critique sessions of existing designs, and direct discussion of core UX principles — the same fundamentals covered across Days 1-9 of this program, which is exactly why revisiting and genuinely internalizing them now, rather than only during the original lesson, pays off later.`,
            },
          ],
          practice: [],
          submission: { id: 'uiux-graduation-capstone-s1', title: 'Submit your capstone project for certification review', instructions: 'Include your Figma file link, prototype link, and case study document covering the landing page, opportunities, applicant experience, interview scheduling, training workspace, mentor dashboard, admin portal, responsive screens, and design system.', requiresLink: true },
          assessment: { id: 'uiux-graduation-final', title: '[Mentor Checkpoint] Capstone Presentation (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
