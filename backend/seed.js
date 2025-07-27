// seed.js
const path = require("path");
const mongoose = require("mongoose");
const Course = require("./models/Course"); // adjust the path if needed
const Lesson = require("./models/Lesson");
const User = require("./models/User");
const UserProgress = require("./models/UserProgress");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
let uri = "";
if (!process.env.MONGO_URI) uri = "mongodb://127.0.0.1:27017/online-academy";
else uri = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await Course.deleteMany({});
  await Lesson.deleteMany({});
  await UserProgress.deleteMany({});
  await User.deleteMany({});

  const course = await Course.create({
    title: "React Basics",
    description:
      "Start your journey with React by learning the fundamentals like components, JSX, props, and state management.",
  });

  const course2 = await Course.create({
    title: "React Intermediate",
    description:
      "Take your React skills to the next level by learning hooks, context API, and custom component structures.",
  });

  const course3 = await Course.create({
    title: "React Advanced",
    description:
      "Master advanced React patterns, performance optimizations, and routing for scalable applications.",
  });
  // to give link to heading, add 'user-content-' prefix in the link
  const lessons = [
    {
      course: course,
      titlesAndContents: [
        {
          title: "Introduction to React",
          content:
            "# Getting Started with React\n\n" +
            "React is a JavaScript library for building user interfaces.\n\n" +
            "## Why React?\n\n" +
            "- Component-based\n" +
            "- Virtual DOM\n" +
            "- Reusable UI\n\n" +
            "## Feature Comparison\n\n" +
            "| Feature         | React | jQuery |\n" +
            "|----------------|:-----:|:------:|\n" +
            "| Virtual DOM     | ✅    | ❌     |\n" +
            "| Component-based | ✅    | ❌     |\n" +
            "| Declarative     | ✅    | ❌     |\n\n" +
            "## Sample Code\n\n" +
            "```js\n" +
            "function Welcome() {\n" +
            "  return <h1>Hello, React!</h1>;\n" +
            "}\n" +
            "```\n\n" +
            "🎉 Congratulations on starting with React!\n",
        },
        {
          title: "JSX and Rendering",
          content:
            "# JSX Syntax and Rendering Basics\n\n" +
            "JSX allows you to write HTML in React.\n\n" +
            "## Syntax Reminders\n\n" +
            "- Use `className` instead of `class`\n" +
            "- Close all tags (`<img />`, `<input />`)\n\n" +
            "## Rendering Checklist\n\n" +
            "- [x] Import React\n" +
            "- [x] Create an element\n" +
            "- [x] Render to DOM\n" +
            "- [ ] Add interactivity\n\n" +
            "### Example\n\n" +
            "```js\n" +
            'const element = <div className="box">Hello!</div>;\n' +
            "ReactDOM.render(element, document.getElementById('root'));\n" +
            "```\n\n" +
            "💡 JSX is syntactic sugar for `React.createElement()`.\n\n" +
            "~~Old way: manual DOM updates~~",
        },

        {
          title: "State and Props",
          content:
            "# Understanding State and Props\n\n" +
            "React components rely on two key concepts: **props** and **state**.\n\n" +
            "- 🔽 [Jump to Props](#user-content-props-in-detail)\n" +
            "- 🔽 [Jump to State](#user-content-state-in-detail)\n" +
            "- 🔽 [When to Use What](#user-content-state-vs-props)\n" +
            "- 🔽 [Summary Table](#user-content-summary-table)\n\n" +
            "## Props in Detail\n\n" +
            "<u>Props</u> (short for *properties*) are read-only values passed to components.\n\n" +
            "### Example: Greet Component\n\n" +
            "```js\n" +
            "function Greet({ name }) {\n" +
            "  return <h1>Hello, {name}</h1>;\n" +
            "}\n" +
            "```\n\n" +
            "You can use props like HTML attributes:\n\n" +
            "```js\n" +
            '<Greet name="Alice" />\n' +
            "```\n\n" +
            "They are **immutable** from the child component's perspective.\n\n" +
            "### Prop Usage Guidelines\n\n" +
            "- <mark>Do:</mark> Pass necessary data into child components\n" +
            "- <mark>Don't:</mark> Try to change props inside a child\n\n" +
            "## State in Detail\n\n" +
            "State is used to <mark>manage internal data</mark> that changes over time.\n\n" +
            "### Example: Counter Component\n\n" +
            "```js\n" +
            "const [count, setCount] = useState(0);\n" +
            "```\n\n" +
            "You can then update state like this:\n\n" +
            "```js\n" +
            "<button onClick={() => setCount(count + 1)}>+</button>\n" +
            "```\n\n" +
            "### State Lifecycle\n\n" +
            "- <sub>Initialize:</sub> In the component function\n" +
            "- <sub>Update:</sub> With the setter function\n" +
            "- <sub>Re-render:</sub> Happens automatically on state change\n\n" +
            "## State vs Props\n\n" +
            "- <mark>Props</mark> are passed <u>from parent</u>\n" +
            "- <mark>State</mark> is <u>owned by component</u>\n" +
            "- Changing props doesn’t trigger re-renders in the parent, but changing state does in the same component\n\n" +
            "## Summary Table\n\n" +
            "| Feature     | Props               | State                |\n" +
            "|-------------|----------------------|------------------------|\n" +
            "| Mutability | Immutable            | Mutable               |\n" +
            "| Source     | Parent component     | Inside component      |\n" +
            "| Purpose    | Configuration        | Internal interaction  |\n\n" +
            "## Related Topics\n\n" +
            "- [JSX and Rendering](#user-content-jsx-and-rendering)\n" +
            "- [Conditional Rendering](#user-content-conditional-rendering)\n\n" +
            "## Conditional Rendering\n\n" +
            "You can render different UI based on state:\n\n" +
            "```js\n" +
            "{isLoggedIn ? <Dashboard /> : <Login />}\n" +
            "```\n\n" +
            "React handles re-rendering efficiently when state updates.\n\n" +
            "## JSX and Rendering\n\n" +
            "JSX makes it easier to define UI declaratively.\n\n" +
            "```js\n" +
            "const title = <h2>Welcome!</h2>;\n" +
            "```\n\n" +
            "Combine JSX with state/props for dynamic rendering.\n",
        },
      ],
    },
    {
      course: course2,
      titlesAndContents: [
        {
          title: "Understanding useEffect",
          content:
            '# useEffect Hook\n\nUsed for side effects like data fetching or subscriptions.\n\n## Basic Usage\n\n```js\nuseEffect(() => {\n  console.log("Component mounted");\n}, []);\n```\n\n📌 Don\'t forget to add dependencies!',
        },
        {
          title: "Context API",
          content:
            '# Context API\n\nAvoid prop drilling by using context for global state.\n\n## Setup\n\n```js\nconst ThemeContext = createContext();\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value="dark">\n      <Child />\n    </ThemeContext.Provider>\n  );\n}\n```\n\n👁️ Context is great for themes, auth, and user settings.',
        },
        {
          title: "Custom Hooks",
          content:
            "# Custom Hooks\n\nReuse logic by extracting it into custom hooks.\n\n## Example\n\n```js\nfunction useCounter() {\n  const [count, setCount] = useState(0);\n  const increment = () => setCount(c => c + 1);\n  return { count, increment };\n}\n```\n\n🔁 Custom hooks must start with `use`.",
        },
      ],
    },
    {
      course: course3,
      titlesAndContents: [
        {
          title: "React Router Deep Dive",
          content:
            '# React Router\n\nClient-side navigation without reloading the page.\n\n## Example\n\n```js\n<Routes>\n  <Route path="/" element={<Home />} />\n  <Route path="/about" element={<About />} />\n</Routes>\n```\n\n🧭 Use `useNavigate()` for programmatic navigation.',
        },
        {
          title: "Performance Optimization",
          content:
            "# Performance Optimization\n\nAvoid unnecessary renders using memoization.\n\n## Techniques\n\n- `React.memo`\n- `useMemo`\n- `useCallback`\n\n```js\nconst memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);\n```\n\n⚡ Optimize wisely, not prematurely.",
        },
        {
          title: "Code Splitting and Lazy Loading",
          content:
            "# Code Splitting\n\nSplit code into chunks for better performance.\n\n## Example\n\n```js\nconst About = React.lazy(() => import('./About'));\n\n<Suspense fallback={<div>Loading...</div>}>\n  <About />\n</Suspense>\n```\n\n📦 Lazy load components to reduce bundle size.",
        },
      ],
    },
  ];

  for (const { course, titlesAndContents } of lessons) {
    const lessonDocs = [];
    for (let i = 0; i < titlesAndContents.length; i++) {
      const lesson = await Lesson.create({
        title: titlesAndContents[i].title,
        content: titlesAndContents[i].content.trim(),
        course: course._id,
        order: i + 1,
      });
      lessonDocs.push(lesson._id);
    }
    course.lessons = lessonDocs;
    await course.save();
  }

  console.log("Meaningful dummy data inserted.");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
