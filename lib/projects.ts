import { Project } from "./types";

export const PROJECTS: Project[] = [
  // ─────────────────────────────────────────────────────────────────
  // TIER 1 — Fundamentals
  // ─────────────────────────────────────────────────────────────────
  {
    id: 1,
    slug: "color-flipper",
    name: "Color Flipper",
    tier: 1,
    tierName: "Fundamentals",
    tagline: "Click a button — background becomes a random color. Simple. Powerful.",
    hasLesson: true,
    concepts: [
      {
        id: "variables",
        title: "Variables — const & let",
        explanation:
          "A variable is a named container that holds a value. JavaScript has two modern keywords for this: const and let.\n\nconst means the variable's value (or reference) will never be reassigned — use this by default.\nlet means you plan to reassign the variable later.\n\nYou'll use const for almost everything in this project.",
        examples: [
          {
            label: "Declaring variables",
            code: `const name = "Nabin";   // string
const age  = 25;         // number
const isLearning = true; // boolean

// const cannot be reassigned:
name = "Bob";            // ❌ TypeError

// let CAN be reassigned:
let score = 0;
score = 10;              // ✅ works`,
          },
          {
            label: "Naming rules",
            code: `// ✅ Good names — camelCase for variables
const backgroundColor = "#3498db";
const colorList       = ["red", "blue"];

// ❌ Invalid names
const 1name = "x";      // cannot start with a number
const my-var = "x";     // hyphens not allowed`,
          },
        ],
        keyPoint: "Use const by default. Only reach for let when you know the value will change.",
      },
      {
        id: "arrays",
        title: "Arrays — Ordered Lists",
        explanation:
          "An array stores multiple values in a single variable, in order. Each value has a position called an index — and indexes start at 0, not 1.\n\nYour colors array already exists in app.js. It holds 12 hex color strings you'll pick from randomly.",
        examples: [
          {
            label: "Creating and accessing arrays",
            code: `const fruits = ["apple", "banana", "mango"];
//               index  0        1          2

fruits[0]       // "apple"   ← first item
fruits[2]       // "mango"   ← third item
fruits[10]      // undefined ← doesn't exist

fruits.length   // 3  ← how many items are in the array`,
          },
          {
            label: "Your colors array",
            code: `const colors = [
  "#e74c3c",   // index 0  → red
  "#3498db",   // index 1  → blue
  "#2ecc71",   // index 2  → green
  // ... 9 more colors
];

colors[0]            // "#e74c3c"
colors.length        // 12`,
          },
        ],
        keyPoint: "Arrays are zero-indexed. The first item is always at index [0].",
      },
      {
        id: "functions",
        title: "Functions — Reusable Actions",
        explanation:
          "A function is a named block of code that only runs when you call it. You define it once, then call it as many times as you want.\n\nIn this project you'll write a changeColor function — define it once, then attach it to the button so it runs on every click.",
        examples: [
          {
            label: "Defining and calling a function",
            code: `// Define (write the instructions once)
function sayHello() {
  console.log("Hello!");
}

// Call (run the instructions)
sayHello();   // prints: Hello!
sayHello();   // prints: Hello!  ← runs again`,
          },
          {
            label: "Functions can use variables from outside",
            code: `const greeting = "Hi";

function greet() {
  console.log(greeting);  // can read outer variables
}

greet();  // "Hi"`,
          },
        ],
        keyPoint: "Define once, call many times. Functions are the building blocks of every program.",
      },
      {
        id: "dom",
        title: "The DOM — JavaScript Talks to HTML",
        explanation:
          "DOM stands for Document Object Model. When a browser loads your HTML, it creates a JS-accessible version of every element. You can grab any element by its id attribute, then read or change it.\n\nTwo things you'll do in this project:\n1. Grab the button and the color display element.\n2. Change body.style.backgroundColor to update the page color.",
        examples: [
          {
            label: "Grabbing elements by id",
            code: `// index.html has: <button id="btn">Click Me</button>
// index.html has: <strong id="color-code">#ffffff</strong>

const btn       = document.getElementById("btn");
const colorCode = document.getElementById("color-code");

// If the id doesn't match exactly → returns null
// Check in console: console.log(btn);  // should show the element`,
          },
          {
            label: "Changing content and styles",
            code: `// Change an element's text
colorCode.textContent = "#3498db";

// Change a CSS style via JS
document.body.style.backgroundColor = "#3498db";

// Note: CSS property names become camelCase in JS
// CSS: background-color → JS: backgroundColor
// CSS: font-size        → JS: fontSize`,
          },
        ],
        keyPoint:
          "document.getElementById() returns the element as a JS object. From there you can read and change anything about it.",
      },
      {
        id: "math-random",
        title: "Math.random — Generating Randomness",
        explanation:
          "Math.random() gives a random decimal between 0 (inclusive) and 1 (exclusive). By itself that's useless for picking an array index — so you multiply by the array length, then floor it (round down to a whole number) with Math.floor().",
        examples: [
          {
            label: "How Math.random works",
            code: `Math.random()        // e.g. 0.0, 0.427, 0.999...  (never exactly 1)

// To get a random index for an array of 12 items:
Math.random() * 12   // e.g. 0.0, 5.12, 11.99...
Math.floor(5.12)     // 5  ← always rounds DOWN

// Combined:
Math.floor(Math.random() * 12)  // random whole number: 0 to 11`,
          },
          {
            label: "With your colors array",
            code: `const colors = ["#e74c3c", "#3498db", /* ...10 more */];

const index = Math.floor(Math.random() * colors.length);
//                                       ^^^^^^^^^^^^^^
//                                       use .length so it works
//                                       even if you add more colors

const color = colors[index];   // e.g. "#3498db"`,
          },
        ],
        keyPoint:
          "Always use colors.length (not a hardcoded number) so adding more colors to your array just works.",
      },
      {
        id: "event-listener",
        title: "addEventListener — React to User Actions",
        explanation:
          'addEventListener tells the browser: "watch THIS element, and whenever THIS event happens, run THIS function." The event here is "click".\n\nThe function you pass is called a callback — it doesn\'t run immediately, it runs only when the event fires.',
        examples: [
          {
            label: "Basic syntax",
            code: `const btn = document.getElementById("btn");

// addEventListener(eventName, callbackFunction)
btn.addEventListener("click", changeColor);
//                   ^^^^^^   ^^^^^^^^^^^
//                   event    function to run (no parentheses!)

// ⚠️  Don't write changeColor()  — that would call it immediately
// ✅  Write  changeColor   — pass the reference, let the browser call it`,
          },
          {
            label: "Other useful events",
            code: `// Keyboard events
window.addEventListener("keydown", function(e) {
  if (e.key === " ") {
    changeColor();    // spacebar also changes color (bonus!)
  }
});

// Other common events: "mouseover", "submit", "input", "change"`,
          },
        ],
        keyPoint:
          'Pass the function name WITHOUT parentheses: btn.addEventListener("click", changeColor) not changeColor().',
      },
    ],
    steps: [
      {
        id: "s1",
        title: "Open 01-color-flipper/index.html in your editor",
        hint: "Find the id attributes on the button and the <strong> tag. You'll need these exact strings.",
      },
      {
        id: "s2",
        title: 'In app.js, grab the button: const btn = document.getElementById("btn")',
        hint: 'The id in your HTML is btn — no # here, that\'s CSS syntax. Just the string "btn".',
      },
      {
        id: "s3",
        title: 'Grab the color display: const colorCode = document.getElementById("color-code")',
        hint: "Notice the id has a hyphen: color-code. In HTML ids can have hyphens, but JS variable names can't — that's why we named the variable colorCode (camelCase).",
      },
      {
        id: "s4",
        title: "Look at the colors array already in app.js — it has 12 hex strings",
        hint: "You don't need to change this. Just understand: colors[0] is \"#e74c3c\", colors.length is 12.",
      },
      {
        id: "s5",
        title: "Write the function declaration: function changeColor() { }",
        hint: "Just the empty shell for now. function keyword → name → () → curly braces.",
      },
      {
        id: "s6",
        title: "Inside the function, compute a random index using Math.floor and Math.random",
        hint: "const index = Math.floor(Math.random() * colors.length)",
      },
      {
        id: "s7",
        title: "Get the color at that index: const color = colors[index]",
        hint: "Array indexing — square brackets with the index variable inside.",
      },
      {
        id: "s8",
        title: "Set the background: document.body.style.backgroundColor = color",
        hint: "backgroundColor is camelCase in JS (CSS uses background-color with a hyphen).",
      },
      {
        id: "s9",
        title: "Update the display text: colorCode.textContent = color",
        hint: "textContent sets the text inside an element. You're showing the hex value like #3498db.",
      },
      {
        id: "s10",
        title: 'Outside the function, attach the listener: btn.addEventListener("click", changeColor)',
        hint: "No parentheses after changeColor — you're passing the function reference, not calling it.",
      },
      {
        id: "s11",
        title: "Save app.js. Open index.html in your browser. Click the button — colors should change!",
        hint: "If nothing happens, open DevTools (F12 → Console) and look for red error messages.",
      },
      {
        id: "bonus1",
        title: "BONUS: Make the spacebar also trigger a color change",
        hint: 'window.addEventListener("keydown", function(e) { if (e.key === " ") changeColor(); })',
        isBonus: true,
      },
      {
        id: "bonus2",
        title: "BONUS: Add a copy-to-clipboard button",
        hint: "navigator.clipboard.writeText(color) — add a second button with its own event listener.",
        isBonus: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Projects 2-22: basic info only (lessons added as you progress)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 2, slug: "counter-app", name: "Counter App",
    tier: 1, tierName: "Fundamentals", hasLesson: false,
    tagline: "Increment, decrement, reset — with conditional color changes.",
    concepts: [], steps: [],
  },
  {
    id: 3, slug: "form-validator", name: "Form Validator",
    tier: 1, tierName: "Fundamentals", hasLesson: false,
    tagline: "Real-time validation: empty fields, email format, password match.",
    concepts: [], steps: [],
  },
  {
    id: 4, slug: "tip-calculator", name: "Tip Calculator",
    tier: 1, tierName: "Fundamentals", hasLesson: false,
    tagline: "Bill + tip % + split between people = total per person.",
    concepts: [], steps: [],
  },
  {
    id: 5, slug: "todo-list", name: "Todo List",
    tier: 2, tierName: "Data & Storage", hasLesson: false,
    tagline: "Add, complete, delete, filter — all persisted to localStorage.",
    concepts: [], steps: [],
  },
  {
    id: 6, slug: "expense-tracker", name: "Expense Tracker",
    tier: 2, tierName: "Data & Storage", hasLesson: false,
    tagline: "Track income and expenses with running balance.",
    concepts: [], steps: [],
  },
  {
    id: 7, slug: "quiz-app", name: "Quiz App",
    tier: 2, tierName: "Data & Storage", hasLesson: false,
    tagline: "Multiple choice questions, timer per question, score tracking.",
    concepts: [], steps: [],
  },
  {
    id: 8, slug: "sortable-table", name: "Sortable Table",
    tier: 2, tierName: "Data & Storage", hasLesson: false,
    tagline: "Click table headers to sort data ascending/descending.",
    concepts: [], steps: [],
  },
  {
    id: 9, slug: "weather-app", name: "Weather App",
    tier: 3, tierName: "Async & APIs", hasLesson: false,
    tagline: "Fetch live weather by city from the OpenWeatherMap API.",
    concepts: [], steps: [],
  },
  {
    id: 10, slug: "github-finder", name: "GitHub Finder",
    tier: 3, tierName: "Async & APIs", hasLesson: false,
    tagline: "Search GitHub usernames — show repos, followers, bio.",
    concepts: [], steps: [],
  },
  {
    id: 11, slug: "movie-search", name: "Movie Search",
    tier: 3, tierName: "Async & APIs", hasLesson: false,
    tagline: "Search OMDB API, show results, click for details in a modal.",
    concepts: [], steps: [],
  },
  {
    id: 12, slug: "currency-converter", name: "Currency Converter",
    tier: 3, tierName: "Async & APIs", hasLesson: false,
    tagline: "Fetch live exchange rates, convert between any currencies.",
    concepts: [], steps: [],
  },
  {
    id: 13, slug: "infinite-scroll", name: "Infinite Scroll",
    tier: 4, tierName: "Intermediate", hasLesson: false,
    tagline: "Load images as you scroll using Intersection Observer.",
    concepts: [], steps: [],
  },
  {
    id: 14, slug: "markdown-previewer", name: "Markdown Previewer",
    tier: 4, tierName: "Intermediate", hasLesson: false,
    tagline: "Type markdown, see rendered HTML in real time.",
    concepts: [], steps: [],
  },
  {
    id: 15, slug: "pomodoro-timer", name: "Pomodoro Timer",
    tier: 4, tierName: "Intermediate", hasLesson: false,
    tagline: "Work/break cycles, notifications, session tracking.",
    concepts: [], steps: [],
  },
  {
    id: 16, slug: "kanban-board", name: "Kanban Board",
    tier: 4, tierName: "Intermediate", hasLesson: false,
    tagline: "Drag and drop cards between columns, persist state.",
    concepts: [], steps: [],
  },
  {
    id: 17, slug: "shopping-cart", name: "Shopping Cart",
    tier: 5, tierName: "Advanced", hasLesson: false,
    tagline: "Products, cart logic, quantity, totals — class-based architecture.",
    concepts: [], steps: [],
  },
  {
    id: 18, slug: "chat-interface", name: "Chat Interface",
    tier: 5, tierName: "Advanced", hasLesson: false,
    tagline: "Send/receive messages with timestamps and typing indicator.",
    concepts: [], steps: [],
  },
  {
    id: 19, slug: "paint-app", name: "Paint App",
    tier: 5, tierName: "Advanced", hasLesson: false,
    tagline: "Canvas drawing with color picker, brush size, eraser, export.",
    concepts: [], steps: [],
  },
  {
    id: 20, slug: "data-dashboard", name: "Data Dashboard",
    tier: 5, tierName: "Advanced", hasLesson: false,
    tagline: "Upload CSV, parse it, render charts — full data pipeline.",
    concepts: [], steps: [],
  },
  {
    id: 21, slug: "finance-dashboard", name: "Finance Dashboard",
    tier: 6, tierName: "Capstone", hasLesson: false,
    tagline: "Recurring transactions, categories, charts, budget goals.",
    concepts: [], steps: [],
  },
  {
    id: 22, slug: "code-playground", name: "Code Playground",
    tier: 6, tierName: "Capstone", hasLesson: false,
    tagline: "Write HTML/CSS/JS in three panes, see output live in an iframe.",
    concepts: [], steps: [],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectsByTier(tier: number): Project[] {
  return PROJECTS.filter((p) => p.tier === tier);
}
