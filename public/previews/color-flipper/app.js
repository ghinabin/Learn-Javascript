// ============================================================
//  PROJECT 01 — COLOR FLIPPER
//  Concepts: variables, arrays, functions, DOM, Math.random,
//            addEventListener
// ============================================================


// ── STEP 1: The data ─────────────────────────────────────────
// An array of hex color strings.
// Arrays store multiple values in order. Each item has an
// "index" starting at 0. So colors[0] = "#e74c3c" (red).
const colors = [
  "#e74c3c", "#3498db", "#2ecc71", "#f39c12",
  "#9b59b6", "#1abc9c", "#e67e22", "#e91e63",
  "#00bcd4", "#8bc34a", "#ff5722", "#607d8b",
];


// ── STEP 2: Grab elements from the HTML page ─────────────────
// document.getElementById() searches the page for an element
// with that exact id attribute and returns it as a JS object.
// If the id doesn't match → returns null.
const btn       = document.getElementById("btn");
const colorCode = document.getElementById("color-code");


// ── STEP 3: The function ─────────────────────────────────────
// A function is a reusable block of code.
// We define it once here, then it runs every time the button
// is clicked (attached in Step 4).

function changeColor() {

  // STEP 3a: Pick a random index
  // Math.random() gives a decimal: 0.0 to 0.999...
  // Multiply by colors.length (12) → 0.0 to 11.999...
  // Math.floor() rounds DOWN to a whole number → 0 to 11
  // Result: a random integer that's a valid array index
  const index = Math.floor(Math.random() * colors.length);

  // STEP 3b: Get the color at that index
  // Square-bracket notation accesses an item by its position.
  // e.g. if index = 3, color = "#f39c12" (orange)
  const color = colors[index];

  // STEP 3c: Change the page background color
  // document.body gives us the <body> element.
  // .style lets us change any CSS property via JS.
  // Note: CSS "background-color" becomes camelCase "backgroundColor" in JS.
  document.body.style.backgroundColor = color;

  // STEP 3d: Update the text display to show the hex value
  // .textContent sets the text content inside an element.
  // This updates the <strong id="color-code"> text on the page.
  colorCode.textContent = color;
}


// ── STEP 4: Attach the event listener ───────────────────────
// Tell the browser: "when btn is clicked, run changeColor".
// Important: write changeColor without () — we pass the
// function reference. Writing changeColor() would call it
// immediately instead of waiting for the click.
btn.addEventListener("click", changeColor);


// ── BONUS 1: Spacebar also changes color ─────────────────────
// "keydown" fires when any key is pressed.
// The event object (e) tells us which key: e.key === " " is spacebar.
window.addEventListener("keydown", function(e) {
  if (e.key === " ") {
    e.preventDefault(); // stop the page from scrolling on spacebar
    changeColor();
  }
});


// ── BONUS 2: Copy hex to clipboard on click of color code ────
// navigator.clipboard.writeText() copies a string to the clipboard.
// It returns a Promise, so we use .then() to show feedback after.
colorCode.addEventListener("click", function() {
  const currentColor = colorCode.textContent;

  navigator.clipboard.writeText(currentColor).then(function() {
    // Temporarily show "Copied!" then restore the hex value
    colorCode.textContent = "Copied!";
    setTimeout(function() {
      colorCode.textContent = currentColor;
    }, 1000);
  });

  // Make it look clickable
  colorCode.style.cursor = "pointer";
});
