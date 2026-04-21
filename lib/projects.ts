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
    previewPath: "/previews/color-flipper/index.html",
    hasLesson: true,
    concepts: [
      {
        id: "variables",
        title: "Variables — const & let",
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const",
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
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
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
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
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
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById",
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
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random",
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
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
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
        title: "Open 01-color-flipper/ in your editor — look at index.html and app.js",
        hint: "Find the id attributes on the button and the <strong> tag. You'll need these exact strings.",
      },
      {
        id: "s2",
        title: 'In app.js, grab the button: const btn = document.getElementById("btn")',
        hint: 'The id in your HTML is btn — no # here, that\'s CSS syntax. Just the string "btn".',
        relatedConceptIds: ["variables", "dom"],
      },
      {
        id: "s3",
        title: 'Grab the color display: const colorCode = document.getElementById("color-code")',
        hint: "Notice the id has a hyphen: color-code. In HTML ids can have hyphens, but JS variable names can't — that's why we named the variable colorCode (camelCase).",
        relatedConceptIds: ["variables", "dom"],
      },
      {
        id: "s4",
        title: "Look at the colors array already in app.js — it has 12 hex strings",
        hint: 'You don\'t need to change this. Just understand: colors[0] is "#e74c3c", colors.length is 12.',
        relatedConceptIds: ["arrays"],
      },
      {
        id: "s5",
        title: "Write the function declaration: function changeColor() { }",
        hint: "Just the empty shell for now. function keyword → name → () → curly braces.",
        relatedConceptIds: ["functions"],
      },
      {
        id: "s6",
        title: "Inside the function, compute a random index using Math.floor and Math.random",
        hint: "const index = Math.floor(Math.random() * colors.length)",
        relatedConceptIds: ["math-random", "arrays"],
      },
      {
        id: "s7",
        title: "Get the color at that index: const color = colors[index]",
        hint: "Array indexing — square brackets with the index variable inside.",
        relatedConceptIds: ["arrays"],
      },
      {
        id: "s8",
        title: "Set the background: document.body.style.backgroundColor = color",
        hint: "backgroundColor is camelCase in JS (CSS uses background-color with a hyphen).",
        relatedConceptIds: ["dom"],
      },
      {
        id: "s9",
        title: "Update the display text: colorCode.textContent = color",
        hint: "textContent sets the text inside an element. You're showing the hex value like #3498db.",
        relatedConceptIds: ["dom"],
      },
      {
        id: "s10",
        title: 'Outside the function, attach the listener: btn.addEventListener("click", changeColor)',
        hint: "No parentheses after changeColor — you're passing the function reference, not calling it.",
        relatedConceptIds: ["event-listener"],
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
        relatedConceptIds: ["event-listener"],
      },
      {
        id: "bonus2",
        title: "BONUS: Add a copy-to-clipboard button",
        hint: "navigator.clipboard.writeText(color) — add a second button with its own event listener.",
        isBonus: true,
      },
    ],
    setupInfo: {
      folder: "01-color-flipper",
      htmlSnippet: `<strong id="color-code">#ffffff</strong>\n<button id="btn">Click Me</button>`,
      jsScaffold: `const colors = [\n  "#e74c3c", "#3498db", "#2ecc71", "#f39c12",\n  "#9b59b6", "#1abc9c", "#e67e22", "#e91e63",\n  "#00bcd4", "#8bc34a", "#ff5722", "#607d8b",\n];\n\n// ↑ Already written for you. Write everything below.`,
    },
  },

  // ─────────────────────────────────────────────────────────────────
  // Projects 2-22: basic info only (lessons added as you progress)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 2,
    slug: "counter-app",
    name: "Counter App",
    tier: 1,
    tierName: "Fundamentals",
    hasLesson: true,
    tagline: "Increment, decrement, reset — with conditional color changes.",
    previewPath: "/previews/counter-app/index.html",
    concepts: [
      {
        id: "let-mutable",
        title: "let — Mutable Variables",
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let",
        explanation:
          "In Project 01, everything was const. Here you need a variable whose value changes every time a button is clicked. const would throw an error the moment you tried to reassign it.\n\nlet declares a variable that CAN be reassigned later. Use it when you know the value will change — like a score, a toggle state, or a counter.\n\nThe rule of thumb: start with const. If you get an assignment error, switch to let.",
        examples: [
          {
            label: "const vs let",
            code: `// const — value can never change
const name = "Nabin";
name = "Bob";       // ❌ TypeError: Assignment to constant variable

// let — value CAN change
let count = 0;
count = count + 1;  // ✅ now count is 1
count += 1;         // ✅ shorthand — now count is 2
count++;            // ✅ increment shorthand — now count is 3`,
          },
        ],
        keyPoint: "Use const by default; only reach for let when the value genuinely needs to change.",
        whyItMatters: "Your count variable changes on every button click — const would crash the app.",
        commonMistake: "Using let for everything 'to be safe.' Overusing let makes it harder to read code — you can't tell at a glance what's meant to change.",
      },
      {
        id: "if-else",
        title: "if / else — Conditional Logic",
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else",
        explanation:
          "The counter needs to show different colors depending on the value. That decision — 'if positive do X, if negative do Y, otherwise do Z' — is if/else.\n\nAn if statement runs a block of code only when a condition is true. else if chains additional conditions. else is the fallback when nothing above matched.\n\nJavaScript evaluates the condition between the (). Numbers: 0 is falsy, everything else is truthy. Comparison operators (>, <, ===) produce true or false.",
        examples: [
          {
            label: "if / else if / else",
            code: `let count = -3;

if (count > 0) {
  console.log("positive");   // skipped
} else if (count < 0) {
  console.log("negative");   // ← runs this
} else {
  console.log("zero");       // skipped
}`,
          },
          {
            label: "Common mistake: = vs ===",
            code: `// ❌ Assignment inside condition — always falsy!
if (count = 0) { ... }

// ✅ Comparison
if (count === 0) { ... }
if (count > 0)  { ... }
if (count < 0)  { ... }`,
          },
        ],
        keyPoint: "=== checks equality; = assigns. In a condition, you almost always want ===, >, or <.",
        whyItMatters: "Without if/else, you can't change the number color based on whether it's positive or negative.",
        commonMistake: "Using = (assignment) instead of === (comparison) inside conditions: if (count = 0) always sets count to 0.",
      },
      {
        id: "function-syntax",
        title: "Three Ways to Write a Function",
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
        explanation:
          "JavaScript has three common function syntaxes. They all define reusable code, but have small differences in hoisting.\n\nFunction declarations are hoisted — you can call them before the line where they're defined. Function expressions and arrow functions are not hoisted.\n\nFor Tier 1, the practical rule: all three are called identically, so pick the style that reads cleanest.",
        examples: [
          {
            label: "All three forms",
            code: `// 1. Function DECLARATION — hoisted
function increment() {
  count++;
  updateDisplay();
}

// 2. Function EXPRESSION — stored in a variable
const decrement = function() {
  count--;
  updateDisplay();
};

// 3. Arrow function — compact, modern
const reset = () => {
  count = 0;
  updateDisplay();
};

// All three are called identically:
increment();
decrement();
reset();`,
          },
        ],
        keyPoint: "Pass function references to addEventListener — no parentheses. increment is a reference; increment() is a call.",
        whyItMatters: "You'll see all three forms in real codebases. This project intentionally uses one of each so you recognise them.",
        commonMistake: "Writing btn.addEventListener('click', increment()) with parentheses. The () calls the function immediately instead of passing it as a callback.",
      },
      {
        id: "classlist",
        title: "classList — Adding and Removing CSS Classes",
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Element/classList",
        explanation:
          "Changing colors with element.style.color = 'red' works but mixes styling into JavaScript. The cleaner approach: define .positive and .negative classes in CSS, then toggle them with classList. The CSS stays in CSS.\n\nEvery DOM element has a classList property — a live list of its CSS classes. You can add, remove, toggle, and check for classes using its methods.\n\nThe key pattern: before adding a new class, remove all conflicting classes first.",
        examples: [
          {
            label: "classList methods",
            code: `const el = document.getElementById("count");

el.classList.add("positive");          // adds the class
el.classList.remove("negative");       // removes (no error if absent)
el.classList.toggle("active");         // adds if absent, removes if present
el.classList.contains("positive");     // → true / false`,
          },
          {
            label: "The pattern used in this project",
            code: `// Always remove both first, then add the right one
el.classList.remove("positive", "negative");

if (count > 0)      el.classList.add("positive");
else if (count < 0) el.classList.add("negative");
// else zero → both removed, default white color`,
          },
        ],
        keyPoint: "Always remove conflicting classes before adding a new one.",
        whyItMatters: "classList keeps style decisions in CSS where they belong, and makes it easy to swap styles without touching the stylesheet.",
        commonMistake: "Forgetting to remove the old class before adding the new one. The element accumulates classes: class='positive negative' — both green and red rules apply.",
      },
      {
        id: "update-display",
        title: "The updateDisplay Pattern — Single Source of Truth",
        mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
        explanation:
          "If you update the DOM in three places (inside increment, decrement, reset), you'll forget to update one of them later. One function that syncs everything is safer and easier to extend.\n\nThis is a mini architecture decision: state (the count variable) is separate from presentation (what the screen shows). You change state first, then call one function to bring the display in sync. This pattern scales to much larger apps.",
        examples: [
          {
            label: "State + display separation",
            code: `let count = 0;

function updateDisplay() {
  countEl.textContent = count;           // sync text

  countEl.classList.remove("positive", "negative");
  if (count > 0)      countEl.classList.add("positive");
  else if (count < 0) countEl.classList.add("negative");
}

function increment() {
  count++;           // 1. change state
  updateDisplay();   // 2. sync display
}

function decrement() {
  count--;
  updateDisplay();
}

function reset() {
  count = 0;
  updateDisplay();
}`,
          },
        ],
        keyPoint: "Change the variable, then call one update function. Never update the DOM in multiple places for the same piece of state.",
        whyItMatters: "This is the foundation of every UI framework (React, Vue, Angular). You're learning it manually first so the concept is crystal clear.",
        commonMistake: "Setting countEl.textContent directly inside each button handler instead of going through updateDisplay.",
      },
    ],
    steps: [
      {
        id: "s1",
        title: "Open 02-counter-app/index.html — find the ids: count, btn-increment, btn-decrement, btn-reset",
        hint: "Look at the id attributes on each element. You'll use these exact strings in getElementById.",
      },
      {
        id: "s2",
        title: "In app.js, the starter already has let count = 0 — understand why let, not const",
        hint: "count will change on every button click. const would throw TypeError on reassignment.",
        commonError: "Changing let to const 'by habit' — the app will crash the moment you click a button.",
        relatedConceptIds: ["let-mutable"],
      },
      {
        id: "s3",
        title: "Grab all four DOM elements with getElementById: countEl, btnIncrement, btnDecrement, btnReset",
        hint: "const countEl = document.getElementById('count') — repeat for each button using their ids.",
        relatedConceptIds: ["let-mutable"],
      },
      {
        id: "s4",
        title: "Write function updateDisplay() — set countEl.textContent = count",
        hint: "Just the text update for now: countEl.textContent = count. JavaScript coerces the number to a string automatically.",
        commonError: "Forgetting that textContent sets a string — but count is a number. Don't worry, JS coerces it automatically.",
        relatedConceptIds: ["update-display"],
      },
      {
        id: "s5",
        title: "Inside updateDisplay, add the classList logic: remove both classes, then conditionally add one",
        hint: "countEl.classList.remove('positive', 'negative') — then if (count > 0) add positive, else if (count < 0) add negative.",
        commonError: "Adding without removing first → both classes stack up. Always remove both before adding one.",
        relatedConceptIds: ["classlist", "if-else"],
      },
      {
        id: "s6",
        title: "Write function increment() as a function declaration — add 1 to count, then call updateDisplay()",
        hint: "count++ or count += 1, then updateDisplay(). Change state first, then sync the display.",
        commonError: "Updating countEl.textContent directly instead of going through updateDisplay.",
        relatedConceptIds: ["function-syntax", "update-display", "let-mutable"],
      },
      {
        id: "s7",
        title: "Write const decrement as a function expression — subtract 1, call updateDisplay()",
        hint: "const decrement = function() { count--; updateDisplay(); };  — notice the semicolon after the closing }.",
        commonError: "Missing the semicolon after the closing } of a function expression.",
        relatedConceptIds: ["function-syntax", "update-display"],
      },
      {
        id: "s8",
        title: "Write const reset as an arrow function — set count to 0, call updateDisplay()",
        hint: "const reset = () => { count = 0; updateDisplay(); };",
        relatedConceptIds: ["function-syntax", "update-display"],
      },
      {
        id: "s9",
        title: "Attach all three event listeners to their buttons",
        hint: "btnIncrement.addEventListener('click', increment) — no parentheses after the function name!",
        commonError: "Writing increment() with parentheses — that calls the function immediately instead of passing it as a callback.",
        relatedConceptIds: ["function-syntax"],
      },
      {
        id: "s10",
        title: "Call updateDisplay() once at the bottom of the file to set the initial state",
        hint: "Without this, the DOM won't reflect count = 0 until a button is clicked.",
        relatedConceptIds: ["update-display"],
      },
      {
        id: "s11",
        title: "Open index.html in your browser — test all three buttons. Check DevTools console if nothing works.",
        hint: "F12 → Console tab. Red error messages show exactly what went wrong and on which line.",
      },
      {
        id: "bonus1",
        title: "BONUS: Add keyboard shortcuts — ArrowUp increments, ArrowDown decrements, R resets",
        hint: "window.addEventListener('keydown', (e) => { if (e.key === 'ArrowUp') increment(); else if (e.key === 'ArrowDown') decrement(); else if (e.key === 'r') reset(); })",
        isBonus: true,
        relatedConceptIds: ["function-syntax"],
      },
      {
        id: "bonus2",
        title: "BONUS: Add a min/max limit (e.g. −10 to 10) — disable buttons at the boundary",
        hint: "Check the value before changing it: if (count < 10) { count++; updateDisplay(); }. Also set btnIncrement.disabled = count >= 10 inside updateDisplay.",
        isBonus: true,
        relatedConceptIds: ["if-else"],
      },
      {
        id: "bonus3",
        title: "BONUS: Add a step-size input — instead of always ±1, use whatever number the user types",
        hint: "const step = parseInt(stepInput.value) || 1 — then use count += step inside increment.",
        isBonus: true,
        relatedConceptIds: ["let-mutable"],
      },
    ],
    setupInfo: {
      folder: "02-counter-app",
      htmlSnippet: `<h1 id="count">0</h1>\n<button id="btn-decrement">−</button>\n<button id="btn-reset">Reset</button>\n<button id="btn-increment">+</button>`,
      jsScaffold: `let count = 0;\n\n// ↑ Already written for you. Write everything below.`,
    },
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

export function getAdjacentProjects(slug: string): { prev: Project | null; next: Project | null } {
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? PROJECTS[idx - 1] : null,
    next: idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null,
  };
}

export function getTierPosition(slug: string): { position: number; total: number } {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { position: 0, total: 0 };
  const tierProjects = PROJECTS.filter((p) => p.tier === project.tier);
  return {
    position: tierProjects.findIndex((p) => p.slug === slug) + 1,
    total: tierProjects.length,
  };
}
