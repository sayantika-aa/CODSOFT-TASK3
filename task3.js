const displayCurrent = document.getElementById("current");
const displayHistory = document.getElementById("history");
const keys = document.querySelector(".keys");

let state = {
  current: "0",
  previous: null,
  operator: null,
  justEvaluated: false
};

function updateDisplay() {
  displayCurrent.textContent = state.current;
  displayHistory.textContent =
    state.previous !== null && state.operator && !state.justEvaluated
      ? `${state.previous} ${symbol(state.operator)} ${state.current !== "0" ? state.current : ""}`
      : "";
}

function symbol(op) {
  return { add: "+", subtract: "−", multiply: "×", divide: "÷" }[op];
}

function inputDigit(d) {
  if (state.justEvaluated) {
    state.current = d;
    state.justEvaluated = false;
    return;
  }
  state.current = state.current === "0" ? d : state.current + d;
}

function inputDecimal() {
  if (!state.current.includes(".")) state.current += ".";
}

function clearAll() {
  state = { current: "0", previous: null, operator: null, justEvaluated: false };
}

function toggleSign() {
  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : "-" + state.current;
}

function percent() {
  state.current = (parseFloat(state.current) / 100).toString();
}

function setOperator(op) {
  if (state.previous !== null && !state.justEvaluated) equals();
  state.previous = state.current;
  state.operator = op;
  state.current = "0";
  state.justEvaluated = false;
}

function compute(a, b, op) {
  a = parseFloat(a); b = parseFloat(b);
  if (op === "add") return a + b;
  if (op === "subtract") return a - b;
  if (op === "multiply") return a * b;
  if (op === "divide") return b === 0 ? "Error" : a / b;
}

function equals() {
  if (!state.operator || state.previous === null) return;
  displayHistory.textContent = `${state.previous} ${symbol(state.operator)} ${state.current} =`;
  const result = compute(state.previous, state.current, state.operator);
  state.current = result.toString();
  state.previous = null;
  state.operator = null;
  state.justEvaluated = true;
}

keys.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.digit) inputDigit(btn.dataset.digit);
  else if (btn.dataset.action === "decimal") inputDecimal();
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "sign") toggleSign();
  else if (btn.dataset.action === "percent") percent();
  else if (["add","subtract","multiply","divide"].includes(btn.dataset.action)) setOperator(btn.dataset.action);
  else if (btn.dataset.action === "equals") equals();

  updateDisplay();
});

updateDisplay();
