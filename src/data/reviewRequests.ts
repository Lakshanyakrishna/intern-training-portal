import type { ReviewRequest } from '../types';

export const reviewRequests: ReviewRequest[] = [
  {
    id: 'review-bad-naming',
    title: 'Fix Data Fetching Logic',
    description:
      'A junior developer submitted a PR to fetch user data from an API endpoint. The code works but needs improvement before we can merge it.',
    code: `const a = fetch('/api/users');
a.then(d => console.log(d));
a.catch(e => console.log(e));`,
    issues: [
      'Unclear variable names (a, d, e) make the code hard to read',
      'No error handling beyond logging — the app silently fails',
      'Missing TypeScript types on variables and the response',
    ],
    correctReviews: [
      'Rename variables with descriptive names like "response" or "data" instead of single letters',
      'Add proper error handling with user-facing feedback instead of just console.log',
      'Define TypeScript interfaces for the response data and type the variables',
    ],
    options: [
      'Rename variables with descriptive names like "response" or "data" instead of single letters',
      'Add proper error handling with user-facing feedback instead of just console.log',
      'Define TypeScript interfaces for the response data and type the variables',
      'Replace fetch with XMLHttpRequest for better browser support',
      'Add more console.log statements throughout the function',
      'Remove the catch block since errors are rare in production',
    ],
    xpReward: 25,
  },
  {
    id: 'review-sql-injection',
    title: 'User Lookup Query',
    description:
      'A PR for a user lookup endpoint that takes a userId from the URL parameters and queries the database. Security review is required.',
    code: `app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ' + userId;
  db.run(query, (err, row) => {
    res.json(row);
  });
});`,
    issues: [
      'String concatenation with user input opens the door to SQL injection attacks',
      'No validation or sanitization of the userId input parameter',
      'Should use parameterized queries or an ORM to safely bind variables',
    ],
    correctReviews: [
      'Use parameterized queries instead of string concatenation to prevent SQL injection',
      'Validate and sanitize the userId input before passing it to the database',
      'Replace raw string building with parameterized placeholders like ? or $1',
    ],
    options: [
      'Use parameterized queries instead of string concatenation to prevent SQL injection',
      'Validate and sanitize the userId input before passing it to the database',
      'Replace raw string building with parameterized placeholders like ? or $1',
      'Add a try-catch block around the query execution',
      'Use an arrow function for the route handler instead of a regular function',
      'Move the SQL query string into a separate constants file',
    ],
    xpReward: 35,
  },
  {
    id: 'review-hardcoded-creds',
    title: 'API Service Integration',
    description:
      'PR that adds a new payment processing service. The code integrates with Stripe and was pushed directly to the main branch.',
    code: `const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const apiKey = process.env.GOOGLE_API_KEY;

app.post('/charge', (req, res) => {
  stripe.charges.create({ amount: 2000, currency: 'usd', source: req.body.token });
});`,
    issues: [
      'Hardcoded secret API keys will be exposed in the source repository',
      'Live keys committed to code risk unauthorized usage if the repo is breached',
      'Secrets should be loaded from environment variables, not written inline',
    ],
    correctReviews: [
      'Remove hardcoded keys and load them from environment variables via process.env',
      'Never commit live/ production secrets to version control — use a .env file',
      'Rotate the exposed keys immediately since they are now compromised',
    ],
    options: [
      'Remove hardcoded keys and load them from environment variables via process.env',
      'Never commit live/ production secrets to version control — use a .env file',
      'Rotate the exposed keys immediately since they are now compromised',
      'Use const instead of require for importing the Stripe library',
      'Add console.log to verify the keys are loaded correctly',
      'Move the keys to a separate config file and commit it as a backup',
    ],
    xpReward: 35,
  },
  {
    id: 'review-memory-leak',
    title: 'Real-Time Dashboard Component',
    description:
      'A React component that polls a dashboard API every 5 seconds to display live metrics. The component is used across multiple pages.',
    code: `function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setInterval(() => {
      fetch('/api/dashboard')
        .then(res => res.json())
        .then(setData);
    }, 5000);
  });

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`,
    issues: [
      'Missing cleanup function causes a memory leak — intervals continue after unmount',
      'No dependency array means the effect runs on every render, spawning more intervals',
      'The component does not abort the fetch if it unmounts before the request completes',
    ],
    correctReviews: [
      'Return a cleanup function from useEffect that clears the interval with clearInterval',
      'Add a dependency array ([]) so the effect only runs once on mount',
      'Use an AbortController or a mounted flag to prevent state updates after unmount',
    ],
    options: [
      'Return a cleanup function from useEffect that clears the interval with clearInterval',
      'Add a dependency array ([]) so the effect only runs once on mount',
      'Use an AbortController or a mounted flag to prevent state updates after unmount',
      'Replace fetch with axios for better browser compatibility',
      'Move the useState call inside the useEffect for cleaner code',
      'Increase the interval to 10 seconds to reduce API load',
    ],
    xpReward: 30,
  },
  {
    id: 'review-list-performance',
    title: 'User List Rendering',
    description:
      'PR that renders a list of users from an API. The component is inside a frequently re-rendering parent with search filters.',
    code: `function UserList({ users, onSelect }) {
  return (
    <div>
      {users.map(user => (
        <div onClick={() => onSelect(user.id)}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}`,
    issues: [
      'Missing key prop on list items hurts React diffing performance and causes bugs',
      'Inline arrow function in onClick creates a new function on every render',
      'No memoization means the entire list re-renders when parent state changes',
    ],
    correctReviews: [
      'Add a unique key prop to each list item, ideally using user.id',
      'Extract the onClick handler to avoid creating new functions on every render',
      'Wrap the component in React.memo or use useMemo to skip unnecessary re-renders',
    ],
    options: [
      'Add a unique key prop to each list item, ideally using user.id',
      'Extract the onClick handler to avoid creating new functions on every render',
      'Wrap the component in React.memo or use useMemo to skip unnecessary re-renders',
      'Replace divs with semantic HTML like <ul> and <li>',
      'Add a CSS class to the container div for styling',
      'Use a for loop instead of .map for better performance',
    ],
    xpReward: 25,
  },
];
