import type { TrainingTrackConfig } from './types';

// Mobile Development Training Handbook v1.0 -- Lumora's 18-day, mentor-led
// + project-based + product development simulation program (Flutter).
// Days map onto modules (Days 1-4 -> Foundation, 5-10 -> Development,
// 11-13 -> Project sprint simulation, 15 -> Readiness, 16-18 -> Graduation
// capstone), same mapping as frontend.ts/backend.ts/ai.ts. The five mentor
// checkpoints (handbook section 12) are wired in as module assessments
// except the Day 15 readiness review, which stays a bare module: that
// evaluation runs through the app's separate real ReadinessEvaluation
// admin flow, not a self-service assessment here. Every lesson's `content`
// is real written material derived from the handbook's own topic list --
// see LessonConfig in ./types.ts for the markdown-lite subset it's written in.
export const mobileTrack: TrainingTrackConfig = {
  forte: 'Mobile Development',
  trackName: 'Mobile Development',
  description: 'An 18-day, mentor-led, project-based Flutter mobile engineering program: responsive UI, state management, Firebase integration, and a capstone app -- per the Lumora Mobile Development Training Handbook v1.0.',
  stages: [
    {
      id: 'mob-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Flutter project setup, UI development, Dart programming, and state management.',
      order: 1,
      modules: [
        {
          id: 'mob-foundation-setup',
          title: 'Day 1 · Flutter Project Setup',
          description: 'Configure your Flutter project, learn the team Git workflow, and ship your first application.',
          estimatedMinutes: 65,
          order: 1,
          lessons: [
            {
              id: 'mob-foundation-setup-l1',
              title: 'Flutter architecture & project structure',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Flutter is Google's cross-platform UI toolkit — one Dart codebase compiles to native Android, iOS, web, and desktop apps, which is exactly what makes "build once, deploy everywhere" a realistic goal instead of just a slogan.

## How Flutter actually renders

Unlike frameworks that wrap native platform widgets, Flutter draws every pixel itself using its own rendering engine (Skia). This is why a Flutter app looks and behaves *identically* across platforms — it isn't relying on each platform's native components underneath, it's rendering its own. The trade-off is that Flutter apps need to deliberately implement platform-appropriate look and feel (Material Design conventions on Android, Cupertino conventions on iOS) rather than getting it for free.

## A typical project structure

- **lib/main.dart** — the application entry point
- **lib/screens/** or **lib/features/** — organized by feature, similar to how a React or Express app benefits from feature-based organization
- **lib/widgets/** — shared, reusable widgets used across multiple screens
- **lib/models/** — data classes representing the app's core entities
- **lib/services/** — API clients, local storage, and other external integrations

## Everything in Flutter is a widget

Text, padding, a button, a whole screen — all widgets, composed together into a tree. Understanding this early makes everything that follows easier: Flutter development is fundamentally about building and composing a widget tree, not about a separate templating or styling layer bolted onto application logic.`,
            },
            {
              id: 'mob-foundation-setup-l2',
              title: 'Development environment & emulator configuration',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `A working Flutter development environment needs a few pieces in place before you can build and preview an app.

## What you need installed

- The **Flutter SDK** itself, plus the Dart SDK it bundles
- **Android Studio** (for the Android SDK and emulator) and, on macOS, **Xcode** (for the iOS Simulator) — you don't need both if you're only targeting one platform initially, but most teams eventually need both
- An editor with Flutter/Dart support — VS Code or Android Studio, both with official Flutter extensions providing hot reload, widget inspection, and debugging tools

## Emulators vs. real devices

An emulator (Android) or simulator (iOS) is good enough for most day-to-day UI development — fast to iterate against, no physical device needed. But some things genuinely only show up on real hardware: actual performance under real constraints, camera and sensor behavior, and platform-specific quirks that emulators don't always faithfully reproduce. Testing on a real device before shipping matters, not just during initial development.

## Hot reload, and why it matters so much

Flutter's hot reload injects updated code into a running app in under a second, preserving app state — you can change a widget's styling and see the result almost instantly, without losing your place in the app or restarting from scratch. This is one of Flutter's biggest productivity advantages over many native development workflows, and it's worth confirming it's actually working correctly in your setup before building anything substantial.`,
            },
            {
              id: 'mob-foundation-setup-l3',
              title: 'Git workflow',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `The same Git discipline that applies to any engineering team applies here: a protected main branch, feature branches per change, small reviewable commits, and a pull request before merging.

## What's specific to a Flutter repo

- **Generated files are gitignored** — the \`build/\` directory and platform-specific generated files (like \`ios/Pods/\`) are regenerated from source and shouldn't be committed
- **The pubspec.lock file is committed** — it pins exact dependency versions, so every team member and every CI run builds against identical package versions, avoiding "works on my machine" bugs caused by dependency drift
- **Platform-specific configuration** (Android's \`build.gradle\`, iOS's \`Info.plist\`) is real, meaningful code — changes here deserve the same review attention as changes to Dart source

## A branch naming convention worth adopting

Something like \`feature/applicant-dashboard\` or \`fix/login-crash-on-android\` — descriptive enough that a teammate glancing at the branch list understands what it's for without opening it.

## Commit discipline

Small, focused commits with messages that explain *why* a change was made, not just *what* changed. A commit like "fix crash" tells a reviewer nothing useful six months from now; "fix null pointer crash when resuming app without cached user session" tells the whole story on its own, without needing to dig through the diff to understand it.`,
            },
          ],
          practice: [
            { id: 'mob-foundation-setup-p1', title: 'Create a Flutter project, configure your environment, and ship your first application', kind: 'interactive', order: 1 },
          ],
        },
        {
          id: 'mob-foundation-ui',
          title: 'Day 2 · UI Development',
          description: 'Widget tree, layout widgets, responsive design, and navigation.',
          estimatedMinutes: 60,
          order: 2,
          lessons: [
            {
              id: 'mob-foundation-ui-l1',
              title: 'Widget tree & layout widgets',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Every Flutter UI is a tree of widgets nested inside each other — understanding how that tree is built and laid out is the foundation everything else in Flutter UI work builds on.

## Two broad categories of widgets

- **StatelessWidget** — renders based purely on the properties passed into it; it never changes on its own. A label, an icon, a static card
- **StatefulWidget** — holds mutable state internally and can rebuild itself when that state changes. A checkbox, a text field, anything the user interacts with that changes over time

## The core layout widgets

- \`Column\` and \`Row\` arrange children vertically or horizontally — the Flutter equivalent of flexbox's main axis
- \`Container\` provides padding, margin, sizing, and decoration around a single child — similar in spirit to a styled \`<div>\`
- \`Stack\` layers children on top of each other, useful for overlays and badges
- \`ListView\` renders a scrollable list, efficiently — critically, it only builds the items currently visible on screen, not the entire list upfront, which matters a lot for performance with long lists

## Composition over configuration

Flutter's philosophy leans toward composing many small, focused widgets rather than configuring one large widget with many properties. A card isn't one widget with fifty properties — it's a \`Container\` wrapping a \`Column\` wrapping a few \`Text\` and \`Icon\` widgets, each simple and independently understandable. This mirrors the same "small, focused, composable pieces" principle that shows up in good component design generally.`,
            },
            {
              id: 'mob-foundation-ui-l2',
              title: 'Responsive design & Material Design',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `A mobile app needs to look right across a wide range of screen sizes — from a compact phone to a large tablet — and Flutter provides specific tools for handling that instead of relying on fixed pixel values.

## Building responsively in Flutter

- \`MediaQuery.of(context).size\` gives you the current screen dimensions, usable for making layout decisions based on available space
- \`LayoutBuilder\` gives you the constraints of the *parent* widget specifically, which is often more useful than the full screen size when a widget is nested inside other layout
- Flexible layout widgets (\`Expanded\`, \`Flexible\`) let children grow or shrink proportionally rather than being fixed to hardcoded sizes

The general principle carries over directly from responsive web design: avoid hardcoded pixel dimensions wherever the content should adapt, and test across a genuine range of screen sizes rather than just the one simulator you happen to have open.

## Material Design

Material Design is Google's design system, and Flutter ships extensive built-in support for it — pre-built widgets (\`AppBar\`, \`FloatingActionButton\`, \`Card\`) that already follow Material's spacing, elevation, and interaction conventions. Using \`ThemeData\` to configure colors, typography, and component styling once, centrally, means visual consistency across the whole app without repeating styling decisions on every individual widget.

## When to deviate from Material defaults

Following Material conventions by default is usually the right call — it's well-tested, accessible, and familiar to users. Deviating is worth it when a specific brand identity genuinely calls for it, not as a default habit purely for visual novelty.`,
            },
            {
              id: 'mob-foundation-ui-l3',
              title: 'Navigation',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 3,
              content: `Navigation in Flutter is based on a stack of routes — pushing a new screen adds it to the top of the stack, popping removes it and returns to whatever was underneath.

\`\`\`dart
// Navigate to a new screen
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => OpportunityDetailScreen(id: opportunityId)),
);

// Go back
Navigator.pop(context);

// Named routes, defined once in MaterialApp
Navigator.pushNamed(context, '/opportunity', arguments: opportunityId);
\`\`\`

## Named routes vs. direct navigation

Direct navigation (\`MaterialPageRoute\`) is simple and fine for small apps. Named routes centralize all route definitions in one place, which becomes valuable as an app grows — especially once deep linking (opening the app directly to a specific screen from an external link or notification) enters the picture, since named routes give deep linking a clear, consistent target to route to.

## Passing data between screens

Data typically flows forward through constructor parameters when navigating to a new screen, and flows back through \`Navigator.pop(context, result)\`, with the calling screen awaiting the result. This mirrors the same "data down, events up" pattern used in most UI frameworks — a screen doesn't reach backward into the screen that pushed it; it returns a result explicitly instead.

## Bottom navigation and tabs

For apps with a few primary top-level sections, \`BottomNavigationBar\` combined with an \`IndexedStack\` (which preserves each tab's state even when it's not the currently visible one) is the standard pattern — switching tabs shouldn't reset a tab's scroll position or form input just because it was temporarily off-screen.`,
            },
          ],
          practice: [
            { id: 'mob-foundation-ui-p1', title: 'Build authentication screens, a dashboard layout, and a navigation system', kind: 'coding', order: 1 },
          ],
          challenge: { id: 'mob-foundation-ui-c1', title: 'Build a fully responsive, adaptive dashboard with custom navigation', kind: 'coding', description: 'Harder, capstone-style exercise for this module.', order: 1 },
        },
        {
          id: 'mob-foundation-dart',
          title: 'Day 3 · Dart Programming',
          description: 'Object-oriented programming, async programming, and clean code.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            {
              id: 'mob-foundation-dart-l1',
              title: 'Object-oriented programming in Dart',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 1,
              content: `Dart is a fully object-oriented language, and Flutter's widget-based architecture leans on that heavily — classes, inheritance, and composition are core to how Flutter code is structured.

\`\`\`dart
class Applicant {
  final String id;
  final String name;
  final String email;
  ApplicationStatus status;

  Applicant({required this.id, required this.name, required this.email, this.status = ApplicationStatus.pending});

  bool get isAccepted => status == ApplicationStatus.accepted;
}

enum ApplicationStatus { pending, accepted, rejected }
\`\`\`

## Immutability by convention

Notice \`final\` on most fields — once an \`Applicant\` is created, its \`id\`, \`name\`, and \`email\` can't be reassigned. Preferring immutable data where practical (only using mutable fields when something genuinely needs to change, like \`status\` here) mirrors the same principle React embraces with immutable state: it makes data flow easier to reason about, because a value you're holding can't be silently changed out from under you elsewhere in the code.

## Named parameters

Dart's named parameters (\`{required this.id, ...}\`) make constructor calls self-documenting at the call site — \`Applicant(id: '1', name: 'Jane', email: 'jane@example.com')\` is unambiguous in a way that positional arguments in a long constructor often aren't, since you don't need to remember or look up which position corresponds to which field.

## Getters

A getter like \`isAccepted\` above computes a derived value on demand from existing state, rather than storing a separate, potentially-inconsistent boolean field that has to be kept manually in sync. This is the same "derive, don't duplicate" principle worth applying in any object-oriented code, in Dart or otherwise.`,
            },
            {
              id: 'mob-foundation-dart-l2',
              title: 'Async programming & collections',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 2,
              content: `Almost everything a mobile app does that touches the outside world — a network request, reading a file, querying a local database — is asynchronous, and Dart's \`async\`/\`await\` makes that code read almost like synchronous code.

\`\`\`dart
Future<List<Opportunity>> fetchOpportunities() async {
  final response = await http.get(Uri.parse('$baseUrl/opportunities'));
  if (response.statusCode != 200) {
    throw Exception('Failed to load opportunities');
  }
  final List<dynamic> json = jsonDecode(response.body);
  return json.map((item) => Opportunity.fromJson(item)).toList();
}
\`\`\`

## Future vs. Stream

A \`Future\` represents a single asynchronous value that resolves once — a network request's eventual response. A \`Stream\` represents a sequence of asynchronous values over time — real-time updates, a sequence of user input events, ongoing data from a WebSocket. Picking the right one matters: modeling a one-time API call as a \`Stream\`, or continuous live updates as a series of separate \`Future\`s, both fight against the tools instead of using them naturally.

## Collections and functional-style operations

Dart's collection methods (\`.map()\`, \`.where()\`, \`.fold()\`) let you transform lists declaratively, the same way JavaScript's array methods do — \`opportunities.where((o) => o.forte == 'Mobile').toList()\` reads directly as what it does, rather than requiring a manual loop with an accumulator variable to achieve the same result.

## Error handling in async code

\`try\`/\`catch\` wraps \`await\`ed calls the same way it wraps synchronous code — an unhandled exception in an async function still needs a caller ready to handle it, or the app can crash on what looks like a routine network hiccup that should have been recoverable.`,
            },
            {
              id: 'mob-foundation-dart-l3',
              title: 'Exception handling & clean code',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `Mobile apps run on devices with unreliable networks, low battery, and constrained memory — exception handling here isn't a formality, it's what keeps an app usable under genuinely unreliable real-world conditions.

## Handling exceptions deliberately

- Catch exceptions at a level where you can actually do something meaningful about them — showing a retry option, falling back to cached data — not just anywhere convenient
- Avoid empty \`catch\` blocks that silently swallow errors; an error that disappears without a trace is much harder to diagnose later than one that's at least logged
- Distinguish between recoverable errors (a failed network request — retry, or show cached data) and unrecoverable ones (corrupted local data that genuinely can't be used) and handle each appropriately rather than treating every failure identically

## Clean code practices that matter especially in Dart/Flutter

- Keep widget \`build()\` methods focused on layout — pull business logic, formatting, and data transformation out into separate functions or classes rather than burying them inside a giant build method
- Name widgets and variables for what they represent, not their type — \`applicantCard\` reads clearer than \`container1\`
- Extract a widget into its own class once it's reused more than once, or once a single \`build()\` method is growing unwieldy — the same "split when complexity actually appears" principle that applies to component extraction in any UI framework

## Why this matters more on mobile specifically

A crash on mobile is a much worse experience than a web error — there's no simple page refresh to recover from, and app store reviews are a very visible, very public record of reliability problems that persist long after they're fixed.`,
            },
          ],
          practice: [
            { id: 'mob-foundation-dart-p1', title: 'Write utility functions, data models, and business logic', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'mob-foundation-state',
          title: 'Day 4 · State Management',
          description: 'Provider, Riverpod, and application architecture.',
          estimatedMinutes: 65,
          order: 4,
          lessons: [
            {
              id: 'mob-foundation-state-l1',
              title: 'Provider & local state',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 1,
              content: `As a Flutter app grows beyond a couple of screens, passing data down through widget constructors becomes unwieldy — Provider solves the same problem React's Context API solves: making a value available to a whole subtree of widgets without threading it through every layer manually.

\`\`\`dart
class AuthState extends ChangeNotifier {
  User? _user;
  User? get user => _user;

  void login(User user) {
    _user = user;
    notifyListeners(); // triggers a rebuild in any widget listening to this
  }
}

// Anywhere in the widget tree below the provider:
final user = context.watch<AuthState>().user;
\`\`\`

## What's actually happening

\`ChangeNotifier\` is a class that can notify listeners when something changes; \`notifyListeners()\` triggers a rebuild in any widget that's watching it. Wrapping part of the widget tree in a \`ChangeNotifierProvider\` makes that state available anywhere below it, without passing it explicitly through every intermediate widget's constructor.

## Local state still has its place

Not everything needs Provider. A single screen's own transient state — whether a dropdown is open, the current value of a text field mid-edit — is usually better as local \`StatefulWidget\` state, kept close to where it's actually used. Reaching for global state management for something genuinely local adds indirection without a real benefit, mirroring the exact same "don't over-centralize" caution that applies to React's Context API.`,
            },
            {
              id: 'mob-foundation-state-l2',
              title: 'Riverpod introduction & global state',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 2,
              content: `Riverpod is a more modern evolution of Provider, addressing some of its limitations — most notably, Riverpod doesn't require a \`BuildContext\` to read state, and it catches certain classes of bugs at compile time that Provider only catches at runtime.

\`\`\`dart
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState.initial());

  void login(User user) {
    state = AuthState.authenticated(user);
  }
}

// In a widget:
final authState = ref.watch(authProvider);
\`\`\`

## Why Riverpod over plain Provider for many teams

- State can be read outside the widget tree entirely (in a service, a test, a background task) — genuinely useful, since not everything that needs state lives inside a widget's \`build()\` method
- Providers are strongly typed and compile-time checked, catching a class of "provider not found" runtime errors before the app ever runs
- Providers can depend on other providers cleanly, making complex, composed state easier to structure than nested Provider trees tend to become

## Choosing between Provider, Riverpod, and other options (Bloc, GetX)

There's no single universally correct choice — what matters most is that a team picks one approach and applies it consistently, rather than mixing several state management philosophies across different parts of the same app, which makes the codebase harder to reason about for everyone working in it.`,
            },
            {
              id: 'mob-foundation-state-l3',
              title: 'Application architecture',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 3,
              content: `As a Flutter app grows, a clear architectural layering keeps it maintainable — the same separation-of-concerns principle that applies to frontend and backend work applies here too.

## A typical layering

- **UI layer** — widgets, purely responsible for layout and rendering, reading from state and dispatching actions
- **State management layer** — Provider/Riverpod notifiers holding application state and the logic for updating it
- **Service layer** — API clients, local storage, and other external integrations, independent of any UI concerns
- **Model layer** — data classes representing the app's core entities, shared across the other layers

## Why this separation earns its complexity

A widget that fetches its own data directly, manages loading and error state, and renders a complex UI is hard to test and hard to reuse — pulling the data-fetching and state logic out into a separate notifier makes the widget itself close to trivial, and makes the underlying logic testable independent of any actual UI rendering.

## Feature-based organization

Similar to the recommended structure for a React app, organizing by feature (\`features/applications/\`, containing that feature's screens, state, and services together) rather than purely by technical layer keeps related code physically close, and keeps a growing app navigable rather than sprawling.

## A principle worth keeping in view

Architecture exists to make change cheap and safe as an app grows — for a small app, an elaborate layered architecture can be overkill and add friction without a real payoff. Match the level of structure to the actual size and expected lifespan of the project, rather than applying the most sophisticated pattern available by default.`,
            },
          ],
          practice: [
            { id: 'mob-foundation-state-p1', title: 'Build user profile management, a dynamic dashboard, and theme switching', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'mob-foundation-checkpoint', title: '[Mentor Checkpoint] Flutter Fundamentals Review (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'mob-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-10 · Backend integration, authentication, local storage, Firebase, performance, and testing.',
      order: 2,
      modules: [
        {
          id: 'mob-development-backend',
          title: 'Day 5 · Backend Integration',
          description: 'REST APIs, HTTP requests, and JSON parsing.',
          estimatedMinutes: 50,
          order: 1,
          lessons: [
            {
              id: 'mob-development-backend-l1',
              title: 'REST APIs & HTTP requests',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `A mobile app almost always talks to a backend the same way a web frontend does — over HTTP, against a REST (or similar) API — the concepts carry over directly even though the client is now a mobile app instead of a browser.

## What's the same as web frontend work

- GET, POST, PATCH, DELETE map to the same operations: read, create, update, remove
- Status codes carry the same meaning: 2xx success, 4xx client error, 5xx server error
- Authentication typically works the same way — a token attached as an \`Authorization\` header on each request

## What's genuinely different on mobile

- **Network reliability is far less guaranteed** — a mobile connection can drop mid-request in ways a typical desktop browser session rarely experiences, which makes retry logic and offline handling much more central to mobile development than to most web work
- **Requests cost the user's data plan and battery** — batching requests and avoiding redundant calls matters more directly to the end user's experience than it usually does on the web
- **Background behavior** — a mobile app can be backgrounded or killed by the OS mid-request, which needs to be handled gracefully rather than assumed away

## A practical habit

Never assume a network call will succeed. Every API integration on mobile needs a real loading state, a real error state, and ideally a retry mechanism — treating network failure as a routine, expected case rather than an edge case is the mindset shift that separates a fragile mobile app from a resilient one.`,
            },
            {
              id: 'mob-development-backend-l2',
              title: 'JSON parsing & error handling',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 2,
              content: `Converting between raw JSON and typed Dart objects is a step every API integration needs, and doing it consistently — rather than ad hoc, per call site — pays off quickly.

\`\`\`dart
class Opportunity {
  final String id;
  final String title;
  final String forte;

  Opportunity({required this.id, required this.title, required this.forte});

  factory Opportunity.fromJson(Map<String, dynamic> json) {
    return Opportunity(
      id: json['id'] as String,
      title: json['title'] as String,
      forte: json['forte'] as String,
    );
  }
}

Future<List<Opportunity>> fetchOpportunities() async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/opportunities'));
    if (response.statusCode != 200) {
      throw ApiException('Failed to load opportunities', response.statusCode);
    }
    final List<dynamic> data = jsonDecode(response.body);
    return data.map((json) => Opportunity.fromJson(json)).toList();
  } on SocketException {
    throw ApiException('No internet connection', null);
  }
}
\`\`\`

## Why a dedicated \`fromJson\` factory, not scattered parsing

Centralizing parsing logic in one place per model means a backend schema change (a renamed field, a new required field) only needs updating in one location, not everywhere that model happens to be used. It also gives you one obvious place to add validation or handle unexpected/missing fields gracefully.

## Distinguishing failure types

A network failure (no connection at all) and an API error (the server responded, but with an error status) are different situations that usually deserve different user-facing messages — "check your connection" reads very differently from "something went wrong on our end," and conflating them produces a confusing, less helpful error experience.`,
            },
          ],
          practice: [
            { id: 'mob-development-backend-p1', title: 'Build an internship listings screen and a user profile API integration', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'mob-development-auth',
          title: 'Day 6 · Authentication',
          description: 'JWT, Firebase Authentication, and secure login.',
          estimatedMinutes: 50,
          order: 2,
          lessons: [
            {
              id: 'mob-development-auth-l1',
              title: 'JWT & session management',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Authentication on mobile follows the same JWT-based approach common on web, with one important difference in where the token gets stored: mobile platforms provide secure, OS-level storage that's a meaningfully better fit than anything a browser offers.

## Secure storage on mobile

iOS's Keychain and Android's Keystore are hardware-backed secure storage designed specifically for exactly this kind of sensitive data — a token stored here is encrypted and isolated from other apps on the device. Packages like \`flutter_secure_storage\` provide a unified API over both, so app code doesn't need separate platform-specific logic to use them correctly.

## Session persistence

A user shouldn't need to log in every time they open the app. On launch, the app checks for a stored, still-valid token and restores the session automatically — but that check needs a real loading state while it happens, since it typically involves either reading local storage or a network call, and jumping straight to a login screen before that check completes would incorrectly log out a genuinely authenticated user.

## Handling token expiry gracefully

When a stored access token has expired, the app should attempt a silent refresh using a refresh token before falling back to prompting for login again — forcing a full re-login on every token expiry, when a silent refresh could handle it invisibly, produces unnecessary friction for the user with no real security benefit.

## What never belongs in plain storage

Passwords are never stored on the device at all — only after a successful login does the app hold a token, and even that lives in secure storage, never in a plain file or a general-purpose key-value store not designed for sensitive data.`,
            },
            {
              id: 'mob-development-auth-l2',
              title: 'Firebase Authentication & secure login',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 2,
              content: `Firebase Authentication is a common choice for mobile apps because it handles the hard, security-sensitive parts of authentication — password hashing, token issuance, social login providers — so a mobile team doesn't have to build and maintain that infrastructure from scratch.

\`\`\`dart
Future<User?> signIn(String email, String password) async {
  try {
    final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
    return credential.user;
  } on FirebaseAuthException catch (e) {
    if (e.code == 'user-not-found' || e.code == 'wrong-password') {
      throw AuthException('Invalid email or password');
    }
    throw AuthException('Sign in failed: \${e.message}');
  }
}
\`\`\`

## What Firebase Auth handles for you

Password hashing and storage, token issuance and refresh, and out-of-the-box support for social sign-in providers (Google, Apple, and others) without needing to implement each provider's OAuth flow manually.

## The same deliberately vague error handling as any backend

Just as on a custom backend, error messages shouldn't distinguish "no account exists" from "wrong password" — Firebase's own error codes make this distinction available, but the UI-facing message should stay generic ("invalid email or password") to avoid letting an attacker enumerate which emails have accounts.

## Listening for auth state changes

Rather than manually checking login status everywhere it matters, \`FirebaseAuth.instance.authStateChanges()\` provides a stream your app can listen to, automatically reacting whenever the user signs in or out — this keeps your UI reliably in sync with the actual current auth state instead of needing to poll or manually track it in application state.`,
            },
          ],
          practice: [
            { id: 'mob-development-auth-p1', title: 'Build a login flow with registration and password recovery', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'mob-development-storage',
          title: 'Day 7 · Local Storage',
          description: 'Shared Preferences, SQLite, Hive, and offline data.',
          estimatedMinutes: 45,
          order: 3,
          lessons: [
            {
              id: 'mob-development-storage-l1',
              title: 'Shared Preferences & SQLite',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 1,
              content: `Different kinds of local data call for different storage mechanisms — picking the right one for the data you actually have matters more than defaulting to whichever one you learned first.

\`\`\`dart
// Shared Preferences — simple key-value pairs
final prefs = await SharedPreferences.getInstance();
await prefs.setBool('hasSeenOnboarding', true);
final seen = prefs.getBool('hasSeenOnboarding') ?? false;

// SQLite — structured, queryable, relational data
final db = await openDatabase('app.db', version: 1, onCreate: (db, version) {
  db.execute('CREATE TABLE applications(id TEXT PRIMARY KEY, status TEXT, cached_at INTEGER)');
});
await db.insert('applications', {'id': '1', 'status': 'pending', 'cached_at': DateTime.now().millisecondsSinceEpoch});
\`\`\`

## When to use Shared Preferences

Small, simple values — a theme preference, a "has completed onboarding" flag, a feature flag. It's not designed for structured or relational data, and using it for anything beyond simple key-value pairs tends to get unwieldy fast.

## When to use SQLite

Structured data with real relationships, that you need to query, filter, or sort — a local cache of applications, offline-available opportunity listings. SQLite gives you the same relational querying power on-device that PostgreSQL gives a backend, which matters once local data grows beyond a handful of simple values.

## A rule of thumb

If you're tempted to store a JSON-encoded object inside a Shared Preferences string just because it's simpler to set up, that's usually a signal the data actually belongs in SQLite (or Hive) instead — Shared Preferences works well for exactly what it's designed for, and starts to strain noticeably outside that scope.`,
            },
            {
              id: 'mob-development-storage-l2',
              title: 'Hive & offline data',
              contentType: 'code',
              estimatedMinutes: 15,
              order: 2,
              content: `Hive is a fast, lightweight, pure-Dart local database — a popular alternative to SQLite for apps that want structured local storage without writing raw SQL.

\`\`\`dart
@HiveType(typeId: 0)
class CachedOpportunity {
  @HiveField(0)
  final String id;
  @HiveField(1)
  final String title;
  @HiveField(2)
  final DateTime cachedAt;

  CachedOpportunity({required this.id, required this.title, required this.cachedAt});
}

final box = await Hive.openBox<CachedOpportunity>('opportunities');
await box.put(opportunity.id, opportunity);
final cached = box.get(opportunityId);
\`\`\`

## Why teams reach for Hive over SQLite

No SQL to write, strong type safety through generated adapters, and generally faster read/write performance for typical mobile app use cases. The trade-off: SQLite's relational querying (joins, complex filters) is more powerful for genuinely complex, relational local data — Hive is a strong fit for simpler, more document-like local storage needs.

## Designing for offline access deliberately

Real offline support means more than "cache the last response" — it means deciding explicitly: what should be available with no connection at all, how stale cached data is allowed to get before it's considered unreliable, and how the UI clearly communicates "you're viewing offline, possibly outdated data" rather than silently presenting cached data as if it were live and current.

## Syncing when connectivity returns

A common pattern: local changes made while offline get queued, then synced to the backend once connectivity is restored, with conflict resolution for cases where the same data changed both locally and on the server in the meantime. This adds real complexity — worth building only when offline support is a genuine product requirement, not a default to reach for on every feature regardless of whether it's actually needed.`,
            },
          ],
          practice: [
            { id: 'mob-development-storage-p1', title: 'Build offline user settings and cache API data locally', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'mob-development-firebase',
          title: 'Day 8 · Firebase Integration',
          description: 'Cloud Firestore, Cloud Storage, push notifications, and analytics.',
          estimatedMinutes: 55,
          order: 4,
          lessons: [
            {
              id: 'mob-development-firebase-l1',
              title: 'Cloud Firestore & Cloud Storage',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 1,
              content: `Firebase provides a suite of backend services purpose-built for mobile apps — Cloud Firestore for structured data with real-time sync, and Cloud Storage for files, both without needing to run your own backend infrastructure for these specific needs.

\`\`\`dart
// Real-time listening to a Firestore collection
FirebaseFirestore.instance
  .collection('applications')
  .where('userId', isEqualTo: currentUserId)
  .snapshots()
  .listen((snapshot) {
    final applications = snapshot.docs.map((doc) => Application.fromJson(doc.data())).toList();
    updateUI(applications);
  });

// Uploading a file to Cloud Storage
final ref = FirebaseStorage.instance.ref('resumes/$userId.pdf');
await ref.putFile(resumeFile);
final downloadUrl = await ref.getDownloadURL();
\`\`\`

## What makes Firestore different from a typical REST API

Firestore's \`.snapshots()\` gives you a real-time stream — any change to the underlying data (from any device, any user) pushes an update to every listener automatically, without polling. This is genuinely powerful for collaborative or live-updating features, at the cost of a different mental model than the request/response pattern a REST API uses.

## Structuring Firestore data well

Firestore is a NoSQL document database — data modeling here looks different from relational schema design. Deeply nested data can make querying awkward; flatter collections with references between them (similar in spirit to foreign keys) are usually easier to query and reason about as an app's data model grows in complexity.

## Cloud Storage security rules

Just as with any file storage, access needs to be deliberately scoped — Firebase Security Rules define who can read or write which files, enforced server-side regardless of what the client app does or doesn't check, the same principle as any other backend authorization.`,
            },
            {
              id: 'mob-development-firebase-l2',
              title: 'Push notifications & analytics',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Push notifications and analytics are two of the most common reasons mobile teams reach for Firebase specifically — both are genuinely hard to build well from scratch, and Firebase Cloud Messaging (FCM) and Firebase Analytics handle the difficult infrastructure underneath.

## How push notifications actually work

A device registers for a unique token with the platform's push service (APNs on iOS, FCM on Android). Your backend sends a message to Firebase Cloud Messaging along with that token; FCM handles delivering it to the specific device through the platform's own push infrastructure. The app itself needs to handle notifications differently depending on whether it's in the foreground, background, or fully closed when the notification arrives — each state needs distinct, deliberate handling.

## Designing notifications users actually want

Over-notifying is one of the most common reasons users disable notifications entirely, or uninstall an app outright. Every notification should have a clear, specific reason to exist and a clear action the user can take from it — batching related updates into one notification is usually better than sending several in quick succession for the same underlying event.

## What analytics is actually for

Firebase Analytics tracks events — screen views, button taps, custom events you define — giving you real visibility into how the app is actually used, not just how you assume it's used based on intuition. This is what tells you, concretely, which features get used, where users drop off in a flow, and what's actually worth investing further engineering effort into improving.

## Privacy matters here

Be deliberate about what gets tracked, and be transparent with users about it, consistent with your app's privacy policy and applicable regulations. Analytics is a real product tool, not a reason to collect every possible signal just because the SDK makes it technically easy to do so.`,
            },
          ],
          practice: [
            { id: 'mob-development-firebase-p1', title: 'Build a notification system and an image upload feature', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'mob-development-checkpoint', title: '[Mentor Checkpoint] API & Firebase Assessment (Day 8)', kind: 'coding', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
        {
          id: 'mob-development-performance',
          title: 'Day 9 · Performance Optimization',
          description: 'Widget optimization, lazy loading, and memory management.',
          estimatedMinutes: 40,
          order: 5,
          lessons: [
            {
              id: 'mob-development-performance-l1',
              title: 'Widget optimization & lazy loading',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `Mobile devices run on far more constrained hardware than a typical desktop browser — performance work here directly affects battery life and how smooth an app feels, not just how "fast" it technically is.

## Reducing unnecessary widget rebuilds

Flutter rebuilds a widget subtree whenever its state changes — the goal of optimization is usually keeping that subtree as small as possible so a small state change doesn't trigger a much larger rebuild than it needs to. \`const\` constructors mark a widget as unchanging, letting Flutter skip rebuilding it entirely when nothing about it has actually changed. Splitting a large widget into smaller ones with their own, more narrowly-scoped state can mean only the piece that actually changed needs to rebuild, not the whole surrounding tree.

## Lazy loading lists

\`ListView.builder\` (rather than \`ListView\` with a fully materialized list of children) only builds the widgets currently visible on screen, constructing more as the user scrolls. For a list of any real size, this is the difference between a smooth scroll and a janky one, or even an out-of-memory crash for a genuinely long list rendered all at once.

## Images specifically

Loading a full-resolution image just to display it at thumbnail size wastes both memory and bandwidth. Requesting an appropriately-sized image, and caching decoded images rather than re-decoding on every rebuild, are both meaningful, common wins — image handling is one of the most frequent sources of avoidable performance problems in mobile apps generally.

## Measure, don't guess

Flutter's DevTools performance profiler shows real frame render times and rebuild counts — use it to find actual bottlenecks rather than optimizing based on assumption, the same discipline that applies to backend query optimization.`,
            },
            {
              id: 'mob-development-performance-l2',
              title: 'Image optimization & memory management',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Images are one of the most common sources of memory pressure in a mobile app, and memory pressure is one of the most common causes of an app being killed by the OS or simply feeling sluggish.

## Practical image optimization

- Request appropriately-sized images from your backend or CDN rather than always fetching full resolution and letting the device scale it down after the fact
- Use \`cacheWidth\`/\`cacheHeight\` on \`Image\` widgets so Flutter decodes at the size actually needed for display, rather than decoding a much larger image than what's shown
- Cache network images (via a package like \`cached_network_image\`) so the same image isn't re-downloaded and re-decoded every time it scrolls back into view

## Memory management more broadly

- **Dispose of controllers and listeners** — a \`TextEditingController\`, an \`AnimationController\`, a stream subscription that isn't disposed of when a widget is removed continues consuming memory and can even keep firing callbacks against a widget that no longer exists
- **Avoid holding large objects longer than necessary** — a large list or a big decoded image held in state after it's no longer needed keeps consuming memory the OS could otherwise reclaim

## Why this specifically matters on mobile

Unlike a desktop browser tab, a mobile OS can and will kill a backgrounded app under memory pressure to make room for whatever the user is actively using — an app that consumes memory carelessly gets killed more often, forcing more frequent full restarts and a genuinely worse experience for the user, even if nothing ever visibly "crashes" in the traditional sense.`,
            },
          ],
          practice: [
            { id: 'mob-development-performance-p1', title: 'Improve app performance and debug a slow screen', kind: 'debugging', order: 1 },
          ],
        },
        {
          id: 'mob-development-testing',
          title: 'Day 10 · Testing',
          description: 'Widget testing, integration testing, and debugging.',
          estimatedMinutes: 40,
          order: 6,
          lessons: [
            {
              id: 'mob-development-testing-l1',
              title: 'Widget & integration testing',
              contentType: 'code',
              estimatedMinutes: 20,
              order: 1,
              content: `Flutter's testing tools cover three levels, each answering a different question about the app's correctness.

\`\`\`dart
testWidgets('shows error message on invalid login', (tester) async {
  await tester.pumpWidget(MyApp());

  await tester.enterText(find.byKey(Key('email')), 'invalid-email');
  await tester.tap(find.byKey(Key('loginButton')));
  await tester.pump(); // rebuild after the tap

  expect(find.text('Please enter a valid email'), findsOneWidget);
});
\`\`\`

## The three testing levels

- **Unit tests** — test a single function or class in isolation, with no widgets involved at all; fast, and the right choice for testing business logic (validation rules, data transformations) independent of any UI
- **Widget tests** (shown above) — render a widget in a test environment and verify its behavior: does tapping a button produce the expected UI change, does invalid input show the right error message
- **Integration tests** — run the full app on a real device or emulator, testing complete user flows end to end (signing up, applying to an opportunity, checking training progress)

## Why widget tests specifically are worth the investment

They run far faster than full integration tests (no real device or emulator needed) while still testing genuine user-facing behavior, not just isolated logic. A well-tested app usually has many unit tests, a meaningful number of widget tests for key flows, and a smaller number of integration tests covering the most critical end-to-end paths — that balance keeps the test suite both fast and genuinely useful.

## What to actually test

Prioritize business-critical logic and flows a user genuinely depends on — authentication, core data submission, payment or application flows — over exhaustively testing every trivial UI detail, which offers little value relative to the time spent writing and maintaining those tests.`,
            },
            {
              id: 'mob-development-testing-l2',
              title: 'Debugging & error tracking',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Debugging a mobile app has a genuine extra layer of difficulty beyond typical web debugging: once an app ships to real users' devices, you generally can't just open a browser console and look — you need the app itself to surface what went wrong.

## Flutter's built-in debugging tools

- **Flutter DevTools** — inspect the widget tree, profile performance, view network requests, all from a connected debug session
- **The debugger in VS Code or Android Studio** — breakpoints, step-through debugging, and variable inspection, working the same as debugging any other application code
- **\`print()\` and structured logging** — sometimes the simplest tool remains the most direct one, especially for quickly checking a value at a specific point in execution

## Error tracking in production

Once an app is live, you need visibility into crashes and errors happening on real users' devices, which your own machine will never reproduce. Tools like Firebase Crashlytics or Sentry automatically capture crash reports — stack trace, device info, steps leading up to the crash — and surface them so real problems are visible instead of only reachable through scattered user complaints, which are usually vague and hard to act on directly.

## A debugging habit worth building

When something breaks, resist the instinct to guess-and-check by changing code randomly until it happens to work. Form a specific hypothesis about what's wrong, add logging or a breakpoint to confirm or rule it out, and narrow down the actual cause systematically — this is meaningfully faster in practice than trial and error, even though it can feel slower at first.`,
            },
          ],
          practice: [
            { id: 'mob-development-testing-p1', title: 'Write test cases and fix a reported bug', kind: 'debugging', order: 1 },
          ],
        },
      ],
    },
    {
      id: 'mob-project',
      key: 'project',
      title: 'Project',
      description: "Days 11-13 · Industry simulation -- sprint planning, ticket-based feature development, and code review exactly as a real mobile engineering team works.",
      order: 3,
      modules: [
        {
          id: 'mob-project-simulation',
          title: 'Industry Simulation Sprint',
          description: 'Work an assigned ticket end-to-end: plan, build, test, and open a pull request.',
          estimatedMinutes: 40,
          order: 1,
          lessons: [
            {
              id: 'mob-project-simulation-l1',
              title: 'Sprint planning & ticket assignment',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `Sprint planning for mobile work follows the same rhythm as any engineering team's — a fixed time box, a committed set of tickets, a review of what actually shipped — with a couple of mobile-specific wrinkles worth naming.

## What a well-written mobile ticket includes

- The specific screen or flow affected, described clearly enough that acceptance can be verified without ambiguity
- Which platforms it applies to — a fix or feature might behave differently on iOS versus Android, and that should be explicit in the ticket rather than assumed
- Any design references (Figma links, screenshots) for UI work, since visual details matter more concretely here than they do for most backend tickets

## Estimating mobile work honestly

Mobile tickets sometimes carry platform-specific surprises that aren't visible from the ticket description alone — something that works cleanly on Android might need extra handling on iOS, or vice versa. Flagging that kind of platform-specific complexity as soon as it's discovered, rather than staying quiet about it, keeps the sprint's plan grounded in reality.

## Picking up your ticket

Read the acceptance criteria fully, including which platforms it needs to be verified on, before writing any code — assuming "it works" after testing on only one platform is one of the most common, easily-avoidable mistakes in mobile development.`,
            },
            {
              id: 'mob-project-simulation-l2',
              title: 'Feature development & API integration',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 2,
              content: `Building a mobile feature on a real team follows a rhythm worth internalizing: understand the ticket, build incrementally, integrate with the backend, and test across the platforms that actually matter for this change.

## The typical shape of the work

1. Read the ticket and any design references fully before writing code
2. Build the UI first against realistic sample data, so layout and interaction can be verified without waiting on a live backend
3. Wire up the real API integration, with proper loading and error states
4. Test on both a device/emulator for each relevant platform — a change that only gets tested on one platform risks shipping a real platform-specific bug

## Working with an evolving backend

Mobile and backend work often happen in parallel on a real team, which means a mobile ticket sometimes depends on a backend endpoint that doesn't exist yet or is still changing. Coordinating on the expected request/response shape early — before either side starts building against assumptions — avoids a painful integration surprise once both pieces are ready to connect.

## Scope discipline

Just as with frontend or backend work, resist folding an unrelated fix into your current branch "while you're in there." Keep the branch focused on exactly what the ticket describes — a focused PR is faster to review and safer to merge than one quietly doing several unrelated things at once.`,
            },
            {
              id: 'mob-project-simulation-l3',
              title: 'Code reviews & UI fixes',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 3,
              content: `Mobile code review covers the same fundamentals as any code review — clarity, correctness, maintainability — plus a few things specific to mobile UI work worth calling out.

## What a mobile-specific reviewer looks for

- Does the UI actually match the design across different screen sizes, not just the one device the author happened to test on
- Are loading and error states handled for every network call, not just the happy path
- Are controllers, animations, and stream subscriptions properly disposed of — a missed \`dispose()\` call is a very common, easy-to-miss source of memory leaks that reviewers should specifically watch for
- Does the change behave correctly on both iOS and Android where platform differences apply

## Providing screenshots or a recording

For UI changes specifically, a screenshot or short screen recording in the PR description saves a reviewer from needing to pull the branch and run it locally just to see what changed visually — genuinely one of the highest-value habits to build for any UI-facing pull request, mobile or otherwise.

## Responding to UI feedback

"This doesn't quite match the design" is common, specific, and useful feedback — pixel-level fidelity matters more in mobile UI review than it often does in backend review, precisely because visual correctness is a large part of what makes a mobile app feel genuinely polished versus merely functional.

## Fixing UI issues efficiently

Hot reload makes UI fix iteration fast — a review comment about spacing or alignment can usually be addressed and re-verified in under a minute, which is exactly the kind of quick turnaround that keeps a PR review cycle moving instead of stalling.`,
            },
            {
              id: 'mob-project-simulation-l4',
              title: 'QA testing & deployment preparation',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 4,
              content: `Before a mobile feature is considered genuinely done, it needs real QA testing — and mobile apps have deployment considerations that most web features simply don't.

## What thorough mobile QA covers

- **Cross-device testing** — different screen sizes, different OS versions, not just the single device used during development
- **Interruption handling** — does the app behave correctly if a phone call arrives mid-flow, if the app is backgrounded and resumed, if the network drops partway through an action
- **Edge cases specific to touch interfaces** — rapid repeated taps, gestures that might conflict with system-level gestures (like an edge swipe used for both an in-app action and the OS's own back navigation)

## Deployment preparation

Unlike a web app that deploys instantly to a URL, a mobile app update generally goes through an app store review process (Google Play, Apple App Store) that can take anywhere from hours to a few days. This means mobile release planning has to account for that latency — a critical bug fix can't ship as instantly as it could on the web, which raises the value of catching problems before submission rather than relying on being able to ship a fast follow-up patch.

## Release builds vs. debug builds

A release build strips debug information and applies real optimizations — performance and app size in a release build can differ meaningfully from what you see during development. Testing an actual release build before submission, not just the debug build used day to day, is what catches build-configuration-specific issues before they reach real users.`,
            },
          ],
          practice: [
            { id: 'mob-project-simulation-p1', title: 'Resolve your assigned sprint ticket end-to-end', kind: 'coding', order: 1 },
            { id: 'mob-project-simulation-p2', title: 'Fix a reported bug and verify it with QA testing', kind: 'debugging', order: 2 },
          ],
          submission: { id: 'mob-project-simulation-s1', title: 'Submit your sprint feature pull request', instructions: 'Link the pull request for the ticket you were assigned during the sprint.', requiresLink: true },
          assessment: { id: 'mob-project-simulation-checkpoint', title: '[Mentor Checkpoint] Sprint Review (Day 12)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'mob-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Mentor evaluation of your application-readiness before the capstone and client project allocation.',
      order: 4,
      modules: [
        {
          id: 'mob-readiness-eval',
          title: 'Application Readiness Assessment (Day 15)',
          description: 'Your mentor reviews app quality, performance, and collaboration before you begin the capstone.',
          order: 1,
          lessons: [
            {
              id: 'mob-readiness-eval-l1',
              title: 'What to expect from your application readiness assessment',
              contentType: 'markdown',
              estimatedMinutes: 10,
              order: 1,
              content: `This checkpoint is about calibration, not a pass/fail gate — its purpose is making sure you head into the capstone with an honest, specific sense of your current strengths and where you still need deliberate work.

## What your mentor is specifically looking at

- **App quality and stability** — does what you've built handle real-world conditions (poor network, backgrounding, low memory) gracefully, not just the ideal happy path
- **Performance** — are there obvious, avoidable performance issues (unnecessary rebuilds, unoptimized images, memory leaks from undisposed controllers)
- **Code architecture** — is state management applied consistently, is business logic separated from UI, is the code something another engineer could maintain
- **Collaboration** — how you handled sprint work, how you gave and received code review feedback, whether you tested across platforms rather than assuming one platform's behavior generalizes to both

## How to prepare

There's no separate assignment for this specifically — it's a review of everything built across Days 1-14. The most useful preparation is honest self-reflection: which part of Flutter development still feels least solid — state management, platform-specific quirks, performance — and what's the plan to strengthen it before the capstone actually depends on it.

## What comes next

This feedback exists to shape your capstone approach — come ready to genuinely absorb it, not to defend every architectural choice you've made so far.`,
            },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'mob-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Capstone mobile application, technical presentation, interview preparation, and certification.',
      order: 5,
      modules: [
        {
          id: 'mob-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Build and ship a production-ready mobile application, then present it for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            {
              id: 'mob-graduation-capstone-l1',
              title: 'Capstone briefing & project options',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 1,
              content: `The capstone is a complete Flutter application you design, build, and ship end to end — not a single screen bolted onto something existing, but a real, working mobile product built entirely by you.

## What "production-ready" means for a mobile app specifically

Beyond the core flow working: real loading and error states throughout, sensible handling of network interruptions, reasonable performance (no obvious jank or memory issues), a UI that adapts across screen sizes, and — ideally — an actual working build a mentor can install and use, not just a description of what it would do.

## Project options

- **Internship Portal App** — the applicant experience: browsing opportunities, applying, tracking status
- **Learning Management App** — course browsing, progress tracking, offline-available content
- **AI Assistant App** — a chat-based mobile interface calling an AI backend
- **Healthcare Booking App** — appointment scheduling, provider search, booking management
- **Expense Tracker** — a genuinely offline-capable app for logging and categorizing spending
- **Food Delivery Platform** — browsing, ordering, and order tracking

Pick something scoped enough to build to a real, working standard in the time available. A smaller app that's genuinely functional, tested across platforms, and handles failure gracefully demonstrates far more than an ambitious one that only works in a scripted demo.

## What you'll actually be evaluated on

Architecture, state management discipline, and how the app handles real-world conditions — not just whether the happy-path demo looks good on the one device you tested most.`,
            },
            {
              id: 'mob-graduation-capstone-l2',
              title: 'Interview & portfolio preparation',
              contentType: 'markdown',
              estimatedMinutes: 15,
              order: 2,
              content: `Your capstone app is also your strongest portfolio piece and interview talking point — a real, working mobile application you can install, demo live, and speak to in genuine technical depth.

## Presenting mobile work well

- Have a real device (or a working emulator) ready to demo live, not just static screenshots — a live demo, even an imperfect one, demonstrates the app is genuinely real and functional in a way slides can't
- Be ready to explain your state management approach and why you chose it over the alternatives
- Have a specific example ready of a platform-specific issue you hit (an iOS vs. Android difference) and how you resolved it — this shows real engineering depth well beyond "I followed a tutorial"

## Common Flutter interview topics worth reviewing

- Flutter fundamentals: the widget tree, StatelessWidget vs. StatefulWidget, the build method's lifecycle
- Dart language features: async/await, null safety, collections
- State management approaches and their trade-offs — being able to compare Provider, Riverpod, and Bloc thoughtfully is a genuinely strong signal
- Firebase integration patterns: authentication, Firestore, push notifications
- Debugging: given a described bug (a memory leak, a rebuild issue), walk through how you'd actually diagnose it

## Live coding and whiteboard sessions

As with any engineering interview, the evaluator generally cares more about your reasoning process than about arriving at a flawless answer instantly. Narrating your thinking clearly — including what you're uncertain about and how you'd verify it — reads far better than working through a problem in silence.`,
            },
          ],
          practice: [],
          submission: { id: 'mob-graduation-capstone-s1', title: 'Submit your capstone mobile application for certification review', instructions: 'Include your source code repository link and a deployment build. Your mentor reviews usability, performance, and production readiness before certification.', requiresLink: true },
          assessment: { id: 'mob-graduation-final', title: '[Mentor Checkpoint] Final Mobile Application Demonstration (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
