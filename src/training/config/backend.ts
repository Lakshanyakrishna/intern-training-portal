import type { TrainingTrackConfig } from './types';

// Backend Development Training Handbook v1.0 -- Lumora's 18-day,
// mentor-led + project-based + industry-simulation program. Days map onto
// modules (Days 1-4 -> Foundation, 5-10 -> Development, 11-13 -> Project
// sprint simulation, 15 -> Readiness, 16-18 -> Graduation capstone), same
// mapping as frontend.ts. The five mentor checkpoints (handbook section 12)
// are wired in as module assessments except the Day 15 readiness review,
// which stays a bare module: that evaluation runs through the app's
// separate real ReadinessEvaluation admin flow, not a self-service
// assessment here. Every lesson's `content` is real written material
// derived from the handbook's own topic list -- see LessonConfig in
// ./types.ts for the markdown-lite subset it's written in.
export const backendTrack: TrainingTrackConfig = {
  forte: 'Backend',
  trackName: 'Backend Engineering',
  description: 'An 18-day, mentor-led, project-based backend engineering program: REST API design, relational databases with Prisma, authentication & authorization, and a capstone project -- per the Lumora Backend Development Training Handbook v1.0.',
  stages: [
    {
      id: 'be-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Backend project setup, API development, database design, and Prisma ORM.',
      order: 1,
      modules: [
        {
          id: 'be-foundation-setup',
          title: 'Day 1 · Backend Project Setup',
          description: 'Configure your Node.js/Express project, learn the team Git workflow, and ship your first API endpoint.',
          estimatedMinutes: 70,
          order: 1,
          lessons: [
            {
              id: 'be-foundation-setup-l1',
              title: 'Project structure & development environment',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A backend project's structure has to answer one question clearly: where does a request go when it arrives, and what does it pass through on the way to a response?

## A structure that scales

- **routes/** define the URL paths and which handler owns each one
- **controllers/** parse the request and shape the response — no business logic lives here
- **services/** hold the actual business logic, independent of HTTP entirely
- **models/** (or a Prisma schema) define the data shape and how it's persisted
- **middleware/** holds cross-cutting concerns — auth checks, logging, error handling — that apply across many routes

## Environment configuration

Backend services almost always need environment-specific configuration: a database connection string, API keys for third-party services, the port to listen on. All of it loads from environment variables, never hardcoded, and real secrets never get committed — a \`.env.example\` file with placeholder values documents what's needed without exposing anything real.

## Why this matters more on the backend than the frontend

A frontend bug is usually visible immediately in the browser. A backend bug can silently corrupt data, leak information, or fail in a way nobody notices until a user reports it. A clear, consistent structure is what makes a backend codebase auditable — you can trace exactly what happens to a request without guessing.`,
            },
            {
              id: 'be-foundation-setup-l2',
              title: 'Node.js runtime fundamentals',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Node.js runs JavaScript outside the browser, which is what makes it possible to write a server in the same language as the frontend. Understanding its execution model matters because it behaves differently from most other backend runtimes.

## Single-threaded, event-driven

Node runs your JavaScript on a single thread, but handles I/O (database queries, file reads, network requests) asynchronously through an event loop. While a database query is in flight, Node isn't blocked waiting — it's free to handle other incoming requests, and comes back to yours when the result is ready.

## What this means in practice

- CPU-heavy synchronous work (a large in-memory computation) *does* block the event loop and stalls every other request being handled at that moment — this is the main performance trap specific to Node
- I/O-heavy work — which is most of what a typical API does — is exactly what Node is efficient at, since it isn't burning a thread per connection waiting on the database
- \`async\`/\`await\` is how modern Node code expresses this without deeply nested callbacks; under the hood it's still the same non-blocking event loop

## The practical takeaway

If an endpoint feels unexpectedly slow under load, the first question is usually: is something doing synchronous, CPU-heavy work on the request path? That's the one place Node's model can genuinely hurt you, and it's worth knowing to look for it specifically.`,
            },
            {
              id: 'be-foundation-setup-l3',
              title: 'Express framework basics',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 3,
              content: `Express is a minimal web framework on top of Node's HTTP module — it handles routing, middleware, and request/response helpers so you're not writing raw HTTP parsing by hand.

\`\`\`js
import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
\`\`\`

## The three things happening here

- \`express.json()\` is middleware — it runs before your route handlers and parses incoming JSON bodies so \`req.body\` is usable
- \`app.get(path, handler)\` registers a route: this HTTP method, at this path, runs this function
- \`res.json(...)\` sends a JSON response and sets the correct \`Content-Type\` header automatically

## Why "minimal" is a feature, not a limitation

Express doesn't impose a folder structure, an ORM, or an authentication approach — those are all separate choices you make deliberately. That's different from a more opinionated framework, and it's exactly why Express is so common as the foundation for a custom, team-specific architecture: it gives you routing and middleware, and gets out of the way for everything else.

Middleware order matters. A middleware registered with \`app.use()\` before your routes runs on every request that reaches them; one registered after a specific route only applies there.`,
            },
            {
              id: 'be-foundation-setup-l4',
              title: 'Git workflow & environment configuration',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 4,
              content: `The same branching discipline that keeps a frontend team's history clean applies just as much to a backend repo — a feature branch per change, small commits, a pull request before merging to main.

## What's specific to backend work

- **.env files are always gitignored.** A committed secret (a database password, an API key) is a real incident, not a theoretical one — many teams add a pre-commit hook that scans for accidentally-staged secrets as a safety net
- **Database migrations are committed alongside the code that needs them.** A migration file and the model change it supports should land in the same PR, so checking out any commit leaves the codebase and the expected schema in sync
- **Seed data and environment setup scripts** belong in the repo so a new engineer (or a new intern) can get a working local database in one command, not a page of manual instructions

## A habit worth building now

Before opening a PR, run the project's lint and test commands locally. Catching a broken test on your own machine takes thirty seconds; catching it after a reviewer has already looked at your PR wastes both your time and theirs, and it's exactly the kind of thing CI exists to catch — but catching it yourself first is still faster.`,
            },
          ],
          practice: [
            { id: 'be-foundation-setup-p1', title: 'Configure your backend project, create an Express server, and ship your first API endpoint', kind: 'interactive', order: 1 },
          ],
        },
        {
          id: 'be-foundation-api',
          title: 'Day 2 · API Development',
          description: 'REST architecture, HTTP methods, middleware, and route organization.',
          estimatedMinutes: 60,
          order: 2,
          lessons: [
            {
              id: 'be-foundation-api-l1',
              title: 'REST architecture & HTTP methods',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `REST organizes an API around resources — nouns, not verbs — and uses HTTP methods to express the action being taken on them.

## The conventions

- \`GET /opportunities\` — list resources
- \`GET /opportunities/:id\` — fetch one
- \`POST /opportunities\` — create one
- \`PATCH /opportunities/:id\` — update one (partial update; \`PUT\` implies a full replace)
- \`DELETE /opportunities/:id\` — remove one

Nested resources follow the same pattern: \`GET /opportunities/:id/applications\` reads as "the applications belonging to this opportunity" — the URL structure itself communicates the relationship.

## Why consistency here matters so much

An API that follows these conventions predictably is one a frontend engineer — or another backend engineer joining the project — can guess correctly without reading documentation. An API that mixes conventions (some actions as query params, some as URL segments, verbs showing up in URLs like \`/getOpportunities\`) forces everyone who touches it to look everything up every time.

## Status codes are part of the contract

200 for success, 201 for a resource that was just created, 204 for a successful action with no body to return, 400 for bad input, 401 for missing/invalid auth, 403 for authenticated-but-not-permitted, 404 for not found, 500 for a server error. A frontend can build real, specific error handling around these — but only if the backend uses them correctly and consistently.`,
            },
            {
              id: 'be-foundation-api-l2',
              title: 'Request & response handling',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `Every request carries information in a few distinct places, and knowing which one to reach for is the first thing to get right in a handler.

\`\`\`js
app.get('/opportunities/:id', (req, res) => {
  const { id } = req.params;        // URL segment
  const { include } = req.query;    // ?include=applications
  // req.body is used on POST/PATCH, not GET

  const opportunity = findOpportunity(id);
  if (!opportunity) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }
  res.status(200).json(opportunity);
});
\`\`\`

## Params, query, and body

- **Route params** (\`req.params\`) identify *which* resource — they're part of the URL path itself
- **Query params** (\`req.query\`) modify *how* the request is handled — filtering, sorting, pagination, optional includes
- **Body** (\`req.body\`) carries the actual data being sent — used for creating or updating a resource, not for identifying or filtering one

## Response shape consistency

Picking a consistent response shape across every endpoint — say, always returning the resource directly on success and always \`{ error: string }\` on failure — means the frontend can write one shared error-handling function instead of a special case per endpoint. Deciding this once, early, and writing it down saves real inconsistency later as more endpoints get added by more people.`,
            },
            {
              id: 'be-foundation-api-l3',
              title: 'Middleware & route organization',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 3,
              content: `Middleware is a function that runs *between* the request arriving and the final handler responding — it can inspect the request, modify it, short-circuit with an early response, or just pass control along.

\`\`\`js
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    req.user = verifyToken(token);
    next(); // pass control to the next middleware or route handler
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/applications', requireAuth, listApplications);
\`\`\`

## Why middleware, specifically

Without it, every route handler that needs authentication would repeat the same token-checking logic. Middleware pulls that cross-cutting concern out once and applies it declaratively wherever it's needed — \`requireAuth\` reads as documentation of what the route requires, right in the route definition.

## Route organization at scale

As an API grows, routes are typically split into one file per resource (\`routes/opportunities.js\`, \`routes/applications.js\`) and mounted onto a shared base path in a central place. This keeps any single file focused and makes it obvious where to add a new endpoint for a given resource — you don't have to hunt through one enormous file of every route the API exposes.`,
            },
          ],
          practice: [
            { id: 'be-foundation-api-p1', title: 'Build CRUD APIs with request validation', kind: 'coding', order: 1 },
          ],
          challenge: { id: 'be-foundation-api-c1', title: 'Build a fully validated resource API with pagination and filtering', kind: 'coding', description: 'Harder, capstone-style exercise for this module.', order: 1 },
        },
        {
          id: 'be-foundation-database',
          title: 'Day 3 · Database Design',
          description: 'Relational databases, PostgreSQL, schema design, and normalization.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            {
              id: 'be-foundation-database-l1',
              title: 'Relational databases & PostgreSQL',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A relational database stores data in tables — rows and columns — and expresses relationships between tables through shared keys rather than nesting data inside itself.

## Why relational, and why PostgreSQL specifically

Relational databases enforce structure: every row in a table has the same columns, foreign keys guarantee a referenced row actually exists, and transactions guarantee a group of changes either all succeed or all roll back together. That structure is exactly what most business applications need — an application, a user, an opportunity all have a well-defined, fairly stable shape.

PostgreSQL is a mature, open-source relational database with strong support for complex queries, JSON columns when you genuinely need flexible data, full-text search, and strict data integrity guarantees. It's the default choice for a large share of production backends for good reason: it's reliable, well-documented, and rarely the limiting factor in an application's performance.

## The core building blocks

- A **table** represents one type of entity (users, applications, opportunities)
- A **primary key** uniquely identifies each row
- A **foreign key** references a primary key in another table, expressing a relationship
- An **index** speeds up lookups on a column at the cost of slightly slower writes — added deliberately on columns that are queried often, not on everything by default

Getting comfortable reading and writing basic SQL — even if an ORM handles most day-to-day queries — matters because ORMs occasionally generate inefficient queries, and being able to read the actual SQL is how you catch that.`,
            },
            {
              id: 'be-foundation-database-l2',
              title: 'Schema design & relationships',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Schema design is deciding what tables exist, what columns they have, and how they relate to each other — get this right early, because changing it later, after real data exists, is far more expensive than getting it right the first time.

## The three relationship types

- **One-to-many**: one opportunity has many applications; each application belongs to exactly one opportunity. Modeled with a foreign key on the "many" side (\`applications.opportunity_id\`)
- **Many-to-many**: a user might have many skills, and a skill applies to many users. Modeled with a join table (\`user_skills\`) that holds a foreign key to each side
- **One-to-one**: less common — a user and their single profile record, for instance

## Designing for the questions you'll actually ask

Good schema design starts from the queries the application actually needs, not from an abstract model of "the domain." If you'll frequently need "all applications for a given opportunity, sorted by date," the schema needs a foreign key and an index that makes that query fast — designing tables in isolation, without thinking about access patterns, often produces a schema that's technically correct but painful to query in practice.

## Naming conventions

Consistent naming (snake_case column names, a singular or plural table-naming convention applied uniformly, a consistent foreign key naming pattern like \`opportunity_id\`) sounds cosmetic but genuinely reduces mistakes — inconsistent naming is a frequent source of subtle bugs in hand-written SQL and migration files.`,
            },
            {
              id: 'be-foundation-database-l3',
              title: 'Normalization',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `Normalization is the process of structuring a database to minimize redundant data — storing each fact exactly once, in exactly one place.

## Why redundancy is a real problem

If a user's email is stored both in a \`users\` table and copied into every \`applications\` row they've submitted, updating their email means updating it in multiple places — miss one, and the database now contains two different "true" answers to the same question. Normalization avoids this by storing the email once, in \`users\`, and having \`applications\` reference the user by ID instead of duplicating their data.

## The normal forms, practically speaking

The formal normal forms (1NF, 2NF, 3NF) are worth knowing exist, but in practice most schema design converges on the same few rules: every table has a clear primary key, every non-key column depends on that key (and nothing else), and repeating groups of data get split into their own related table rather than jammed into columns like \`skill_1\`, \`skill_2\`, \`skill_3\`.

## When denormalization is the right call

Fully normalized schemas sometimes require several joins to answer a common query, which can matter for performance at scale. Deliberately denormalizing — storing a computed or duplicated value to avoid an expensive join — is a legitimate, deliberate trade-off, but it should be a conscious decision made for a measured reason, not an accident of not normalizing properly in the first place.`,
            },
          ],
          practice: [
            { id: 'be-foundation-database-p1', title: 'Design the Internship Portal database: entity relationships and SQL queries', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-foundation-prisma',
          title: 'Day 4 · Prisma ORM',
          description: 'Prisma schema, models, relations, and database migrations.',
          estimatedMinutes: 70,
          order: 4,
          lessons: [
            {
              id: 'be-foundation-prisma-l1',
              title: 'Prisma schema & models',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 1,
              content: `Prisma is an ORM (Object-Relational Mapper) that lets you define your database schema in a single, readable file and get a fully type-safe client generated from it.

\`\`\`prisma
model Opportunity {
  id          String        @id @default(uuid())
  title       String
  forte       String
  createdAt   DateTime      @default(now())
  applications Application[]
}

model Application {
  id            String      @id @default(uuid())
  status        String      @default("pending")
  opportunityId String
  opportunity   Opportunity @relation(fields: [opportunityId], references: [id])
}
\`\`\`

## What this schema file gives you

Writing the schema once generates a fully-typed client — in an editor with TypeScript support, \`prisma.opportunity.findMany()\` autocompletes real fields and catches typos or type mismatches before the code ever runs. That's a meaningful upgrade over hand-writing SQL strings, where a typo in a column name only surfaces as a runtime error.

## Why an ORM at all, instead of raw SQL

An ORM trades a small amount of query flexibility for a large amount of safety and productivity: no manually mapping database rows to objects, no string-concatenated queries vulnerable to injection, and refactoring a field name is a single change instead of a search across every raw SQL string in the codebase. For genuinely complex queries, Prisma still allows dropping down to raw SQL when it's the right tool — the ORM doesn't have to cover everything to be worth using for everything else.`,
            },
            {
              id: 'be-foundation-prisma-l2',
              title: 'Relations & CRUD operations',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 2,
              content: `Prisma's query API expresses relationships and CRUD operations declaratively, without hand-written joins.

\`\`\`js
// Create, with a nested write
const application = await prisma.application.create({
  data: {
    status: 'pending',
    opportunity: { connect: { id: opportunityId } },
  },
});

// Read, with a related record included
const opportunity = await prisma.opportunity.findUnique({
  where: { id: opportunityId },
  include: { applications: true },
});

// Update
await prisma.application.update({
  where: { id: applicationId },
  data: { status: 'accepted' },
});

// Delete
await prisma.application.delete({ where: { id: applicationId } });
\`\`\`

## What \`include\` is actually doing

Without \`include\`, fetching an opportunity returns only its own columns — the related applications aren't loaded unless you explicitly ask for them. This matters for performance: loading relations you don't need wastes a query; forgetting to load relations you *do* need produces a confusing \`undefined\` where a frontend expected an array.

## A common mistake worth naming directly

Running a query inside a loop (fetching each opportunity's applications one at a time in a \`for\` loop) produces what's called an *N+1 query problem* — one query becomes dozens or hundreds under real load. Using \`include\` to fetch related data in a single query, or batching lookups, avoids this entirely and is one of the highest-value habits to build early.`,
            },
            {
              id: 'be-foundation-prisma-l3',
              title: 'Database migrations & seeding',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 3,
              content: `A migration is a versioned, recorded change to the database schema — the mechanism that lets a schema evolve safely over time across every environment that runs the application.

\`\`\`
npx prisma migrate dev --name add-application-status
\`\`\`

This command compares your Prisma schema against the current database, generates a SQL migration file capturing the difference, and applies it. That migration file gets committed to the repo, so running it in staging or production reproduces the exact same schema change.

## Why not just edit the database directly

Manually altering a production database table (adding a column through a database GUI, say) leaves no record of what changed, when, or why — and it won't automatically apply to any other environment. Migrations make schema changes reviewable in a pull request, repeatable across environments, and reversible if something goes wrong.

## Seeding

A seed script populates a fresh database with baseline or sample data — reference data the app needs to function (default roles, for instance) or realistic sample data for local development. This is what lets a new engineer clone the repo, run the migrations, run the seed script, and have a working, populated local environment in minutes instead of manually creating test data by hand every time.`,
            },
          ],
          practice: [
            { id: 'be-foundation-prisma-p1', title: 'Create Prisma models, generate the client, and seed the database', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'be-foundation-checkpoint', title: '[Mentor Checkpoint] Backend Fundamentals Review (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'be-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-10 · Authentication, authorization, business logic, file management, integrations, and optimization.',
      order: 2,
      modules: [
        {
          id: 'be-development-auth',
          title: 'Day 5 · Authentication System',
          description: 'JWT, password hashing, and protected routes.',
          estimatedMinutes: 50,
          order: 1,
          lessons: [
            {
              id: 'be-development-auth-l1',
              title: 'JWT fundamentals',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A JWT is a signed token the server issues after a successful login, which the client then presents on subsequent requests to prove who it is — without the server needing to look up a session on every single request.

## Why this scales well

A traditional session-based approach stores session state in a database or memory store the server has to check on every request. A JWT is *self-verifying*: the server checks the signature using a secret key it holds, and if the signature is valid, the claims inside (user ID, role, expiry) can be trusted without a database lookup at all. That's a meaningful performance win at scale, at the cost of not being able to instantly revoke a single token before it naturally expires.

## What belongs in the payload

Only what's needed to identify and authorize the user — a user ID, a role, an expiry timestamp. Never a password, and generally not large amounts of personal data, since the payload is base64-encoded and readable by anyone who has the token, not encrypted.

## Access tokens and refresh tokens

Because a JWT can't be individually revoked, access tokens are usually short-lived (minutes to a couple of hours). A separate, longer-lived refresh token — stored more carefully, often in an httpOnly cookie — is used to silently obtain a new access token when the old one expires, without forcing the user to log in again constantly.`,
            },
            {
              id: 'be-development-auth-l2',
              title: 'Password hashing',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `A password should never be stored in plain text, and it should never be stored using a fast, general-purpose hash like SHA-256 either — those are built for speed, which is exactly the wrong property for password storage.

\`\`\`js
import bcrypt from 'bcrypt';

// on signup
const passwordHash = await bcrypt.hash(plainPassword, 12);
await db.user.create({ data: { email, passwordHash } });

// on login
const user = await db.user.findUnique({ where: { email } });
const valid = user && await bcrypt.compare(plainPassword, user.passwordHash);
if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
\`\`\`

## Why bcrypt specifically

bcrypt (and similar algorithms like Argon2) are deliberately slow and tunable via a "cost factor" (the \`12\` above). That slowness is the entire point: it makes brute-forcing a stolen password hash database computationally expensive, even though it adds a small, imperceptible delay to a legitimate login. A fast hash makes brute-forcing millions of guesses per second trivial on modern hardware; a deliberately slow one makes it impractical.

## What never to do

Never write your own hashing scheme, never use a fast general-purpose hash for passwords, and never log a plaintext password anywhere — including in error messages or debug output. These aren't edge-case concerns; they're some of the most common real vulnerabilities found in production backend code.`,
            },
            {
              id: 'be-development-auth-l3',
              title: 'Login flow & protected routes',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 3,
              content: `Putting authentication and hashing together, a login endpoint verifies credentials and issues a token; a protected route verifies that token before doing anything else.

\`\`\`js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.user.findUnique({ where: { email } });
  const valid = user && await bcrypt.compare(password, user.passwordHash);

  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

router.get('/profile', requireAuth, (req, res) => {
  res.json(req.user); // set by requireAuth middleware
});
\`\`\`

## A deliberately vague failure message

Notice the login endpoint returns the same "Invalid credentials" message whether the email doesn't exist or the password was wrong. Returning a different message for each ("no account with that email" vs "wrong password") lets an attacker enumerate which emails have accounts — a small detail that's easy to overlook and genuinely matters for security.

## Rate limiting matters here specifically

A login endpoint is a common target for brute-force attempts. Rate limiting login attempts (by IP, by account, or both) is one of the highest-value, lowest-effort security measures a backend can add, and it's worth building in from the start rather than adding after an incident.`,
            },
          ],
          practice: [
            { id: 'be-development-auth-p1', title: 'Implement a JWT-based login flow with protected routes', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-development-authorization',
          title: 'Day 6 · Authorization',
          description: 'Role-based access control, permissions, and user roles.',
          estimatedMinutes: 45,
          order: 2,
          lessons: [
            {
              id: 'be-development-authorization-l1',
              title: 'Role-based access control (RBAC)',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `RBAC assigns each user one or more roles, and grants or restricts actions based on those roles rather than checking permissions for each user individually.

## Why roles instead of per-user permissions

Assigning permissions to individuals directly doesn't scale — a thousand users would mean a thousand separate permission sets to maintain. Roles group common permission sets into a small number of named buckets (\`admin\`, \`mentor\`, \`intern\`) that are easy to reason about, easy to audit, and easy to change in one place when the rules change.

## A typical shape

- \`admin\` — full access to manage users, opportunities, and system configuration
- \`mentor\` — access to review assigned interns' work and provide feedback
- \`intern\` — access to their own application, training progress, and submissions

## Where the check actually has to happen

RBAC checks belong on the server, in middleware or at the top of a route handler — never only on the frontend. Hiding an "admin" button from a non-admin user is good UX, but it does nothing to stop that user from calling the underlying API endpoint directly if the server doesn't independently verify their role on every request.

## The limits of pure RBAC

Roles work well for broad categories of access, but they don't naturally express "this mentor can review *their assigned interns*, not all interns." That finer-grained case needs resource-based checks layered on top — RBAC narrows down to a category, and a resource-based check confirms the specific relationship to that specific resource.`,
            },
            {
              id: 'be-development-authorization-l2',
              title: 'Permission management & user roles',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Beyond assigning roles, a real system needs a clear model for what each role can actually do — and a way to change that without redeploying code every time a permission needs adjusting.

## Two common approaches

- **Hardcoded role checks** in code (\`if (user.role === 'admin')\`) — simple to reason about, but every permission change requires a code change and a deploy
- **A permissions table** — roles map to a set of granular permission strings (\`applications:read\`, \`applications:write\`) stored in the database, checked dynamically. More flexible, more complex to build and reason about

For most applications at Lumora's scale, hardcoded role checks are the right starting point — the added flexibility of a full permissions system usually isn't worth its complexity until an application has genuinely complex, frequently-changing authorization rules.

## Assigning and changing roles safely

Role assignment is itself a sensitive action — only an admin should be able to grant admin access to someone else, and every role change is worth logging (who changed what, when) so it's auditable after the fact. A backend that lets any authenticated user set their own role via a public API endpoint is a real, commonly-seen vulnerability, not a hypothetical one.

## Testing authorization deliberately

Because authorization bugs tend to fail *open* (accidentally granting access rather than denying it) rather than loudly breaking, they're easy to miss without explicit tests. Writing a test that confirms a non-admin genuinely gets rejected by an admin-only endpoint is worth the same care as testing that the happy path works.`,
            },
            {
              id: 'be-development-authorization-l3',
              title: 'Access control middleware',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 3,
              content: `Access control middleware turns the authorization rule into something declared right on the route, instead of scattered checks buried inside handler logic.

\`\`\`js
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

router.delete('/opportunities/:id', requireAuth, requireRole('admin'), deleteOpportunity);
\`\`\`

## Why 401 and 403 are different, and both matter

401 means "we don't know who you are" — no valid authentication was presented. 403 means "we know who you are, and you're not allowed to do this." Collapsing both into the same response makes debugging harder for legitimate users and hides useful information a frontend could otherwise use — for instance, redirecting to login on a 401 but showing an "access denied" message on a 403.

## Layering middleware

\`requireAuth\` and \`requireRole\` compose because each is a small, focused function — \`requireAuth\` establishes *who* the user is, \`requireRole\` checks *what they're allowed to do* given that identity. Keeping these as separate, composable pieces rather than one large combined check makes each route's requirements readable directly from its middleware chain, without needing to open the handler to understand what's protected and how.`,
            },
          ],
          practice: [
            { id: 'be-development-authorization-p1', title: 'Add role-based access control to your API', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-development-business-logic',
          title: 'Day 7 · Business Logic',
          description: 'Service layer, repository pattern, and modular architecture.',
          estimatedMinutes: 45,
          order: 3,
          lessons: [
            {
              id: 'be-development-business-logic-l1',
              title: 'Service layer & repository pattern',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `As an API grows past a handful of endpoints, putting all logic directly in route handlers becomes hard to test and hard to reuse. The service layer and repository pattern split that logic into distinct, focused responsibilities.

## The layers

- **Controller** — parses the HTTP request, calls a service, formats the HTTP response. Knows about HTTP; knows nothing about business rules
- **Service** — contains the actual business logic ("an application can't be withdrawn after it's been accepted"). Knows nothing about HTTP or how data is stored
- **Repository** — handles data access (the actual database queries). Knows nothing about business rules, only how to fetch and persist data

## Why split it this way

A service function like \`submitApplication(userId, opportunityId)\` can be tested directly, without spinning up an HTTP server or mocking a request object — you call the function, check the result. It can also be reused: the same service function might be called from an API route, a scheduled background job, and an admin script, without duplicating the business logic in all three places.

## Where the boundary should sit

The repository is the *only* place raw database queries live. If business logic starts leaking into a repository function (a conditional based on business rules, not just data access), that's a signal it belongs one layer up, in the service. Keeping this boundary honest is what makes each layer independently testable and independently replaceable.`,
            },
            {
              id: 'be-development-business-logic-l2',
              title: 'Modular architecture',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Modular architecture organizes a backend around features or domains — applications, opportunities, users — rather than around technical layers spread across the whole codebase.

## What a module typically contains

Everything related to one domain lives together: its routes, its controller, its service, its repository, and its types. Adding a new feature to the "applications" domain means working almost entirely within the \`applications/\` module, rather than making small edits scattered across a global \`routes/\`, a global \`controllers/\`, and a global \`services/\` folder.

## Why this matters as a team grows

Two engineers working on unrelated features in a modular codebase rarely touch the same files, which means fewer merge conflicts and less risk of one change accidentally affecting an unrelated area. It also makes onboarding faster — understanding "everything about applications" means opening one folder, not tracing logic across five.

## Shared code still needs a home

Not everything belongs inside a single module — authentication middleware, a shared database client, common utility functions are used across every domain. These live in a clearly-separated shared or core area, so it's obvious at a glance what's domain-specific versus genuinely shared infrastructure.

## A boundary worth enforcing

A well-modularized backend keeps modules from directly reaching into each other's internals — if the applications module needs something from the opportunities module, it goes through that module's public service functions, not by importing its repository directly. That boundary is what keeps modules genuinely independent rather than secretly, invisibly coupled.`,
            },
            {
              id: 'be-development-business-logic-l3',
              title: 'Clean code practices',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `Clean code isn't about following a rigid style guide — it's about writing code that the next person (often you, in six months) can understand quickly and change safely.

## A few practices that consistently pay off

- **Name things for what they mean, not how they're implemented** — \`getActiveApplications\` is clearer than \`getApps2\`, and it stays clear even after the implementation changes
- **Keep functions focused on one responsibility** — a function that validates input, queries the database, sends an email, and formats a response is doing four jobs; splitting it makes each piece independently testable
- **Avoid deep nesting** — several layers of nested \`if\` statements are hard to follow; early returns (\`if (!valid) return\`) usually flatten the same logic into something far more readable
- **Handle errors explicitly, not silently** — a caught exception that does nothing (an empty \`catch\` block) hides real problems that will resurface later, in a much harder place to debug

## Comments are for *why*, not *what*

Well-named code already explains what it does. A comment earns its place when it explains something the code can't — a non-obvious business rule, a workaround for a specific bug, a constraint that isn't visible from the code alone.

## The real test of clean code

If a teammate can read a function once and correctly predict what it does before running it, it's clean. If they need to trace through several other files or ask you what it's actually doing, there's usually a simpler, more explicit way to write it.`,
            },
          ],
          practice: [
            { id: 'be-development-business-logic-p1', title: 'Refactor an endpoint into a service + repository layer', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-development-files',
          title: 'Day 8 · File Management',
          description: 'Resume upload, cloud storage, and file validation.',
          estimatedMinutes: 45,
          order: 4,
          lessons: [
            {
              id: 'be-development-files-l1',
              title: 'Resume & image upload',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 1,
              content: `File uploads arrive as \`multipart/form-data\`, a different content type from the JSON most other endpoints handle — which means they need dedicated middleware to parse.

\`\`\`js
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post('/resume', requireAuth, upload.single('resume'), async (req, res) => {
  const file = req.file; // { buffer, mimetype, originalname, size }
  const url = await uploadToStorage(file);
  await db.user.update({ where: { id: req.user.id }, data: { resumeUrl: url } });
  res.json({ url });
});
\`\`\`

## What's actually happening

\`multer\` parses the multipart body and makes the uploaded file available as \`req.file\` (or \`req.files\` for multiple). Using memory storage here means the file lives briefly in memory before being forwarded to cloud storage — for very large files, streaming to disk or directly to cloud storage avoids holding everything in memory at once.

## Never trust the file the client says it is

The client-reported filename and MIME type are just strings the client sent — they can be spoofed. A file genuinely claiming to be a PDF should be verified server-side (checking the actual file signature, not just trusting the \`mimetype\` field) before being accepted, stored, or served back to other users. This matters more than it might seem: an uploaded file that gets served back to other users is a real vector for attacks if it isn't properly validated first.`,
            },
            {
              id: 'be-development-files-l2',
              title: 'Cloud storage integration',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Storing uploaded files directly on a server's local disk doesn't scale — if the app runs on multiple servers, or gets redeployed, local files disappear or become inconsistent across instances. Cloud storage (Supabase Storage, Amazon S3, and similar services) solves this by keeping files in durable, centralized storage the application talks to over an API.

## The typical flow

1. The backend receives the file from the client
2. It uploads the file to cloud storage, receiving back a URL or storage path
3. That URL/path is what gets saved in the database — the database never stores the file itself, only a reference to where it lives

## Public vs. private storage

Not everything uploaded should be publicly accessible by a guessable URL. A resume, for instance, should typically be stored privately, with access granted through short-lived signed URLs generated on demand — the backend verifies the requester is authorized, then issues a URL that works for a few minutes, rather than a permanent public link anyone could share or guess.

## Cleaning up after yourself

When a resource that owns a file gets deleted (a user deletes their account, an application gets withdrawn), the associated file should generally be deleted from storage too — otherwise storage usage grows indefinitely with orphaned files nothing references anymore, quietly costing money and cluttering the bucket for no benefit.`,
            },
            {
              id: 'be-development-files-l3',
              title: 'File validation',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 3,
              content: `File validation happens on both size and type, and should reject bad input as early as possible — before any storage upload is attempted.

\`\`\`js
const ALLOWED_TYPES = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE = 5 * 1024 * 1024;

function validateResumeFile(file) {
  if (file.size > MAX_SIZE) {
    throw new ValidationError('File exceeds 5MB limit');
  }
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new ValidationError('Only PDF and Word documents are accepted');
  }
}
\`\`\`

## Why this check has to happen server-side

A frontend can — and should — check file size and type before starting an upload, purely for a faster user experience. But that check can always be bypassed by calling the API directly, so the server has to independently re-validate everything, exactly as with any other form input.

## Beyond size and type

For genuinely sensitive uploads, deeper validation matters too: scanning for malware, verifying the file's actual content matches its claimed type (not just trusting the \`Content-Type\` header, which the client controls), and stripping potentially sensitive metadata from uploaded files (an image's embedded location data, for instance) before storing or serving them back.

A rejected upload should return a clear, specific error — "file exceeds 5MB" is actionable; a generic "upload failed" leaves the user guessing at what to fix.`,
            },
          ],
          practice: [
            { id: 'be-development-files-p1', title: 'Build a resume upload endpoint with cloud storage and validation', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'be-development-checkpoint', title: '[Mentor Checkpoint] API & Database Assessment (Day 8)', kind: 'coding', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
        {
          id: 'be-development-integrations',
          title: 'Day 9 · Third-Party Integrations',
          description: 'Email services, external APIs, and environment security.',
          estimatedMinutes: 45,
          order: 5,
          lessons: [
            {
              id: 'be-development-integrations-l1',
              title: 'Email & notification services',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Sending email reliably at scale is a genuinely hard problem — deliverability, spam filtering, bounce handling — which is why almost nobody builds this in-house. Instead, backends integrate with a transactional email provider (Resend, SendGrid, Postmark, and similar) that handles the hard parts.

## Where email fits in a backend

Email is triggered by backend events — a signup confirmation, a password reset, an application status change — never sent directly from the frontend. The frontend calls an API endpoint; the backend, holding the provider's API key securely, sends the actual email. This isn't just an architectural preference: a provider API key exposed to the frontend could be used by anyone to send email as your application, which is both a security and an abuse risk.

## Designing notification systems generally

Most real applications need more than just email — in-app notifications, sometimes SMS or push notifications. A well-designed notification system separates *what happened* (an event) from *how it's delivered* (email, in-app, push) so adding a new delivery channel later doesn't mean rewriting every place an event gets triggered.

## Reliability matters here

An email send can fail — the provider might be down, rate-limited, or reject a malformed address. Sending emails as background jobs rather than blocking the main request on them means a slow or failed email doesn't also break or delay the user-facing action that triggered it (like account creation succeeding, but the welcome email queued separately).`,
            },
            {
              id: 'be-development-integrations-l2',
              title: 'Integrating external APIs',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `Most backends eventually talk to at least one external API — a payment provider, an email service, a mapping service. Integrating well means planning for the ways that external dependency can fail, not just the happy path where it works.

\`\`\`js
async function sendNotificationEmail(to, subject, body) {
  try {
    const response = await fetch('https://api.emailprovider.com/send', {
      method: 'POST',
      headers: { Authorization: \`Bearer \${process.env.EMAIL_API_KEY}\` },
      body: JSON.stringify({ to, subject, body }),
    });
    if (!response.ok) throw new Error(\`Email API returned \${response.status}\`);
  } catch (err) {
    logger.error('Failed to send notification email', { to, error: err.message });
    // don't let an email failure break the calling request
  }
}
\`\`\`

## What to plan for with any external integration

- **Timeouts** — an external API that hangs shouldn't hang your own request indefinitely
- **Retries with backoff** — a transient failure (a brief network blip) is often worth retrying once or twice before giving up, rather than failing immediately
- **Graceful degradation** — if sending a notification email fails, should the core action (submitting an application) still succeed? Usually yes — the external dependency shouldn't become a single point of failure for something otherwise unrelated to it

## API keys always come from environment variables

Never hardcode a third-party API key in source code, even temporarily "just to test." It's easy to forget to remove before committing, and a key that reaches version control history is compromised even if it's later deleted from the current file.`,
            },
            {
              id: 'be-development-integrations-l3',
              title: 'Environment & secrets security',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `Every backend accumulates secrets — database credentials, third-party API keys, signing keys for JWTs — and how they're managed is one of the highest-consequence security decisions a backend team makes.

## The baseline rules

- Secrets live in environment variables, loaded at runtime, never hardcoded in source
- \`.env\` files are always gitignored — a \`.env.example\` with placeholder values documents what's needed without exposing real values
- Different environments (local, staging, production) use different secrets — a production database credential should never exist on a developer's laptop

## Least privilege

A service should hold only the credentials it actually needs, scoped as narrowly as possible. A backend service that only reads from one table doesn't need credentials with full database admin rights — narrower scope means a compromised credential does less damage.

## What happens if a secret leaks anyway

Despite precautions, secrets do occasionally leak — a misconfigured log that prints an API key, an accidental commit. The response is always the same: rotate the secret immediately (generate a new one, invalidate the old one), don't just remove it from the current code and consider it handled, since it may already exist in git history or logs elsewhere.

## Secrets in logs

It's easy to accidentally log an entire request object, headers included, which can capture an Authorization token or API key in plaintext log output. Being deliberate about what gets logged — and scrubbing sensitive fields before logging — is a habit worth building from the start, not retrofitting after an incident.`,
            },
          ],
          practice: [
            { id: 'be-development-integrations-p1', title: 'Integrate an email notification service', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-development-optimization',
          title: 'Day 10 · Backend Optimization',
          description: 'Error handling, logging, and API performance.',
          estimatedMinutes: 45,
          order: 6,
          lessons: [
            {
              id: 'be-development-optimization-l1',
              title: 'Error handling & logging',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A backend that handles errors well fails predictably and informatively. One that doesn't fails in ways that are confusing for users and nearly impossible to debug after the fact.

## Centralized error handling

Rather than a try/catch scattered inside every single route handler, most Express apps use centralized error-handling middleware: route handlers throw or pass errors along, and one place decides how to log them and what to send back to the client. This keeps error formatting consistent across the entire API and means a new error type only needs handling logic added in one place.

## What a good error response contains

- A clear, specific message the client can act on (or display, if user-facing)
- The correct HTTP status code — not everything is a 500
- **Never** a raw stack trace or internal error details in a production response — that's information a malicious actor could use, and it belongs in server-side logs, not in what gets sent back to a client

## Logging is what makes debugging possible after the fact

A production issue that only happened once, three hours ago, can't be reproduced by staring at the code — it can only be understood through logs. Logging enough context (what request, what user, what went wrong) at the moment of failure is what turns "something broke" into "I know exactly what broke and why." Structured logging (consistent, parseable fields rather than free-form text) makes this searchable at scale instead of requiring someone to read through raw text line by line.`,
            },
            {
              id: 'be-development-optimization-l2',
              title: 'Performance & query optimization',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `The database is the most common source of backend performance problems — far more often than the application code itself.

\`\`\`js
// Slow: N+1 queries — one per opportunity
const opportunities = await prisma.opportunity.findMany();
for (const opp of opportunities) {
  opp.applicationCount = await prisma.application.count({ where: { opportunityId: opp.id } });
}

// Fast: one query, using an aggregate
const opportunities = await prisma.opportunity.findMany({
  include: { _count: { select: { applications: true } } },
});
\`\`\`

## Where to actually look first

- **N+1 queries** — a loop that fires one database query per iteration is the single most common backend performance bug, and usually the easiest to fix once spotted
- **Missing indexes** — a query filtering or sorting on a column with no index forces a full table scan; adding the right index can turn a multi-second query into a sub-millisecond one
- **Over-fetching** — selecting every column when only three are actually used wastes bandwidth and memory for no benefit

## Measure before optimizing

Guessing at what's slow and optimizing it anyway is a common waste of effort — the code someone assumes is slow is often not where the actual bottleneck lives. A query logger, or your ORM's built-in query analysis tools, will show you the actual slow queries running against real data, which is the only reliable way to know where optimization effort is worth spending.`,
            },
            {
              id: 'be-development-optimization-l3',
              title: 'API optimization',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `Beyond individual query performance, a handful of API-level patterns meaningfully affect how a backend feels to use — especially as data volume grows.

## Pagination

An endpoint that returns "all applications" works fine with ten rows and becomes a serious problem at ten thousand — slow to generate, slow to transfer, slow for the client to render. Pagination (returning a fixed page size with a cursor or offset to fetch the next page) should be the default for any endpoint that could realistically return a large or unbounded number of results, not an afterthought added once it becomes a problem.

## Caching

Some data doesn't change often but gets requested constantly — a list of active opportunities, for instance. Caching that response (in memory, or in a dedicated cache layer like Redis) for a short period can dramatically cut database load, as long as the cache is invalidated correctly whenever the underlying data actually changes — a stale cache serving outdated data is a worse bug than no cache at all.

## Compression and payload size

Enabling gzip/brotli compression on API responses is close to a free performance win — most frameworks support it as a single middleware line, and it noticeably reduces response size for JSON-heavy APIs with negligible added CPU cost.

## Rate limiting, for a different reason than security

Beyond stopping abuse, rate limiting protects the backend's own stability — without it, a single misbehaving client (a buggy frontend retry loop, an aggressive scraper) can degrade the API for every other user.`,
            },
          ],
          practice: [
            { id: 'be-development-optimization-p1', title: 'Profile and optimize a slow API endpoint', kind: 'debugging', order: 1 },
          ],
        },
      ],
    },
    {
      id: 'be-project',
      key: 'project',
      title: 'Project',
      description: "Days 11-13 · Industry simulation -- sprint planning, ticket-based feature development, and code review exactly as a real engineering team works.",
      order: 3,
      modules: [
        {
          id: 'be-project-simulation',
          title: 'Industry Simulation Sprint',
          description: 'Work an assigned ticket end-to-end: plan, build, document, and open a pull request.',
          estimatedMinutes: 40,
          order: 1,
          lessons: [
            {
              id: 'be-project-simulation-l1',
              title: 'Sprint planning & ticket assignment',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `A sprint gives a backend team the same structure it gives any engineering team: a fixed time box, a committed set of tickets, and a review of what actually shipped at the end.

## What a well-written backend ticket includes

- A clear description of the endpoint or behavior needed, including expected request and response shapes
- Any relevant schema changes — new tables, new columns, new relationships — called out explicitly, since these often need the most careful review
- Acceptance criteria specific enough that a reviewer can verify them: what status codes are expected for which inputs, what validation applies, what happens on failure

## Estimating backend work honestly

Backend tickets often carry hidden complexity that isn't visible from the ticket title — a schema migration might need careful handling if the table already has production data, or an integration might reveal an undocumented quirk in a third-party API only once you're actually building against it. Flagging this kind of surprise early, rather than staying quiet and hoping it resolves itself, is what keeps a sprint's plan realistic.

## Picking up your ticket

Read the acceptance criteria fully before writing code, and if the expected behavior for an edge case isn't specified, that's worth clarifying (or making an explicit, documented assumption about) before you build around a guess.`,
            },
            {
              id: 'be-project-simulation-l2',
              title: 'Feature development & database updates',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 2,
              content: `Backend feature work almost always touches more than application code — a new feature often needs a schema change, and that change needs to be handled carefully once real data is involved.

## The typical shape of the work

1. Update the Prisma schema (or equivalent) and generate a migration
2. Update the repository layer to support new queries the feature needs
3. Add or update service logic implementing the actual business rules
4. Expose it through a route, with request validation and proper error handling
5. Test against the acceptance criteria — including the edge cases, not just the happy path

## Database changes deserve extra care

Unlike most application code changes, a schema migration can be difficult or impossible to cleanly reverse once it's run against a database with real data in it. Before merging a migration, it's worth asking: does this need a default value for existing rows? Does this break any existing query elsewhere in the codebase that relies on the old shape? A migration that works fine against an empty local database can still break in an environment with real, non-trivial data.

## Testing your own change first

Before opening a PR, actually exercise the endpoint — with valid input, with invalid input, with edge cases like an empty list or a missing optional field. Catching an obvious bug yourself, before a reviewer does, is faster for everyone and keeps review focused on things that actually need a second opinion.`,
            },
            {
              id: 'be-project-simulation-l3',
              title: 'Pull requests, code review & API documentation',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `A backend pull request has one extra responsibility a frontend PR often doesn't: it's frequently the *contract* another team (frontend, mobile, another backend service) will build against — which makes clear documentation part of the actual deliverable, not an optional extra.

## What a strong backend PR description includes

- What endpoints changed or were added, with their request/response shapes
- Any schema changes, called out explicitly and explained
- How to test the change locally (example requests, or a note that existing tests cover it)

## Documenting the API itself

Beyond the PR description, the API's own documentation (whether that's OpenAPI/Swagger, a shared Postman collection, or a markdown reference) needs to stay in sync with what the API actually does. Undocumented or incorrectly documented endpoints are a routine source of wasted time for whoever consumes the API next — they either guess, or they have to read your source code to figure out what you already know.

## What a backend reviewer is specifically looking for

Beyond general code quality: is input properly validated, are errors handled and returned with the right status codes, is the authorization check actually correct (and actually tested, not just assumed), and does a new query risk an N+1 pattern or a missing index. These are backend-specific failure modes that are worth a reviewer's particular attention, distinct from general code style.`,
            },
            {
              id: 'be-project-simulation-l4',
              title: 'Merge conflict resolution',
              contentType: 'code',
              estimatedMinutes: 10,
              order: 4,
              content: `Merge conflicts on backend code follow the same mechanics as anywhere else in Git, with one extra wrinkle worth knowing: schema and migration files conflict differently than application code does.

\`\`\`
<<<<<<< HEAD
status String @default("pending")
=======
status ApplicationStatus @default(PENDING)
>>>>>>> feature/typed-status
\`\`\`

Resolve the same way as any conflict: understand what each side intended, keep the correct combination, and remove the conflict markers. Here, that likely means adopting the enum-typed version if it represents an intentional improvement, then regenerating the migration to match.

## Why migration conflicts need extra care

If two branches both add migrations, Git might resolve the *code* conflict cleanly while leaving two migration files that, applied together, don't produce a coherent schema. After resolving any conflict touching schema or migration files, it's worth regenerating and re-checking migrations locally against a fresh database rather than trusting that a clean Git merge means the schema is actually correct.

## The habit that prevents most of this

The same advice as everywhere else applies with extra weight here: merge main into your branch frequently, especially when you know your ticket touches the schema, since schema conflicts compound in complexity the longer two branches diverge — far more than typical application-code conflicts do.`,
            },
          ],
          practice: [
            { id: 'be-project-simulation-p1', title: 'Resolve your assigned sprint ticket end-to-end', kind: 'coding', order: 1 },
            { id: 'be-project-simulation-p2', title: 'Fix a reported bug and verify it with QA testing', kind: 'debugging', order: 2 },
          ],
          submission: { id: 'be-project-simulation-s1', title: 'Submit your sprint feature pull request', instructions: 'Link the pull request for the ticket you were assigned during the sprint, including updated API documentation.', requiresLink: true },
          assessment: { id: 'be-project-simulation-checkpoint', title: '[Mentor Checkpoint] Sprint Review (Day 12)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'be-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Mentor evaluation of your production-readiness before the capstone and client project allocation.',
      order: 4,
      modules: [
        {
          id: 'be-readiness-eval',
          title: 'Production Readiness Assessment (Day 15)',
          description: 'Your mentor reviews backend service quality, security practices, and collaboration before you begin the capstone.',
          order: 1,
          lessons: [
            {
              id: 'be-readiness-eval-l1',
              title: 'What to expect from your production readiness review',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `This checkpoint is about calibration, not a pass/fail gate — its purpose is making sure you head into the capstone with a clear, honest sense of your current strengths and what still needs deliberate attention.

## What your mentor is specifically looking at

- **Security fundamentals**: are passwords hashed correctly, is authentication and authorization actually enforced server-side, are secrets handled properly
- **Data integrity**: is the schema well-designed, are migrations handled safely, is validation happening on every input that needs it
- **Code quality and structure**: is business logic properly separated from routing and data access, is the code you've written something another engineer could maintain
- **Collaboration**: how you handled sprint work, how you gave and received code review feedback, whether blockers were communicated early

## How to prepare

There's no separate assignment for this specifically — it's a review of everything built across Days 1-14. The most useful preparation is genuine self-reflection: which security or data-integrity concept from this program still feels shaky, and what's the plan to shore it up before the capstone actually needs it.

## What comes next

This feedback exists to shape how you approach the capstone — come ready to actually absorb it, not to defend every choice you've made so far.`,
            },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'be-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Capstone backend system, technical presentation, interview preparation, and certification.',
      order: 5,
      modules: [
        {
          id: 'be-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Build and ship a production-ready backend system, then present it for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            {
              id: 'be-graduation-capstone-l1',
              title: 'Capstone briefing & project options',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `The capstone is a complete backend system you design, build, secure, and document — not a single feature added to something that already exists, but the whole thing built by you end to end.

## What "production-ready" means for a backend specifically

Beyond the endpoints working: proper authentication and authorization enforced consistently, input validated everywhere it needs to be, errors handled and logged sensibly, a schema that's genuinely well-designed rather than assembled ad hoc, and documentation good enough that someone else could actually integrate against your API without asking you questions.

## Project options

- **Internship Portal Backend** — applications, opportunities, authentication, role-based access for applicants, mentors, and admins
- **Learning Management Backend** — courses, progress tracking, submissions, and grading
- **Authentication Service** — a standalone, reusable auth system: signup, login, JWTs, refresh tokens, RBAC
- **Notification Service** — a system that accepts events and delivers them through multiple channels (email, in-app) reliably
- **Analytics API** — ingesting events and serving aggregated, queryable results efficiently

Pick something scoped enough to build to a genuinely high standard in the time available. A smaller, well-executed system with real security and data-integrity discipline demonstrates far more than an ambitious one left half-finished.

## What you'll actually be evaluated on

Architecture, security, and data design — the same things a real backend code review would focus on, not just whether the happy-path demo works.`,
            },
            {
              id: 'be-graduation-capstone-l2',
              title: 'Interview & portfolio preparation',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Your capstone backend is also your strongest interview talking point — a system you designed and can speak to in depth, including the trade-offs you made along the way.

## Presenting backend work well

- Lead with the problem the system solves and the core design decisions, not a line-by-line tour of every endpoint
- Be ready to explain *why* you structured the schema the way you did, and what you'd reconsider with more time or different constraints
- Have a specific example ready of a bug you hit and how you diagnosed it — this shows real engineering process far better than a description of a project that "just worked"

## Common backend interview topics worth reviewing

- Node.js fundamentals: the event loop, async/await, common performance pitfalls
- SQL and database design: normalization, indexing, when to denormalize deliberately
- REST API design: resource modeling, status codes, versioning approaches
- Authentication and authorization: JWTs, session management, RBAC
- System design fundamentals: how a given design would need to change under significantly higher load

## System design discussions

These are less about a single "correct" answer and more about how you reason under ambiguity: asking clarifying questions about scale and constraints, identifying likely bottlenecks, and explaining trade-offs clearly. Thinking out loud, even when unsure, generally reads far better to an interviewer than working through the problem in silence.`,
            },
          ],
          practice: [],
          submission: { id: 'be-graduation-capstone-s1', title: 'Submit your capstone backend project for certification review', instructions: 'Include your deployed API link, repository link, and API documentation. Your mentor reviews architecture, security, and database design before certification.', requiresLink: true },
          assessment: { id: 'be-graduation-final', title: '[Mentor Checkpoint] Final Technical Evaluation (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
