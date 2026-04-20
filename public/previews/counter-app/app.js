// ============================================================
//  PROJECT 02 — COUNTER APP
//  Concepts: let (mutable state), if/else, functions (3 types),
//            classList, textContent, multiple event listeners
// ============================================================


// ── STEP 1: State ────────────────────────────────────────────
// We use `let` here (not const) because this value WILL change.
// This single variable IS the app's state — the source of truth.
let count = 0;


// ── STEP 2: Grab DOM elements ─────────────────────────────────
const countEl      = document.getElementById("count");
const btnIncrement = document.getElementById("btn-increment");
const btnDecrement = document.getElementById("btn-decrement");
const btnReset     = document.getElementById("btn-reset");


// ── STEP 3: updateDisplay — one function that syncs DOM to state
// Every time count changes, call this to keep the screen in sync.
// This pattern (change state → call update) avoids bugs where the
// display and the variable fall out of step.

function updateDisplay() {

  // Update the visible number
  countEl.textContent = count;

  // CONDITIONALS — if/else checks the value of count:
  // • positive (> 0) → add "positive" class (green)
  // • negative (< 0) → add "negative" class (red)
  // • zero (=== 0)   → remove both classes (white)
  //
  // classList.remove() does nothing if the class isn't there —
  // so it's safe to always remove both before adding the right one.
  countEl.classList.remove("positive", "negative");

  if (count > 0) {
    countEl.classList.add("positive");
  } else if (count < 0) {
    countEl.classList.add("negative");
  }
  // else count === 0: no class needed, colour stays white

  // BONUS: brief scale-up animation on every change
  countEl.classList.remove("bump");
  // Force reflow so removing then re-adding the class actually fires
  void countEl.offsetWidth;
  countEl.classList.add("bump");
}


// ── STEP 4: Three action functions ───────────────────────────
// Three ways to declare a function in JS — all three work the
// same way here; pick whichever style you prefer.

// 1. Function DECLARATION — hoisted, available before this line
function increment() {
  count = count + 1;   // same as count += 1  or  count++
  updateDisplay();
}

// 2. Function EXPRESSION — stored in a const, not hoisted
const decrement = function() {
  count = count - 1;
  updateDisplay();
};

// 3. Arrow function — compact, modern syntax
const reset = () => {
  count = 0;
  updateDisplay();
};


// ── STEP 5: Attach event listeners ───────────────────────────
// Each button gets its own listener and its own callback.
btnIncrement.addEventListener("click", increment);
btnDecrement.addEventListener("click", decrement);
btnReset.addEventListener("click", reset);


// ── BONUS: Keyboard shortcuts ─────────────────────────────────
// Arrow Up / Arrow Down / R key for power users
window.addEventListener("keydown", function(e) {
  if (e.key === "ArrowUp")   increment();
  if (e.key === "ArrowDown") decrement();
  if (e.key === "r" || e.key === "R") reset();
});
