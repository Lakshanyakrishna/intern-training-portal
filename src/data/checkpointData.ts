import type { CheckpointQuiz } from '../types';

export const checkpointData: Record<string, CheckpointQuiz[]> = {
  git: [
    {
      id: 'git-basics',
      title: 'Git Basics Check',
      questions: [
        {
          q: 'What is Git primarily used for?',
          options: [
            'Social networking for developers',
            'Tracking changes in source code during software development',
            'Hosting static websites',
            'Managing database schemas',
          ],
          answer: 1,
          explanation:
            'Git is a distributed version control system designed to track changes in source code and coordinate work among programmers.',
        },
        {
          q: 'How does GitHub differ from Git?',
          options: [
            'GitHub is a command-line tool and Git is a web service',
            'GitHub is a cloud-based hosting platform for Git repositories, while Git is the version control system itself',
            'GitHub can only host private repositories',
            'Git requires a paid subscription to use',
          ],
          answer: 1,
          explanation:
            'Git is the version control software you run locally, while GitHub is a web platform that hosts Git repositories and adds collaboration features on top.',
        },
        {
          q: 'What does cloning a repository do?',
          options: [
            'Creates a new empty repository on your local machine',
            'Downloads a full copy of a remote repository including all file history',
            'Merges two repositories into one',
            'Archives a repository so it can no longer be modified',
          ],
          answer: 1,
          explanation:
            'Cloning creates a local copy of a remote repository, including all branches, commits, and file history, allowing you to work offline.',
        },
      ],
    },
    {
      id: 'working-with-git',
      title: 'Working with Git',
      questions: [
        {
          q: 'What is the purpose of creating a branch in Git?',
          options: [
            'To permanently delete unwanted code',
            'To create an isolated environment for developing a feature without affecting the main codebase',
            'To duplicate the entire repository for backup',
            'To merge all changes automatically',
          ],
          answer: 1,
          explanation:
            'Branches let you work on features or fixes in isolation so the main branch remains stable until the work is ready to be integrated.',
        },
        {
          q: 'What does the git commit command do?',
          options: [
            'Uploads all files to a remote server',
            'Reverts the repository to a previous state',
            'Records a snapshot of staged changes with a descriptive message',
            'Deletes the current branch',
          ],
          answer: 2,
          explanation:
            'A commit creates a permanent checkpoint of the changes that have been staged, capturing the state of the project at that point in time.',
        },
        {
          q: 'What is the effect of running git push?',
          options: [
            'Downloads the latest changes from the remote repository',
            'Updates the remote branch with commits from your local branch',
            'Switches to a different branch',
            'Creates a new tag for the latest commit',
          ],
          answer: 1,
          explanation:
            'Push uploads your local commits to the remote repository, making them available to collaborators who pull from the same remote.',
        },
      ],
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      questions: [
        {
          q: 'What does git pull do?',
          options: [
            'Deletes all local changes and replaces them with the remote version',
            'Fetches changes from the remote and merges them into your current local branch',
            'Creates a new branch from the latest remote commit',
            'Sends a request to the repository owner for code review',
          ],
          answer: 1,
          explanation:
            'Git pull combines two operations: fetching the latest changes from the remote and then merging those changes into your current branch.',
        },
        {
          q: 'When merging a pull request on GitHub, what happens to the commits from the source branch?',
          options: [
            'They are squashed into a single commit and applied to the target branch',
            'They are deleted after a successful merge',
            'They become part of the target branch history through a merge commit',
            'They remain only on the source branch',
          ],
          answer: 2,
          explanation:
            'When a pull request is merged, the commits from the feature branch are integrated into the target branch via a merge commit, preserving the commit history.',
        },
        {
          q: 'What causes a merge conflict?',
          options: [
            'When two branches have diverged and both modified the same part of the same file',
            'When a repository exceeds its file size limit',
            'When a pull request has no description',
            'When Git cannot authenticate with the remote server',
          ],
          answer: 0,
          explanation:
            'A merge conflict occurs when competing changes are made to the same line of a file in different branches, and Git cannot automatically decide which change to keep.',
        },
      ],
    },
  ],
  deployment: [
    {
      id: 'vercel-fundamentals',
      title: 'Vercel Fundamentals',
      questions: [
        {
          q: 'How does Vercel deploy frontend applications?',
          options: [
            'It requires manual server configuration for each deployment',
            'It automatically builds and deploys from a Git repository with zero-configuration setup',
            'It only supports static HTML files with no build step',
            'It deploys backend servers exclusively',
          ],
          answer: 1,
          explanation:
            'Vercel connects to Git repositories and automatically detects the framework, runs the build command, and deploys the output to a global CDN.',
        },
        {
          q: 'Where should sensitive values like API keys be configured in a Vercel project?',
          options: [
            'In the source code repository under a .env file committed to Git',
            'As environment variables in the Vercel dashboard or CLI',
            'Inside a JSON config file in the public directory',
            'Hardcoded directly in JavaScript files',
          ],
          answer: 1,
          explanation:
            'Environment variables should be configured through Vercel dashboard or CLI to keep secrets out of version control and securely inject them at build and runtime.',
        },
        {
          q: 'What happens during the Vercel build process?',
          options: [
            'The source code is compiled and optimized into static assets or serverless functions ready for deployment',
            'The repository is archived and stored without modification',
            'The code is sent directly to the browser for client-side compilation',
            'A virtual machine is started to run the application continuously',
          ],
          answer: 0,
          explanation:
            'The build process transforms source code into optimized production assets, running the framework build command and generating serverless functions if needed.',
        },
      ],
    },
    {
      id: 'railway-deployment',
      title: 'Railway & Deployment',
      questions: [
        {
          q: 'What type of applications is Railway best suited for deploying?',
          options: [
            'Only static frontend websites',
            'Backend services and full-stack applications with database support',
            'Mobile applications for iOS and Android',
            'Desktop applications for Windows and macOS',
          ],
          answer: 1,
          explanation:
            'Railway specializes in backend and full-stack deployment, offering native support for databases and server-side runtimes.',
        },
        {
          q: 'How does Railway handle environment configuration differently from storing values in code?',
          options: [
            'It requires a .env file to be included in the repository',
            'It provides a dashboard to manage environment variables that are injected securely during deployment',
            'It encrypts environment variables inside the build output',
            'It does not support environment variables at all',
          ],
          answer: 1,
          explanation:
            'Railway dashboard lets you configure environment variables separately from your code, keeping secrets secure and allowing different values per environment.',
        },
        {
          q: 'When a new commit is pushed to a Railway-connected repository, what typically happens?',
          options: [
            'The project must be manually redeployed from the dashboard',
            'Railway automatically triggers a new deployment using the latest code',
            'The commit is ignored and no action is taken',
            'Railway sends a notification but requires approval to deploy',
          ],
          answer: 1,
          explanation:
            'Railway integrates with Git so that every push to the connected branch automatically triggers a fresh deployment of the service.',
        },
      ],
    },
  ],
  supabase: [
    {
      id: 'auth-database',
      title: 'Auth & Database',
      questions: [
        {
          q: 'How does Supabase handle user authentication?',
          options: [
            'It requires developers to build authentication from scratch',
            'It provides built-in authentication with email, social logins, and session management',
            'It only supports passwordless magic link authentication',
            'It stores user credentials in plain text by default',
          ],
          answer: 1,
          explanation:
            'Supabase offers a complete auth system with multiple sign-in methods, automatic session handling, and database integration for user profiles.',
        },
        {
          q: 'What is a Supabase database table?',
          options: [
            'A spreadsheet exported from the dashboard',
            'A structured collection of rows and columns stored in a PostgreSQL database',
            'A JSON file synced with cloud storage',
            'A cache layer for API responses',
          ],
          answer: 1,
          explanation:
            'Supabase tables are PostgreSQL tables, providing relational data storage with SQL querying, constraints, and relationships.',
        },
        {
          q: 'How can developers create tables in Supabase?',
          options: [
            'Only through raw SQL commands in a terminal',
            'Using either the SQL editor or the visual table editor in the dashboard',
            'Tables are created automatically from TypeScript types',
            'By uploading a CSV file with the table schema',
          ],
          answer: 1,
          explanation:
            'Supabase provides both a visual editor for creating tables through a UI and a SQL editor for writing custom table definitions.',
        },
      ],
    },
    {
      id: 'data-security',
      title: 'Data & Security',
      questions: [
        {
          q: 'What does the "U" in CRUD stand for and what operation does it represent?',
          options: [
            'Upload, representing file transfer',
            'Update, representing modifying existing records',
            'Unite, representing joining tables',
            'Undo, representing reverting changes',
          ],
          answer: 1,
          explanation:
            'CRUD stands for Create, Read, Update, Delete, and Update refers to modifying existing records in the database.',
        },
        {
          q: 'What is Row-Level Security in Supabase?',
          options: [
            'A feature that limits the number of rows returned in a query',
            'A policy system that restricts which rows a user can read or write based on user identity',
            'A database indexing strategy for faster queries',
            'A backup system that saves individual rows',
          ],
          answer: 1,
          explanation:
            'Row-Level Security lets you define SQL policies that control access to rows based on the authenticated user, ensuring users only see or modify their own data.',
        },
        {
          q: 'How do CRUD operations interact with Row-Level Security policies?',
          options: [
            'RLS policies override CRUD and block all data modifications',
            'CRUD operations are filtered by RLS policies so users can only perform operations on permitted rows',
            'CRUD operations bypass RLS when executed from the dashboard',
            'RLS only applies to read operations and not to create or delete',
          ],
          answer: 1,
          explanation:
            'RLS policies are enforced on every CRUD operation, so when a user queries or modifies data, the policies filter which rows can be accessed or changed.',
        },
      ],
    },
  ],
  ai: [
    {
      id: 'working-with-ai',
      title: 'Working with AI',
      questions: [
        {
          q: 'What is prompt engineering?',
          options: [
            'The process of writing and refining inputs to AI models to produce desired outputs',
            'A method for training AI models on custom datasets',
            'The practice of designing user interfaces for AI applications',
            'A technique for compiling programming languages',
          ],
          answer: 0,
          explanation:
            'Prompt engineering involves crafting effective instructions for AI models to improve the relevance, accuracy, and usefulness of the generated responses.',
        },
        {
          q: 'Which of the following is the most effective approach when asking an AI to review code?',
          options: [
            'Asking the AI to review all files without providing any context',
            'Providing the specific code snippet along with the programming language and what the code should accomplish',
            'Requesting a review of the entire project without any description',
            'Asking the AI to rewrite the code without explaining the original logic',
          ],
          answer: 1,
          explanation:
            'Giving the AI context about the language, purpose, and specific code to review leads to more focused and actionable feedback.',
        },
        {
          q: 'What is a key limitation of AI code review compared to human code review?',
          options: [
            'AI cannot detect syntax errors',
            'AI lacks understanding of business context, team conventions, and nuanced design trade-offs',
            'AI cannot identify any bugs or security issues',
            'AI code review takes significantly longer than human review',
          ],
          answer: 1,
          explanation:
            'While AI is useful for catching style issues and common bugs, it lacks awareness of project-specific context, business requirements, and the reasoning behind architectural decisions.',
        },
      ],
    },
  ],
  api: [
    {
      id: 'reading-creating-data',
      title: 'Reading & Creating Data',
      questions: [
        {
          q: 'What is the primary purpose of a GET request?',
          options: [
            'To create new resources on the server',
            'To retrieve data from a specified resource without causing side effects',
            'To update an existing resource',
            'To delete a resource from the server',
          ],
          answer: 1,
          explanation:
            'GET requests are used to fetch data from a server and should be idempotent, meaning they do not change the state of the resource.',
        },
        {
          q: 'When would you use a POST request instead of a GET request?',
          options: [
            'When fetching a list of users',
            'When submitting form data to create a new resource on the server',
            'When requesting a static file from the server',
            'When checking if a server is online',
          ],
          answer: 1,
          explanation:
            'POST requests send data to the server to create new resources, making them the appropriate choice for form submissions and resource creation.',
        },
        {
          q: 'How is data typically sent in a POST request?',
          options: [
            'As query parameters appended to the URL',
            'In the request body, often as JSON or form data',
            'In the HTTP headers only',
            'POST requests cannot carry data',
          ],
          answer: 1,
          explanation:
            'Unlike GET requests which append data to the URL, POST requests include data in the request body, allowing for larger and more complex payloads.',
        },
      ],
    },
    {
      id: 'updating-deleting-data',
      title: 'Updating & Deleting Data',
      questions: [
        {
          q: 'What is the difference between a PUT request and a POST request?',
          options: [
            'PUT creates resources and POST updates them',
            'PUT is used to update or replace an existing resource while POST creates new resources',
            'PUT and POST are interchangeable',
            'PUT can only update a single field at a time',
          ],
          answer: 1,
          explanation:
            'PUT is used to update or replace an entire resource, while POST is used to create new resources.',
        },
        {
          q: 'What does a successful DELETE request typically return as a status code?',
          options: [
            '200 OK with the deleted resource data',
            '201 Created',
            '204 No Content',
            '404 Not Found',
          ],
          answer: 2,
          explanation:
            'A successful DELETE request commonly returns a 204 No Content status, indicating the resource was removed and there is no additional content to return.',
        },
        {
          q: 'Why is it important to handle errors when making DELETE requests?',
          options: [
            'DELETE requests always fail on the first attempt',
            'The resource may not exist or the user may not have permission, and the application should handle these responses gracefully',
            'DELETE requests require authentication tokens in every case',
            'The browser automatically retries failed DELETE requests',
          ],
          answer: 1,
          explanation:
            'DELETE requests can fail for various reasons including missing resources or authorization issues, so proper error handling ensures users receive meaningful feedback.',
        },
      ],
    },
  ],
  debugging: [
    {
      id: 'console-devtools',
      title: 'Console & DevTools',
      questions: [
        {
          q: 'What is the benefit of using console.log strategically for debugging?',
          options: [
            'It automatically fixes the bug',
            'It logs variable values and execution flow at specific points to understand program state',
            'It removes all errors from the code',
            'It slows down the application for easier inspection',
          ],
          answer: 1,
          explanation:
            'Strategic console.log statements help developers inspect values and trace code execution to identify where behavior deviates from expectations.',
        },
        {
          q: 'Which browser DevTools panel is most useful for inspecting and modifying CSS styles in real-time?',
          options: ['Console panel', 'Network panel', 'Elements panel', 'Application panel'],
          answer: 2,
          explanation:
            'The Elements panel displays the DOM tree and CSS styles, allowing developers to inspect and edit styles that are then rendered live in the browser.',
        },
        {
          q: 'How can breakpoints set in the Sources panel of DevTools aid debugging?',
          options: [
            'They stop code execution at a specific line so you can inspect variables and step through code line by line',
            'They permanently modify the source code to prevent future errors',
            'They generate a report of all bugs in the application',
            'They automatically revert changes that introduced bugs',
          ],
          answer: 0,
          explanation:
            'Breakpoints pause JavaScript execution at designated lines, letting you examine the call stack, variable values, and continue step-by-step to find the root cause of a bug.',
        },
      ],
    },
    {
      id: 'network-error-tracing',
      title: 'Network & Error Tracing',
      questions: [
        {
          q: 'What information does the Network tab in DevTools provide?',
          options: [
            'A list of all CSS classes used on the page',
            'Details of all HTTP requests made by the page including status, timing, and response data',
            'A map of all JavaScript functions',
            'The memory usage of each browser tab',
          ],
          answer: 1,
          explanation:
            'The Network tab captures every request the page makes, showing response status codes, headers, payloads, and load times, which is essential for debugging API and performance issues.',
        },
        {
          q: 'What is error tracing in software development?',
          options: [
            'The process of drawing diagrams of code structure',
            'Following the chain of function calls and error messages to locate the root cause of a bug',
            'Rewriting all code to prevent any possible error',
            'Deleting code until the error disappears',
          ],
          answer: 1,
          explanation:
            'Error tracing involves systematically following error messages and stack traces through the code to identify the exact location and cause of a failure.',
        },
        {
          q: 'Why is the stack trace useful when debugging errors?',
          options: [
            'It shows the exact line and file where the error occurred along with the sequence of function calls that led to it',
            'It automatically suggests fixes for the error',
            'It lists all variable values at the time of the error',
            'It restarts the application without the error',
          ],
          answer: 0,
          explanation:
            'A stack trace provides a path of function calls from the entry point to where the error was thrown, helping developers pinpoint the origin and propagation of the issue.',
        },
      ],
    },
  ],
  communication: [
    {
      id: 'writing-updates-bugs',
      title: 'Writing Updates & Bugs',
      questions: [
        {
          q: 'What is the most important element of an effective status update?',
          options: [
            'Including every detail of what was done during the day',
            'Clearly stating the current progress, any blockers, and the next steps',
            'Writing the update in a single sentence',
            'Only mentioning completed tasks and ignoring ongoing work',
          ],
          answer: 1,
          explanation:
            'Effective status updates are concise and structured, highlighting progress, obstacles, and planned next steps so stakeholders stay informed.',
        },
        {
          q: 'When reporting a bug, what information is essential for developers to reproduce the issue?',
          options: [
            'A vague description of the problem',
            'Steps to reproduce, expected behavior, actual behavior, and environment details',
            'Only the error message as it appears',
            'The name of the developer who wrote the code',
          ],
          answer: 1,
          explanation:
            'A good bug report includes clear reproduction steps, what was expected versus what happened, and environment context so developers can reliably recreate and fix the issue.',
        },
        {
          q: 'What is a common mistake to avoid when reporting bugs?',
          options: [
            'Including screenshots or screen recordings',
            'Using subjective language like "broken" or "terrible" without describing the specific problem',
            'Listing the steps taken before the bug occurred',
            'Mentioning the affected browser or device',
          ],
          answer: 1,
          explanation:
            'Subjective or emotional language is unhelpful. Bug reports should be objective, factual, and focused on reproducing the technical issue.',
        },
      ],
    },
    {
      id: 'questions-prs',
      title: 'Questions & PRs',
      questions: [
        {
          q: 'What is the best way to ask a technical question in a team chat?',
          options: [
            'Post "Can someone help me?" and wait for responses',
            'Describe what you are trying to accomplish, what you have tried, and the specific problem you encountered',
            'Send a direct message to every team member individually',
            'Ask the question and then immediately ask again if no one responds',
          ],
          answer: 1,
          explanation:
            'Providing context about your goal, steps you have attempted, and the exact issue makes it easy for others to understand and help quickly.',
        },
        {
          q: 'What should a pull request description include?',
          options: [
            'Only the title of the PR',
            'The motivation for the change, a summary of what was done, and any testing instructions or related issues',
            'A list of every file changed without explanation',
            'Personal opinions about the code being replaced',
          ],
          answer: 1,
          explanation:
            'A thorough PR description explains why the change was made, what it does, and how it was tested, enabling reviewers to understand and evaluate the contribution efficiently.',
        },
        {
          q: 'Why is it important to reference related issues in a pull request description?',
          options: [
            'It automatically closes the issue when the PR is merged, providing traceability between the problem and the solution',
            'It increases the number of comments on the PR',
            'It is required by GitHub for all repositories',
            'It adds labels to the pull request automatically',
          ],
          answer: 0,
          explanation:
            'Referencing issues links the PR to the original problem, creating a clear audit trail and automatically closing issues when the fix is merged.',
        },
      ],
    },
  ],
  testing: [
    {
      id: 'testing-mindset',
      title: 'Testing Mindset',
      questions: [
        {
          q: 'What does it mean to have a testing mindset?',
          options: [
            'Assuming code is correct until proven otherwise',
            'Actively looking for ways code could fail and verifying behavior through systematic checks',
            'Relying solely on automated tests without any human verification',
            'Testing only at the end of the development cycle',
          ],
          answer: 1,
          explanation:
            'A testing mindset means thinking critically about code, anticipating edge cases and failures, and verifying that features work as intended through deliberate testing.',
        },
        {
          q: 'What is manual testing?',
          options: [
            'Testing performed by running automated scripts',
            'A human tester interacting with the application to verify functionality and identify issues',
            'Testing that only checks the backend without the user interface',
            'Automated tests written without test cases',
          ],
          answer: 1,
          explanation:
            'Manual testing involves a person using the application as an end user would, exploring features and workflows to find unexpected behavior.',
        },
        {
          q: 'Why should manual testing be done alongside automated testing?',
          options: [
            'Manual testing is faster than automated testing',
            'Manual testing catches usability issues and unexpected interactions that automated tests might miss',
            'Automated testing is optional when manual testing is performed',
            'Manual testing replaces the need for unit tests',
          ],
          answer: 1,
          explanation:
            'Automated tests verify specific logic, but manual testing provides human insight into user experience, visual layout, and edge case interactions that scripts may not cover.',
        },
      ],
    },
    {
      id: 'edge-cases-unit-tests',
      title: 'Edge Cases & Unit Tests',
      questions: [
        {
          q: 'What is an edge case in testing?',
          options: [
            'A common user scenario that happens frequently',
            'An input or condition that occurs at the extreme boundaries of acceptable parameters or unexpected states',
            'The default case in a switch statement',
            'A test that is expensive to run',
          ],
          answer: 1,
          explanation:
            'Edge cases test unusual or extreme inputs, such as empty values, maximum lengths, or boundary conditions, to ensure the code handles them gracefully.',
        },
        {
          q: 'What is a unit test?',
          options: [
            'A test that verifies the entire application workflow end-to-end',
            'A test that isolates and verifies the smallest testable piece of code, typically a single function or method',
            'A test performed manually by a quality assurance team',
            'A test that measures application performance under load',
          ],
          answer: 1,
          explanation:
            'Unit tests focus on individual components in isolation, ensuring each function or module behaves correctly before integration with other parts.',
        },
        {
          q: 'What is the Arrange-Act-Assert pattern used for in unit testing?',
          options: [
            'Organizing files in the project directory',
            'Structuring tests by setting up data, performing the action, and verifying the result',
            'Arranging code alphabetically for readability',
            'Scheduling when tests should run in the pipeline',
          ],
          answer: 1,
          explanation:
            'Arrange-Act-Assert is a common testing pattern where you set up the test data, execute the function being tested, and then verify the outcome matches expectations.',
        },
      ],
    },
    {
      id: 'integration-reporting',
      title: 'Integration & Reporting',
      questions: [
        {
          q: 'How does integration testing differ from unit testing?',
          options: [
            'Integration testing tests how multiple modules or services work together, while unit testing tests individual components in isolation',
            'Integration testing is faster than unit testing',
            'Integration testing does not require test cases',
            'Unit testing tests the full application and integration testing tests single functions',
          ],
          answer: 0,
          explanation:
            'Integration testing verifies that combined modules interact correctly, catching issues that unit tests miss because each component works in isolation.',
        },
        {
          q: 'When filing a bug report that includes integration test failures, what should you include?',
          options: [
            'Only the error message without any additional detail',
            'The failing test name, the assertion that failed, relevant logs, and the environment where the test was run',
            'A request for someone else to fix the bug',
            'A screenshot of the test runner icon without details',
          ],
          answer: 1,
          explanation:
            'A detailed test failure report includes the specific test, the expected versus actual result, logs, and environment context so the issue can be diagnosed quickly.',
        },
        {
          q: 'What is the purpose of a test suite in integration testing?',
          options: [
            'To organize related integration tests into a logical group that runs together with a shared setup and teardown',
            'To replace unit tests entirely',
            'To automatically deploy the application after tests pass',
            'To measure code coverage of manual testing',
          ],
          answer: 0,
          explanation:
            'A test suite groups related integration tests, often sharing configuration, setup, and cleanup logic to keep tests organized and efficient.',
        },
      ],
    },
  ],
  'code-review': [
    {
      id: 'review-principles',
      title: 'Review Principles',
      questions: [
        {
          q: 'What is the primary goal of a code review?',
          options: [
            'To criticize the author coding ability',
            'To improve code quality by catching bugs, ensuring consistency, and sharing knowledge across the team',
            'To approve changes as quickly as possible without reading the code',
            'To rewrite the code in a different style',
          ],
          answer: 1,
          explanation:
            'Code review is a collaborative process focused on finding defects, enforcing standards, and spreading understanding of the codebase among team members.',
        },
        {
          q: 'Why are naming conventions important in code?',
          options: [
            'They make the code run faster',
            'They improve readability and make the purpose of variables, functions, and classes clear to other developers',
            'They are required by all programming languages',
            'They reduce the number of lines of code',
          ],
          answer: 1,
          explanation:
            'Consistent and descriptive naming makes code self-documenting, reducing the cognitive load required to understand what each part of the code does.',
        },
        {
          q: 'How should a reviewer communicate a suggested change during code review?',
          options: [
            'By leaving vague comments like "fix this"',
            'By clearly explaining the issue, why it matters, and suggesting a specific improvement',
            'By making the changes directly without discussion',
            'By rejecting the entire pull request',
          ],
          answer: 1,
          explanation:
            'Effective review comments are specific, constructive, and explain the reasoning behind the suggestion, fostering learning and collaboration.',
        },
      ],
    },
    {
      id: 'code-quality',
      title: 'Code Quality',
      questions: [
        {
          q: 'What makes code maintainable?',
          options: [
            'Using as few comments as possible',
            'Writing clear, modular code with consistent style, meaningful names, and minimal duplication',
            'Putting all logic in a single file for simplicity',
            'Using the shortest possible variable names',
          ],
          answer: 1,
          explanation:
            'Maintainable code is easy to read, modify, and extend, achieved through good structure, clear naming, and following the principle of separation of concerns.',
        },
        {
          q: 'What is a common security vulnerability that code review should catch?',
          options: [
            'Using descriptive variable names',
            'Storing user passwords in plain text or accepting unsanitized user input in database queries',
            'Adding comments to complex logic',
            'Using consistent indentation',
          ],
          answer: 1,
          explanation:
            'Plaintext passwords, SQL injection through unsanitized input, and hardcoded secrets are critical security issues that reviewers should flag.',
        },
        {
          q: 'How does code duplication affect code quality?',
          options: [
            'It improves readability by showing repeated patterns',
            'It increases maintenance burden because a bug fix or update must be applied in multiple places',
            'It has no effect on code quality',
            'It makes the code run faster',
          ],
          answer: 1,
          explanation:
            'Duplicated code multiplies the effort needed for changes and increases the risk of inconsistencies, making the codebase harder to maintain.',
        },
      ],
    },
    {
      id: 'performance-prs',
      title: 'Performance & PRs',
      questions: [
        {
          q: 'What should a developer consider regarding performance during a code review?',
          options: [
            'Performance is never a concern in code reviews',
            'Avoiding unnecessary computations, preventing memory leaks, and considering the efficiency of algorithms and database queries',
            'Only the aesthetics of the code matter',
            'Adding more loops improves performance',
          ],
          answer: 1,
          explanation:
            'Performance-aware reviews look for inefficient operations, excessive resource usage, and opportunities to optimize without sacrificing readability.',
        },
        {
          q: 'What should a reviewer verify about the pull request before approving it?',
          options: [
            'That the code compiles, tests pass, follows project conventions, and addresses the requirements stated in the PR description',
            'That the author has the most commits in the project',
            'That the PR was opened before the deadline',
            'That no comments were left on the PR',
          ],
          answer: 0,
          explanation:
            'Before approval, reviewers should confirm the change is functionally correct, properly tested, follows style guidelines, and fulfills the intended purpose.',
        },
        {
          q: 'What is the recommended size for a pull request to facilitate effective review?',
          options: [
            'A single massive PR containing months of work',
            'Small, focused pull requests that address one concern or feature at a time',
            'PRs should contain exactly one file changed',
            'Size does not matter for code review quality',
          ],
          answer: 1,
          explanation:
            'Small, targeted PRs are easier to review thoroughly, reduce cognitive load on reviewers, and can be merged quickly with lower risk of conflicts.',
        },
      ],
    },
  ],
};
