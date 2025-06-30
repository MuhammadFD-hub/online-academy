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

  const lessons = [
    {
      course: course,
      titlesAndContents: [
        {
          title: "Introduction to React",
          content:
            "# Introduction to React\n\nReact is a JavaScript library for building user interfaces.\n\n## Why React?\n\n- Component-based\n- Virtual DOM\n- Reusable UI\n\n### Sample Code\n\n```js\nfunction Welcome() {\n  return <h1>Hello, React!</h1>;\n}\n```\n\n🎉 Congratulations on starting with React!",
        },
        {
          title: "JSX and Rendering",
          content:
            "# JSX and Rendering\n\nJSX allows you to write HTML in React.\n\n## Syntax\n\nUse `className` instead of `class`, and close all tags.\n\n### Example\n\n```js\nconst element = <div className=\"box\">Hello!</div>;\nReactDOM.render(element, document.getElementById('root'));\n```\n\n💡 JSX is syntactic sugar for `React.createElement()`.",
        },
        {
          title: "State and Props",
          content:
            "# State and Props\n\nProps are inputs to components, and state is managed within.\n\n## Props Example\n\n```js\nfunction Greet({ name }) {\n  return <h1>Hello, {name}</h1>;\n}\n```\n\n## State Example\n\n```js\nconst [count, setCount] = useState(0);\n```\n\n🧠 Use props to pass data, and state to manage internal data.",
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
