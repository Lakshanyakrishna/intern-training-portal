import type { TrainingTrackConfig } from './types';

// Frontend Development Training Handbook v1.0 -- Lumora's 18-day,
// mentor-led + project-based + industry-simulation program. Days map onto
// modules (Days 1-4 -> Foundation, 5-10 -> Development, 11-13 -> Project
// sprint simulation, 15 -> Readiness, 16-18 -> Graduation capstone). The
// five mentor checkpoints (handbook section 12) are wired in as module
// assessments except the Day 15 readiness review, which stays a bare
// module: that evaluation runs through the app's separate real
// ReadinessEvaluation admin flow, not a self-service assessment here.
// Every lesson's `content` is real written material derived from the
// handbook's own topic list -- see LessonConfig in ./types.ts for the
// markdown-lite subset it's written in.
export const frontendTrack: TrainingTrackConfig = {
  forte: 'Frontend',
  trackName: 'Frontend Engineering',
  description: 'An 18-day, mentor-led, project-based frontend engineering program: production React architecture, real API integration, Agile sprint simulation, and a capstone project -- per the Lumora Frontend Development Training Handbook v1.0.',
  stages: [
    {
      id: 'fe-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Production environment setup, React architecture, styling systems, and state management.',
      order: 1,
      modules: [
        {
          id: 'fe-foundation-setup',
          title: 'Day 1 · Project Setup & Development Workflow',
          description: 'Configure your environment, learn the team Git workflow, and open your first pull request.',
          estimatedMinutes: 70,
          order: 1,
          lessons: [
            {
              id: 'fe-foundation-setup-l1',
              title: 'Development environment configuration',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Every Lumora project starts from the same baseline so any engineer can clone a repo and be productive within minutes, not hours.

## What a consistent setup gets you

- Node.js (an LTS version) and one package manager per project — npm, pnpm, or yarn, picked once and used consistently by everyone on the team
- An editor configured with the project's recommended extensions: ESLint, Prettier, and Tailwind IntelliSense at minimum
- Environment variables loaded from a local, gitignored .env file — real secrets never get committed
- A dev server that runs locally against either a local backend or a shared staging environment

## Why it matters more than it seems

A misconfigured environment is one of the most common sources of wasted time on a new team. When a bug only reproduces on one person's machine, the environment is the first thing to check — not the code. Getting this right on Day 1 means every day after it starts from solid ground.

**Before you move on**, confirm you can start the dev server, that it hot-reloads on a file save, and that your editor is actually applying the project's lint rules rather than its own defaults.`,
            },
            {
              id: 'fe-foundation-setup-l2',
              title: 'Git workflow & branching strategy',
              contentType: 'markdown',
              estimatedMinutes: 20,
              order: 2,
              content: `Git is how a team of engineers avoids overwriting each other's work. The mechanics matter less than the discipline of using them the same way every time.

## The branching model

Lumora teams work off a protected main branch. Nobody commits to it directly. Instead:

1. Create a feature branch from the latest main, named for the work it contains (e.g. \`feature/applicant-filters\` or \`fix/dashboard-null-state\`)
2. Commit in small, focused chunks with messages that explain *why*, not just *what*
3. Push the branch and open a pull request against main
4. Get it reviewed, address feedback, and merge once approved

## Why small commits matter

A commit that changes one thing is easy to review, easy to revert, and easy to understand six months later with \`git blame\`. A commit that touches twelve files "while I was in there" is none of those things. When you're tempted to bundle an unrelated fix into your current branch, it almost always belongs in its own branch and its own PR instead.

## Keeping your branch current

Long-lived branches drift from main and accumulate painful merge conflicts. Pull main into your branch (or rebase onto it) regularly rather than waiting until the end — a conflict caught early is a two-line fix; the same conflict caught after a week of divergence can be a genuine mess.`,
            },
            {
              id: 'fe-foundation-setup-l3',
              title: 'Repository structure & project standards',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `A predictable repository structure means any engineer — including a new intern on Day 1 — can find what they're looking for without asking.

## What "predictable" looks like

- **src/** holds all application code, organized by feature or domain rather than by file type, so everything for one feature lives near everything else for that feature
- **components/** holds genuinely reusable, presentation-focused pieces — not one-off page sections
- Naming is consistent: components in PascalCase, hooks prefixed with \`use\`, utility files in camelCase
- Configuration (ESLint, Prettier, TypeScript, environment) lives at the project root, not scattered

## Project standards beyond folders

Structure is only half of it. A project's standards also cover things like: what counts as a reviewable pull request size, when a component should be split up, and how errors get handled consistently rather than every developer inventing their own pattern. These standards usually live in a CONTRIBUTING.md or a pinned wiki page — read it before your first PR, not after your first review comment about it.

Consistency here isn't about taste. It's about making the codebase legible to people who didn't write the code in front of them — which, on any real team, is almost always true.`,
            },
            {
              id: 'fe-foundation-setup-l4',
              title: 'Code formatting with ESLint & Prettier',
              contentType: 'code',
              estimatedMinutes: 10,
              order: 4,
              content: `ESLint and Prettier solve two different problems, and it's worth knowing which is which.

## The split

- **Prettier** formats code — spacing, line breaks, quote style. It has no opinion about your logic, only about how it looks.
- **ESLint** catches problems — unused variables, hooks called conditionally, accessibility issues, patterns your team has decided to forbid.

Running both means style debates never happen in code review (Prettier already settled them) and real mistakes get caught before a human even looks at the diff.

## A typical setup

\`\`\`json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "format": "prettier --write ."
  }
}
\`\`\`

Most teams wire formatting into a pre-commit hook so it happens automatically, and run linting in CI so a PR can't merge with lint errors. If your editor is set up correctly, you should rarely run these manually — Prettier formats on save, and ESLint underlines problems as you type.

**A habit worth building now**: if ESLint flags something you don't understand, look up *why* the rule exists before disabling it. Most lint rules encode a real bug someone hit in production once.`,
            },
          ],
          practice: [
            { id: 'fe-foundation-setup-p1', title: 'Clone the repo, configure your project, and open your first pull request', kind: 'interactive', order: 1 },
          ],
        },
        {
          id: 'fe-foundation-architecture',
          title: 'Day 2 · Modern React Architecture',
          description: 'Folder structure, component organization, and separation of concerns.',
          estimatedMinutes: 60,
          order: 2,
          lessons: [
            {
              id: 'fe-foundation-architecture-l1',
              title: 'Folder structure & component organization',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `As a React application grows past a handful of components, how you organize files stops being cosmetic and starts determining how fast the team can move.

## Two common approaches

- **By type**: all components in one folder, all hooks in another, all pages in another. Simple at first, but finding everything related to one feature means jumping across five folders.
- **By feature**: everything related to a feature — its components, hooks, and types — lives together in one folder. This is what most production React codebases converge on as they scale, because it keeps related code physically close.

## What good organization looks like in practice

- Shared, generic components (buttons, inputs, cards) live in a common components folder
- Feature-specific components live inside that feature's own folder, not in the shared one
- A component that's only used in one place doesn't need to be "reusable" yet — extract it when a second use case actually appears, not before

## The trap to avoid

Premature abstraction is a real cost. Splitting a 40-line component into five tiny sub-components "for organization" often makes the code harder to follow, not easier. Organize around actual complexity, not anticipated complexity.`,
            },
            {
              id: 'fe-foundation-architecture-l2',
              title: 'Separation of concerns',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Separation of concerns means each piece of your code has one job, and knows as little as possible about everything else.

## What this looks like in a React app

- **Presentation** components render UI from props — they don't know where the data came from or how it's fetched
- **Data fetching / business logic** lives in hooks, not scattered through JSX
- **Routing** decides which screen is shown; it doesn't contain the logic for what that screen does

## Why it's worth the discipline

A component that fetches its own data, transforms it, manages five pieces of local state, *and* renders a complex UI is hard to test, hard to reuse, and hard to reason about when something breaks. Pull the data logic into a custom hook and the component itself becomes almost trivial — it just renders what it's given.

## A quick gut check

If you can't describe what a component does in one sentence without using the word "and" more than once, it's probably doing too much and is a candidate for splitting along those separate concerns.`,
            },
            {
              id: 'fe-foundation-architecture-l3',
              title: 'Reusable components & props management',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 3,
              content: `A reusable component is one that's genuinely useful in more than one context — which means its props are designed for flexibility, not just for the one screen it was first built for.

## Designing props well

\`\`\`tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Button({ variant = 'primary', size = 'md', disabled, onClick, children }: ButtonProps) {
  return (
    <button
      className={getButtonClasses(variant, size)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
\`\`\`

Notice what makes this reusable: sensible defaults, a small closed set of variants rather than an open \`className\` escape hatch, and \`children\` instead of a hardcoded \`label\` prop so it can hold text, an icon, or both.

## Signs a component's props have gone wrong

- A boolean prop like \`isSmallAndDangerAndDisabled\` instead of composable options
- More than 8-10 props, especially with several that are only used together — often a sign the component should be split, or that those props belong in a config object
- Props that only exist to work around the component doing too much in one place

Good prop design is what makes a component something teammates reach for instead of copy-pasting and modifying.`,
            },
          ],
          practice: [
            { id: 'fe-foundation-architecture-p1', title: 'Build a set of reusable UI components', kind: 'coding', order: 1 },
          ],
          challenge: { id: 'fe-foundation-architecture-c1', title: 'Build a small, documented component library', kind: 'coding', description: 'Harder, capstone-style exercise for this module.', order: 1 },
        },
        {
          id: 'fe-foundation-styling',
          title: 'Day 3 · Styling System',
          description: 'Tailwind CSS, design tokens, and responsive layout.',
          estimatedMinutes: 60,
          order: 3,
          lessons: [
            {
              id: 'fe-foundation-styling-l1',
              title: 'Tailwind CSS fundamentals',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Tailwind is a utility-first CSS framework: instead of writing custom CSS classes, you compose small, single-purpose utility classes directly in your markup.

## Why utility-first, not "inline styles with extra steps"

- Every utility maps to a value from a shared design scale (spacing, color, type size) — so \`p-4\` and \`p-6\` are always the same 4px-based increments across the whole app, not arbitrary numbers someone typed
- There's no CSS file to keep in sync with the component, and no risk of dead, unused CSS accumulating over years
- Responsive and state variants compose the same way everything else does: \`md:flex\`, \`hover:opacity-90\`, \`disabled:cursor-not-allowed\`

## What it looks like

A card might be \`className="bg-surface border border-line rounded-xl p-5 shadow-sm"\` — spacing, color, radius, and elevation all read directly off the class list, no context-switching to a separate stylesheet.

## The adjustment period

Utility classes look noisy at first, especially coming from separate CSS files. Most developers find that after a week or two, reading a class list becomes *faster* than jumping between a component file and its stylesheet — because everything relevant to how something looks is right there where you're already looking.`,
            },
            {
              id: 'fe-foundation-styling-l2',
              title: 'Design tokens & theme management',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Design tokens are the named, reusable values — colors, spacing, type sizes — that a design system is built from. They're what keeps "the accent color" as one decision instead of forty hardcoded hex values scattered across the codebase.

## Why tokens instead of raw values

- Change \`--color-accent\` once and every button, link, and focus ring updates together
- A raw hex value in a component tells you nothing about *why* that color was chosen; a token name like \`--color-accent\` tells you its role
- Dark mode and light mode become a matter of redefining the same token names under a different selector — the components themselves never change

## How this plugs into Tailwind

Tokens are typically defined as CSS custom properties, then referenced through Tailwind's theme configuration so utilities like \`bg-accent\` or \`text-secondary\` resolve to the token rather than a fixed color. That's the difference between "this button is blue" and "this button uses the accent color, whatever that is right now."

## A rule worth keeping

If you find yourself typing a raw hex code or an arbitrary pixel value in a component, pause — there's almost always an existing token that should be used instead, and if there genuinely isn't one, that's a sign a new token should be added to the system rather than a one-off value slipping in.`,
            },
            {
              id: 'fe-foundation-styling-l3',
              title: 'Responsive layouts & component styling',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 3,
              content: `Responsive design in Tailwind is mobile-first: unprefixed utilities apply at every screen size, and breakpoint prefixes override them upward from there.

\`\`\`tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* single column on mobile, 2 columns at sm+, 3 columns at lg+ */}
</div>
\`\`\`

## Why mobile-first, specifically

Starting from the smallest screen forces you to design the layout that has to work hardest first — the one with the least space. Everything above that is progressive enhancement: more columns, more visible detail, more generous spacing. Designing desktop-first and then trying to squeeze it down to mobile tends to produce cramped, compromised small-screen layouts.

## Practical guidelines

- Default breakpoints (\`sm\`, \`md\`, \`lg\`, \`xl\`) cover the vast majority of real devices — custom breakpoints are rarely worth the added complexity
- Test at the breakpoint boundaries, not just at a phone and a laptop size — the awkward in-between widths are where layouts usually break first
- Flexbox and grid utilities (\`flex\`, \`grid\`, \`gap-*\`) should do almost all of your layout work; reach for fixed pixel widths only when a component genuinely needs a fixed size regardless of container

A layout that only gets tested at 375px and 1440px will have surprises at 800px. Resize the browser window while you work, don't just check two presets.`,
            },
          ],
          practice: [
            { id: 'fe-foundation-styling-p1', title: 'Build a responsive landing page', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-foundation-state',
          title: 'Day 4 · State Management',
          description: 'useState, useEffect, the Context API, and custom hooks.',
          estimatedMinutes: 75,
          order: 4,
          lessons: [
            {
              id: 'fe-foundation-state-l1',
              title: 'useState & useEffect',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 1,
              content: `These two hooks cover the majority of what a component needs: \`useState\` holds values that change over time, and \`useEffect\` runs code in response to those changes.

\`\`\`tsx
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (!query) { setResults([]); return; }
    const controller = new AbortController();
    fetchResults(query, controller.signal).then(setResults);
    return () => controller.abort();
  }, [query]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
\`\`\`

## What each piece is actually doing

- \`useState\` triggers a re-render whenever its setter is called with a new value — it never mutates the old value in place
- \`useEffect\`'s dependency array (\`[query]\`) tells React exactly when to re-run the effect — get this wrong and you either run it too often or miss updates entirely
- The cleanup function returned from the effect runs before the *next* effect and on unmount — here it cancels an in-flight request so a slow, stale response can't overwrite a newer one

## The most common mistake

Reaching for \`useEffect\` to *derive* a value from existing state (e.g. syncing a computed total into its own state variable) almost always means the derivation should just happen directly during render instead — no effect required. Effects are for synchronizing with something *outside* React (a network request, a subscription, the DOM), not for keeping two pieces of React state in sync with each other.`,
            },
            {
              id: 'fe-foundation-state-l2',
              title: 'Context API',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Context solves one specific problem: passing a value down through many layers of components without threading it through every single one as a prop.

## When context is the right tool

- Values that genuinely are "global" to a subtree — the current authenticated user, the active theme, a feature flag
- Values that would otherwise need to pass through five or six intermediate components that don't use the value themselves, only forward it

## When it isn't

Context is not a general-purpose state management replacement. Reaching for it to avoid "prop drilling" two or three levels deep usually adds indirection without much real benefit — passing a prop down two levels is not actually a problem worth solving. And because every consumer of a context re-renders whenever that context's value changes, putting fast-changing state (like form input values) into context can cause performance problems that are hard to trace back to their cause.

## A practical pattern

Most Lumora apps wrap context in a small custom hook — \`useAuth()\` rather than \`useContext(AuthContext)\` everywhere — so the underlying context can be swapped or extended later without touching every call site, and so a missing provider produces a clear error instead of a silent \`undefined\`.`,
            },
            {
              id: 'fe-foundation-state-l3',
              title: 'Custom hooks & data flow',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 3,
              content: `A custom hook is just a function whose name starts with \`use\` and that calls other hooks inside it. That's the entire mechanism — the value is purely in what it lets you do: extract reusable, stateful logic out of components.

\`\`\`tsx
function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

// usage
const debouncedQuery = useDebounced(query, 300);
\`\`\`

## Why extract logic into a hook at all

Without it, this debounce logic would either be copy-pasted into every component that needs it, or the component itself would carry state and effects that have nothing to do with what it renders. The hook makes the *behavior* reusable and testable independent of any particular UI.

## How data actually flows through a hook-based component

State typically lives at the lowest common point that needs it, gets passed down as props, and changes flow back up through callback props (\`onChange\`, \`onSelect\`) rather than child components reaching up to mutate parent state directly. This "data down, events up" pattern is what keeps React apps predictable even as they grow — you can always trace where a value came from by reading downward, and where a change goes by reading the callback.`,
            },
          ],
          practice: [
            { id: 'fe-foundation-state-p1', title: 'Build a dashboard with dynamic state', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'fe-foundation-checkpoint', title: '[Mentor Checkpoint] Foundation Review (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'fe-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-10 · API integration, authentication, dashboards, forms, performance, and accessibility.',
      order: 2,
      modules: [
        {
          id: 'fe-development-api',
          title: 'Day 5 · API Integration',
          description: 'REST APIs, Axios/Fetch, and loading & error states.',
          estimatedMinutes: 60,
          order: 1,
          lessons: [
            {
              id: 'fe-development-api-l1',
              title: 'REST APIs & HTTP fundamentals',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `REST is a set of conventions for structuring APIs around resources — applications, opportunities, users — each with predictable operations expressed through HTTP methods.

## The core conventions

- **GET** retrieves a resource without changing anything — \`GET /opportunities\` lists them, \`GET /opportunities/:id\` fetches one
- **POST** creates a new resource — \`POST /applications\` submits a new application
- **PATCH** (or **PUT**) updates an existing resource
- **DELETE** removes one

Status codes carry meaning too: 2xx means success, 4xx means the client did something wrong (bad input, missing auth, not found), 5xx means the server failed. A frontend that treats every non-200 response the same way loses information the API is actively trying to give it.

## Why this matters for frontend work

Understanding REST conventions means you can often predict an API's shape before reading its documentation, and it means your error handling can be specific — a 401 should prompt a re-login, a 404 should show a "not found" state, a 500 should show a generic retry message. Treating all failures identically is a common source of confusing UX.`,
            },
            {
              id: 'fe-development-api-l2',
              title: 'Fetching data with Axios & Fetch',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 2,
              content: `The browser's built-in \`fetch\` and the third-party \`axios\` library solve the same problem with different ergonomics.

\`\`\`tsx
// fetch — built in, but requires manual JSON parsing and error checking
const res = await fetch('/api/opportunities');
if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
const data = await res.json();

// axios — parses JSON automatically and throws on non-2xx by default
const { data } = await axios.get('/api/opportunities');
\`\`\`

## The key difference that trips people up

\`fetch\` does **not** throw on a 404 or 500 — it only rejects on network failure. Forgetting to check \`res.ok\` is one of the most common frontend bugs: a failed request silently gets treated as a success because nobody checked the status code. \`axios\` throws automatically on non-2xx responses, which is why many teams prefer it, though either is fine as long as the team is consistent and everyone knows which behavior to expect.

## A pattern worth adopting early

Wrap your API calls in a small shared client (an axios instance with a base URL and interceptors, or a thin fetch wrapper) rather than calling \`fetch\`/\`axios\` directly from every component. That's the one place to attach auth headers, handle token refresh, and normalize error shapes — instead of repeating that logic everywhere a request happens.`,
            },
            {
              id: 'fe-development-api-l3',
              title: 'Loading states & error handling',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 3,
              content: `Every network request has (at least) three possible states, and a component that only handles the success case is showing an incomplete UI to a real fraction of its users.

\`\`\`tsx
type RequestState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

function OpportunityList() {
  const [state, setState] = useState<RequestState<Opportunity[]>>({ status: 'loading' });

  useEffect(() => {
    getOpportunities()
      .then(data => setState({ status: 'success', data }))
      .catch(err => setState({ status: 'error', message: err.message }));
  }, []);

  if (state.status === 'loading') return <Skeleton />;
  if (state.status === 'error') return <ErrorState message={state.message} />;
  return <List items={state.data} />;
}
\`\`\`

## Why this shape, specifically

Modeling loading/error/success as a single discriminated union — rather than three separate booleans like \`isLoading\`, \`isError\`, \`data\` — makes impossible states impossible. With three separate booleans, nothing stops \`isLoading\` and \`isError\` from both being true at once; with a union, the component can only ever be in exactly one state, and TypeScript enforces it.

## What users actually notice

A skeleton loader that matches the shape of the real content feels faster than a spinner, even at the same actual load time. And an error state that says *what* went wrong and offers a retry is dramatically better than a blank screen or a console error nobody but you will ever see.`,
            },
          ],
          practice: [
            { id: 'fe-development-api-p1', title: 'Integrate a REST API with proper loading and error states', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-development-auth',
          title: 'Day 6 · Authentication',
          description: 'JWT, protected routes, and session management.',
          estimatedMinutes: 65,
          order: 2,
          lessons: [
            {
              id: 'fe-development-auth-l1',
              title: 'JWT fundamentals',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A JWT (JSON Web Token) is a signed, self-contained string that proves who a user is without the server needing to look anything up on every request.

## What's actually inside one

A JWT has three parts separated by dots: a header, a payload (claims like the user's ID and an expiry time), and a signature. The payload is base64-encoded, **not encrypted** — anyone can decode and read it, they just can't forge a valid signature without the server's secret key. That distinction matters: never put sensitive data (passwords, full personal details) in a JWT payload just because it's "encoded."

## How the frontend uses one

After login, the server returns a JWT. The frontend stores it (commonly in memory or an httpOnly cookie — deliberately *not* localStorage for anything security-sensitive, since localStorage is readable by any script on the page, including an injected one) and attaches it to subsequent requests, typically as an \`Authorization: Bearer <token>\` header. The server verifies the signature on each request instead of checking a session table.

## Expiry and refresh

JWTs are usually short-lived (minutes to hours) precisely because they can't be revoked individually once issued — a longer-lived, separately-stored refresh token is used to obtain new access tokens without forcing the user to log in again every few minutes.`,
            },
            {
              id: 'fe-development-auth-l2',
              title: 'Protected routes',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 2,
              content: `A protected route is one that checks authentication (and often authorization) before rendering, redirecting away if the check fails.

\`\`\`tsx
function ProtectedRoute({ roles, children }: { roles?: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Skeleton />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}
\`\`\`

## The loading state matters as much as the checks

On first load, the app usually doesn't yet know whether the user is authenticated — it's still checking a stored token or waiting on a session request. Redirecting to login *before* that check finishes is a common bug: a genuinely logged-in user gets briefly bounced to the login page on every page refresh. The loading branch above exists specifically to prevent that flash.

## Client-side checks are a UX layer, not security

Hiding a route on the frontend stops a user from casually navigating somewhere they shouldn't — it does not stop a determined attacker from calling the underlying API directly. The real authorization check always has to happen on the server, on every request, regardless of what the frontend does or doesn't render.`,
            },
            {
              id: 'fe-development-auth-l3',
              title: 'Session management & authorization',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `Authentication answers "who is this user?" Authorization answers "what is this user allowed to do?" — they're related but distinct, and conflating them causes bugs.

## Session management on the frontend

Beyond storing a token, session management covers: staying logged in across a page refresh (rehydrating auth state on app load), handling token expiry gracefully (silently refreshing, or redirecting to login with a clear message rather than a confusing broken state), and logging out cleanly (clearing all stored auth state, not just navigating away).

## Authorization patterns

- **Role-based**: a user has a role (\`admin\`, \`mentor\`, \`intern\`) and permissions are checked against that role
- **Resource-based**: a user can act on a specific resource only if they own it or were granted access to it, independent of their general role

Most real applications combine both — an admin role might grant broad access, while a regular user might additionally need to own the specific resource they're trying to modify.

## A UX detail that's easy to miss

When a user's session expires mid-task (say, while filling out a long form), losing their work along with their session is a bad experience. Where practical, preserve unsaved input locally so a re-login doesn't also mean starting over.`,
            },
          ],
          practice: [
            { id: 'fe-development-auth-p1', title: 'Implement protected routes secured with JWT authentication', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-development-dashboard',
          title: 'Day 7 · Dashboard Development',
          description: 'Cards, charts, tables, and filters.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            {
              id: 'fe-development-dashboard-l1',
              title: 'Cards & charts',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 1,
              content: `Dashboards are how most users experience "data" in a product — the difference between a good and mediocre dashboard is usually about hierarchy, not decoration.

## Stat cards

A stat card's job is to make one number scannable at a glance: the value itself should be the visually dominant element, with the label secondary and any trend indicator (up/down, a sparkline) providing context without competing for attention.

\`\`\`tsx
function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border p-4 flex items-center gap-3">
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-lg font-bold tabular-nums truncate">{value}</p>
        <p className="text-xs text-secondary truncate">{label}</p>
      </div>
    </div>
  );
}
\`\`\`

Note \`tabular-nums\` — it keeps digits a fixed width so numbers don't visually jitter as they update, which matters a surprising amount for anything showing live or frequently-changing values.

## Charts

The right chart type depends on what question it answers: a line chart shows change over time, a bar chart compares discrete categories, a pie chart shows proportion of a whole (and is easy to overuse — beyond 4-5 slices it usually becomes hard to read, and a simple list of numbers is often clearer). Always give a chart a visible legend, and never rely on color alone to distinguish series, since that excludes colorblind users.`,
            },
            {
              id: 'fe-development-dashboard-l2',
              title: 'Tables & filters',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 2,
              content: `Tables are where a lot of real product work happens, and filtering large tables well is a genuinely common frontend problem worth understanding properly.

\`\`\`tsx
function useTableFilters<T>(items: T[], filters: Record<string, (item: T) => boolean>) {
  const [active, setActive] = useState<string[]>([]);

  const filtered = useMemo(
    () => items.filter(item => active.every(key => filters[key](item))),
    [items, active, filters]
  );

  return { filtered, active, setActive };
}
\`\`\`

## Design considerations beyond the logic

- Show the user how many results a filter combination returned, and make it obvious how to clear filters — a table that's silently filtered down to zero rows with no explanation looks broken, not filtered
- For large datasets, filter and sort on the server rather than pulling everything to the client and filtering in the browser — this keeps the table fast regardless of how much data exists
- Preserve filter state across navigation where it makes sense (in the URL as query params is the standard pattern) so a user doesn't lose their view when they click into a row and come back

## Sorting

Clicking a column header to sort should be discoverable (a visible sort indicator) and should cycle through ascending, descending, and often back to the original order — silently getting stuck in one sort direction is a common, easily-avoided frustration.`,
            },
          ],
          practice: [
            { id: 'fe-development-dashboard-p1', title: 'Build a data dashboard with filterable, sortable tables', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-development-forms',
          title: 'Day 8 · Forms',
          description: 'Validation, file upload, and dynamic forms.',
          estimatedMinutes: 60,
          order: 4,
          lessons: [
            {
              id: 'fe-development-forms-l1',
              title: 'Form validation',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Validation exists to catch mistakes early and explain them clearly — its job is user guidance, not gatekeeping.

## Client-side and server-side validation are both required

Client-side validation gives immediate feedback without a round trip, which is what makes forms feel responsive. But it can always be bypassed (a direct API call, a disabled JS environment), so the server must validate everything again regardless of what the client already checked. Skipping server validation because "the frontend already checks it" is a real security gap, not a theoretical one.

## When to validate

- **On blur** (when a field loses focus) for most fields — validating on every keystroke while someone is still typing their email address produces a wall of red error messages for input that isn't finished yet
- **On submit** as a final full-form check, surfacing every remaining error at once
- **Inline, near the field** it belongs to — a summary of errors at the top of a long form forces the user to hunt for which field each one refers to

## Writing error messages worth reading

"Invalid input" tells a user nothing useful. "Enter a valid email address, like name@example.com" tells them exactly what's wrong and what to do about it. The extra ten seconds of writing a specific message saves far more time in reduced support questions and abandoned forms.`,
            },
            {
              id: 'fe-development-forms-l2',
              title: 'File upload',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `File uploads combine a few concerns that are each simple alone but easy to get wrong together: selecting a file, validating it, showing progress, and handling failure.

\`\`\`tsx
function handleFileSelect(file: File) {
  if (file.size > MAX_SIZE_BYTES) {
    setError('File is too large — max 5MB.');
    return;
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    setError('Unsupported file type — upload a PDF or DOCX.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  uploadFile(formData, { onProgress: setUploadProgress });
}
\`\`\`

## What good file-upload UX includes

- Validate file size and type **before** starting the upload, not after it fails partway through — nobody wants to wait for a slow upload just to be told it was rejected
- Show real progress on anything that isn't near-instant — a spinner with no indication of progress reads as "stuck," even when it isn't
- Support drag-and-drop as an addition to a normal file picker, never as a replacement for it — some users, and some assistive technologies, need the standard input
- Let the user replace or remove a selected file before submitting, not just start over from scratch

A file input is one of the few places where the browser's native behavior (a file picker dialog) can't be fully styled — most teams visually hide the native input and trigger it from a custom-styled button instead, while keeping the native input for actual keyboard and screen-reader accessibility.`,
            },
            {
              id: 'fe-development-forms-l3',
              title: 'Dynamic forms',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 3,
              content: `A dynamic form is one whose fields change based on data or user input, rather than being a fixed, hardcoded layout — think a job application form whose questions vary by which job was selected.

## The core pattern

Rather than hardcoding each field in JSX, the form is driven by a configuration: an array describing each field's type, label, validation rules, and (for conditional fields) when it should appear. The component then maps over that configuration and renders the appropriate input for each entry.

\`\`\`tsx
const fields: FieldConfig[] = [
  { name: 'email', type: 'email', label: 'Email', required: true },
  { name: 'resume', type: 'file', label: 'Resume', required: true },
  { name: 'referral', type: 'text', label: 'Referral name', showIf: (values) => values.heardFrom === 'referral' },
];
\`\`\`

## Why this earns its complexity

Once a form has more than a handful of conditional fields, hardcoding each one in JSX with manual show/hide logic becomes hard to follow and easy to break. A config-driven form keeps the *structure* of the form as data, separate from the *rendering* logic — adding a field becomes a config change instead of a new branch of conditional JSX.

## Where to be careful

Dynamic forms still need the same validation discipline as static ones — every field in the config needs a validation rule, and conditional fields that become hidden should typically have their values cleared, not silently submitted alongside a form that no longer displays them.`,
            },
          ],
          practice: [
            { id: 'fe-development-forms-p1', title: 'Build a multi-step form with validation and file upload', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'fe-development-checkpoint', title: '[Mentor Checkpoint] Midpoint Assessment (Day 8)', kind: 'coding', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
        {
          id: 'fe-development-performance',
          title: 'Day 9 · Performance',
          description: 'Lazy loading, memoization, and code splitting.',
          estimatedMinutes: 55,
          order: 5,
          lessons: [
            {
              id: 'fe-development-performance-l1',
              title: 'Lazy loading',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Lazy loading means deferring the cost of something — code, an image, data — until it's actually needed, instead of paying for it upfront on every page load.

## The most common form: route-based code splitting

A React app's admin panel, settings pages, and rarely-visited screens don't need to be in the same JavaScript bundle a first-time visitor downloads just to see the landing page. Lazy-loading routes means each page's code is only fetched when a user actually navigates there.

## Image lazy loading

Images below the fold don't need to load before a user has scrolled anywhere near them. The native \`loading="lazy"\` attribute on an \`<img>\` tag handles this without any JavaScript, deferring the image request until it's about to enter the viewport.

## What it costs

Lazy loading trades a slightly more complex loading experience (a brief loading state the first time a lazy chunk is needed) for a meaningfully smaller initial bundle and faster first paint. For anything a user is very likely to need immediately, eager loading is still the right call — lazy loading is for the parts of an app most users won't touch on a typical visit, not for the primary UI they land on.`,
            },
            {
              id: 'fe-development-performance-l2',
              title: 'Memoization',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `Memoization skips redundant work by reusing a previous result when the inputs haven't changed. In React, that mainly means three tools: \`useMemo\`, \`useCallback\`, and \`React.memo\`.

\`\`\`tsx
const sortedItems = useMemo(
  () => items.slice().sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

const handleSelect = useCallback((id: string) => {
  setSelected(id);
}, []);

const Row = React.memo(function Row({ item }: { item: Item }) {
  return <li>{item.name}</li>;
});
\`\`\`

## What each one actually does

- \`useMemo\` caches a computed **value** so an expensive calculation (sorting, filtering large lists) doesn't re-run on every render
- \`useCallback\` caches a **function reference** so it doesn't count as "changed" between renders — mainly useful when that function is a prop to a memoized child
- \`React.memo\` skips re-rendering a component entirely if its props are shallowly equal to last time

## The trap: memoizing everything

Memoization itself has a cost — comparing dependencies, holding cached values in memory. Wrapping every function in \`useCallback\` and every component in \`React.memo\` "just in case" often makes code harder to read for no measurable benefit, because most components are cheap enough that re-rendering them is not actually the bottleneck. Reach for memoization when profiling shows a real, specific slow spot — not as a default habit applied everywhere.`,
            },
            {
              id: 'fe-development-performance-l3',
              title: 'Code splitting',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `Code splitting breaks a single large JavaScript bundle into smaller chunks that load independently — it's the mechanism that makes lazy loading routes actually work.

## How it typically happens

Modern bundlers (Vite included) automatically split code at dynamic \`import()\` boundaries. Pairing that with \`React.lazy\` and \`Suspense\` means a route's code is only fetched when the user navigates to it:

- Each top-level route becomes its own chunk
- Large, rarely-used libraries (a rich text editor, a charting library used on one page) get split out so pages that don't use them don't pay for them
- Shared, frequently-used code (the design system, core utilities) stays in a common chunk that's cached once and reused

## Measuring whether it's helping

A bundle analyzer (visualizing what's actually in each chunk) is the right tool here, not guessing. It's common to discover an unexpectedly large dependency was pulled into the main bundle by an import that didn't need to be eager — something a bundle visualization makes obvious in seconds and would be very hard to find by reading source code.

## The balance to strike

Too few splits means users download code they'll never use. Too many splits means excessive network round trips, each with its own latency. Splitting along natural boundaries — routes, and genuinely large optional features — usually gets this balance right without much fine-tuning.`,
            },
          ],
          practice: [
            { id: 'fe-development-performance-p1', title: 'Optimize a slow-rendering component using memoization and lazy loading', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-development-accessibility',
          title: 'Day 10 · Accessibility',
          description: 'WCAG standards, keyboard navigation, and screen readers.',
          estimatedMinutes: 50,
          order: 6,
          lessons: [
            {
              id: 'fe-development-accessibility-l1',
              title: 'WCAG fundamentals',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `WCAG (Web Content Accessibility Guidelines) is the standard reference for what "accessible" actually means in concrete, testable terms — not a vague ideal, but specific criteria.

## The four principles

WCAG organizes around four principles, often remembered as POUR:

- **Perceivable** — content must be presentable in ways users can perceive (alt text for images, sufficient color contrast, captions for video)
- **Operable** — interface elements must be usable (keyboard-operable, no content that flashes in a way that could trigger seizures, enough time to complete actions)
- **Understandable** — content and operation must be understandable (clear labels, consistent navigation, helpful error messages)
- **Robust** — content must work reliably across assistive technologies, now and as they evolve (valid, semantic markup)

## Conformance levels

WCAG defines A, AA, and AAA levels, with AA being the standard most organizations target and often a legal requirement in many jurisdictions. AA includes things like a 4.5:1 contrast ratio for normal text and full keyboard operability for all functionality.

## Why this isn't a niche concern

Accessibility failures affect users with permanent disabilities, but also situational ones — someone using a phone in bright sunlight (contrast), someone with a broken mouse (keyboard access), someone in a loud environment (captions). Building accessibly from the start is dramatically cheaper than retrofitting it later, and it improves the product for far more people than the most visible cases suggest.`,
            },
            {
              id: 'fe-development-accessibility-l2',
              title: 'Keyboard navigation',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Every interactive element on a page should be reachable and operable using only a keyboard — no mouse, no touch. This isn't an edge case: it's how many users with motor impairments navigate every website, and it's also how power users often prefer to work.

## What to check

- **Tab order** follows a logical, visual reading order — jumping around unpredictably is disorienting
- **Focus is always visible** — never remove a focus outline without replacing it with an equally visible custom one; an invisible focus state makes keyboard navigation unusable even though it technically "works"
- **All interactive elements are reachable** — a \`<div onClick>\` styled to look like a button is invisible to keyboard navigation entirely, because a div isn't focusable by default. Use a real \`<button>\`
- **Custom components handle expected keys** — a dropdown should open on Enter or Space, close on Escape, and navigate options with arrow keys, matching what users already expect from native equivalents

## A fast way to audit any page

Unplug your mouse (or just don't touch it) and try to complete a core task — logging in, filling a form, opening a menu — using only Tab, Shift+Tab, Enter, Space, and arrow keys. Anywhere you get stuck, unsure where focus went, or unable to reach something, is a real accessibility gap a keyboard-only user hits every time.`,
            },
            {
              id: 'fe-development-accessibility-l3',
              title: 'Screen reader support',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `A screen reader converts on-screen content into speech or braille output. Supporting it well is mostly about using semantic HTML correctly — most of the work is already done for you if the underlying markup is right.

## Semantic HTML does the heavy lifting

A real \`<button>\`, \`<nav>\`, \`<main>\`, and heading hierarchy (\`<h1>\` through \`<h6>\` used in order, not skipped for visual sizing reasons) gives a screen reader everything it needs to describe structure and let users navigate by landmark or heading — a feature many screen reader users rely on constantly to skip around a page efficiently.

## Where ARIA comes in

ARIA attributes fill gaps semantic HTML can't cover on their own — \`aria-label\` for an icon-only button with no visible text, \`aria-live\` for content that updates dynamically (a toast notification, a live search result count) so it gets announced without the user needing to navigate to it, \`aria-expanded\` on a disclosure toggle so its current state is communicated.

The first rule of ARIA is to use as little of it as possible: a native \`<button>\` already has the right role and keyboard behavior built in; adding \`role="button"\` to a div and manually replicating all of that native behavior is more work and more error-prone than just using the real element.

## Testing without buying anything

macOS ships with VoiceOver, Windows with Narrator — both are free and built in. Turning one on and navigating your own interface for ten minutes surfaces problems no amount of reading about accessibility will show you.`,
            },
          ],
          practice: [
            { id: 'fe-development-accessibility-p1', title: 'Audit and fix accessibility issues in an existing page', kind: 'debugging', order: 1 },
          ],
        },
      ],
    },
    {
      id: 'fe-project',
      key: 'project',
      title: 'Project',
      description: "Days 11-13 · Industry simulation -- sprint planning, ticket-based feature development, and code review exactly as a real engineering team works.",
      order: 3,
      modules: [
        {
          id: 'fe-project-simulation',
          title: 'Industry Simulation Sprint',
          description: 'Work an assigned ticket end-to-end: plan, build, open a pull request, and respond to review feedback.',
          estimatedMinutes: 40,
          order: 1,
          lessons: [
            {
              id: 'fe-project-simulation-l1',
              title: 'Sprint planning & ticket assignment',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `A sprint is a fixed time box — usually one to two weeks — in which a team commits to completing a specific set of work, then reviews what actually got done.

## What happens in sprint planning

The team looks at a prioritized backlog of tickets (each describing one piece of work, with acceptance criteria describing what "done" means) and decides which fit into the upcoming sprint, based on estimated effort and team capacity. Tickets get assigned to individuals or picked up as work progresses.

## What makes a good ticket

- A clear, specific title — not "fix dashboard" but "dashboard shows stale data after a filter is cleared"
- Concrete acceptance criteria — the conditions that must be true for the ticket to be considered complete, ideally specific enough that two different engineers would agree on whether it's met
- Enough context to start without immediately needing to ask questions, but not so much detail that it removes all engineering judgment

## Your role in this simulation

You'll be assigned a ticket the same way a new engineer joining a real team would be. Read the acceptance criteria carefully before writing any code — the majority of wasted engineering effort comes from solving a slightly different problem than the one that was actually asked for.`,
            },
            {
              id: 'fe-project-simulation-l2',
              title: 'Feature development workflow',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 2,
              content: `Building a feature on a real team follows a rhythm that's worth internalizing now, because it's the same rhythm you'll use on every team afterward.

## The workflow

1. Read the ticket fully before writing code — form a mental plan first
2. Create a branch from the latest main
3. Build incrementally, committing in small, reviewable chunks as you go rather than one giant commit at the end
4. Test your own change against the acceptance criteria before asking anyone else to review it
5. Open a pull request with a description that explains what changed and why, not just what files were touched

## Working with ambiguity

Real tickets are rarely perfectly specified. When something is genuinely unclear, the right move is usually to make a reasonable, documented assumption and flag it in the PR description — not to block entirely waiting for clarification, and not to silently guess without saying so. "I assumed X because Y — let me know if that's wrong" keeps momentum while staying honest about uncertainty.

## Scope discipline

It's tempting to fix an unrelated bug you notice while working on a ticket. Resist it — note it separately (a new ticket, a comment) and keep your current branch focused on exactly what it set out to do. A focused PR is faster to review and safer to merge than one that quietly does three things at once.`,
            },
            {
              id: 'fe-project-simulation-l3',
              title: 'Pull requests & code reviews',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `A pull request is both a request to merge code and, often more importantly, a conversation about that code with the rest of the team.

## Writing a PR worth reviewing quickly

- A description that says what changed and *why* — the diff already shows *what*, so the description's real job is explaining the reasoning a diff can't show on its own
- Screenshots or a short recording for any visual change — reviewers shouldn't have to pull your branch locally just to see what a button looks like now
- A reasonable size — a 40-file PR gets a shallow review because nobody can hold that much context at once; a 4-file PR gets a real one

## Receiving feedback well

Code review comments are about the code, not a judgment of the person who wrote it — internalizing that early makes the whole process far less stressful. If a comment is unclear, ask for clarification rather than guessing at what the reviewer meant. If you disagree with a suggestion, explain your reasoning rather than either silently complying or silently ignoring it — most disagreements resolve quickly once both sides' reasoning is actually on the table.

## Giving feedback well

Be specific ("this could cause a stale closure if the dependency array is empty" beats "this looks wrong"), and distinguish between a blocking issue and a stylistic preference — not everything you'd do differently needs to block a merge.`,
            },
            {
              id: 'fe-project-simulation-l4',
              title: 'Merge conflict resolution',
              contentType: 'code',
              estimatedMinutes: 10,
              order: 4,
              content: `A merge conflict happens when Git can't automatically reconcile changes to the same lines of a file made on two different branches. It looks alarming the first time; it's routine once you understand what you're looking at.

\`\`\`
<<<<<<< HEAD
const buttonLabel = 'Submit Application';
=======
const buttonLabel = 'Apply Now';
>>>>>>> feature/copy-update
\`\`\`

Everything between \`<<<<<<< HEAD\` and \`=======\` is your current branch's version; everything between \`=======\` and \`>>>>>>>\` is the incoming branch's version. Resolving the conflict means editing the file to keep the correct combination — sometimes one side, sometimes the other, sometimes a merge of both — and deleting all three marker lines.

## The general process

\`\`\`
git checkout your-branch
git merge main
# Git pauses and marks conflicted files
# Open each conflicted file, resolve the markers by hand
git add <resolved files>
git commit
\`\`\`

## What actually prevents most conflicts

Conflicts get worse the longer two branches diverge. Merging main into your branch regularly (rather than once, right before opening a PR) keeps each individual conflict small and easy to reason about. Waiting two weeks and merging main once tends to produce a conflict across dozens of lines that's genuinely hard to resolve correctly — a problem almost entirely avoidable by just doing it more often.`,
            },
          ],
          practice: [
            { id: 'fe-project-simulation-p1', title: 'Resolve your assigned sprint ticket end-to-end', kind: 'coding', order: 1 },
            { id: 'fe-project-simulation-p2', title: 'Fix a reported bug and verify it with QA testing', kind: 'debugging', order: 2 },
          ],
          submission: { id: 'fe-project-simulation-s1', title: 'Submit your sprint feature pull request', instructions: 'Link the pull request for the ticket you were assigned during the sprint.', requiresLink: true },
          assessment: { id: 'fe-project-simulation-checkpoint', title: '[Mentor Checkpoint] Sprint Evaluation (Day 12)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'fe-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Mentor evaluation of your project-readiness before the capstone and client project allocation.',
      order: 4,
      modules: [
        {
          id: 'fe-readiness-eval',
          title: 'Project Readiness Review (Day 15)',
          description: 'Your mentor reviews sprint performance, code quality, and collaboration before you begin the capstone.',
          order: 1,
          lessons: [
            {
              id: 'fe-readiness-eval-l1',
              title: 'What to expect from your readiness review',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `The readiness review is a checkpoint, not a pass/fail exam — its purpose is to make sure you head into the capstone with a clear, honest picture of where you're strong and where you still need support.

## What your mentor will look at

- How you handled your sprint ticket: the quality of the final code, but also how you approached ambiguity and communicated along the way
- Code quality trends across the module — not just the final submission, but the trajectory of your commits and how you responded to review feedback
- Collaboration: how you gave and received feedback during code review, and whether you communicated blockers early rather than going quiet

## How to prepare

There's no separate assignment to complete for this specifically — it's a review of the work you've already done through Days 1-14. The most useful preparation is honest self-reflection: what part of the sprint felt hardest, what feedback did you get repeatedly, and what would you do differently starting the capstone tomorrow.

## What comes next

Feedback from this review is meant to shape how you approach the capstone, not to gate whether you can start it. Come into the conversation ready to listen more than defend — the goal is calibration, not a verdict.`,
            },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'fe-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Capstone project, technical presentation, interview preparation, and certification.',
      order: 5,
      modules: [
        {
          id: 'fe-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Build and ship a production-ready capstone application, then present it for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            {
              id: 'fe-graduation-capstone-l1',
              title: 'Capstone briefing & project options',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `The capstone is where everything from the last fourteen days comes together into one project you build, own, and present end to end.

## What "production-ready" means here

Not a polished demo that only works on the happy path — a project that handles loading and error states, that's responsive across screen sizes, that has a coherent visual system, and that another engineer could reasonably pick up and understand. The bar is "would I be comfortable putting this in front of a real user," not "does it technically run."

## Project options

- **Internship Portal** — a scoped version of the kind of application platform you've been training inside
- **Learning Management System** — course browsing, progress tracking, a learner dashboard
- **Admin Dashboard** — data-dense views, filtering, role-based access, bulk actions
- **SaaS Platform** — a focused product slice: authentication, a core workflow, a settings area

Pick something you can genuinely finish to a high standard in the time available — a smaller project executed well demonstrates far more skill than an ambitious one left half-working.

## What you'll actually be evaluated on

Architecture and code quality, not just visual polish. A mentor reviewing your capstone is looking at the same things a real code review would: is state managed sensibly, are components organized well, is the API integration handled with proper loading and error states, is the UI accessible and responsive.`,
            },
            {
              id: 'fe-graduation-capstone-l2',
              title: 'Interview & portfolio preparation',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `The capstone doubles as your strongest portfolio piece and your best interview talking point — worth treating both of those uses seriously, not just the act of building it.

## Preparing your portfolio presentation

- Lead with the problem the project solves, not the tech stack — stack details matter, but only after the audience understands *why* the project exists
- Show, don't just tell: a short recording or live walkthrough of the actual working product is more convincing than a description of it
- Be ready to talk about a decision you'd make differently now — this signals real engineering judgment far more than claiming everything went perfectly

## Common frontend interview topics worth reviewing

- Core React concepts: the render cycle, hooks rules, when and why re-renders happen
- JavaScript fundamentals: closures, the event loop, array methods, async/await
- Practical debugging: given a broken component, walk through how you'd isolate the cause
- System-level thinking: how would this feature scale, what would you change for 10x the data or 10x the users

## Live coding and whiteboard sessions

The evaluator usually cares more about your reasoning process — how you break down a problem, what questions you ask, how you handle getting stuck — than about arriving at a perfect answer immediately. Narrating your thinking out loud, even when uncertain, is almost always better than working in silence.`,
            },
          ],
          practice: [],
          submission: { id: 'fe-graduation-capstone-s1', title: 'Submit your capstone project for certification review', instructions: 'Include your deployed application link and repository link. Your mentor reviews code quality, architecture, and presentation before certification.', requiresLink: true },
          assessment: { id: 'fe-graduation-final', title: '[Mentor Checkpoint] Final Technical Assessment (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
