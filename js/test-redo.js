import { createState } from "./state.js";
import { dispatch, undo, redo } from "./engine.js";

// ===== Test 1: normal case — dispatch, undo, then redo =====
const state1 = createState();

state1.board.cardsById = {
  card1: {
    id: "card1",
    userId: "user1",
    company: "Google",
    role: "Software Engineer Intern",
    stage: "wishlist",
    createdAt: new Date().toISOString(),
    notes: ""
  },
  card2: {
    id: "card2",
    userId: "user1",
    company: "Meta",
    role: "Frontend Intern",
    stage: "wishlist",
    createdAt: new Date().toISOString(),
    notes: ""
  }
};

state1.board.columns.wishlist = ["card1", "card2"];

const action = {
  type: "MOVE_CARD",
  cardId: "card2",
  from: {
    stage: "wishlist",
    index: 1
  },
  to: {
    stage: "applied",
    index: 0
  }
};

// Build the precondition for redo()
dispatch(state1, action);
undo(state1);

console.log("=== Before redo ===");
console.log("Columns:", state1.board.columns);
console.log("Undo stack length:", state1.undoStack.length);
console.log("Redo stack length:", state1.redoStack.length);

redo(state1);

console.log("=== After redo ===");
console.log("Columns:", state1.board.columns);
console.log("Undo stack length:", state1.undoStack.length);
console.log("Redo stack length:", state1.redoStack.length);
console.log("Undo stack contains same action:", state1.undoStack[0] === action);

console.log(
  "Wishlist contains only card1:",
  JSON.stringify(state1.board.columns.wishlist) === JSON.stringify(["card1"])
);

console.log(
  "Applied contains card2:",
  JSON.stringify(state1.board.columns.applied) === JSON.stringify(["card2"])
);

console.log(
  "Card stage restored:",
  state1.board.cardsById.card2.stage === "applied"
);

console.log(
  "Undo stack has one action:",
  state1.undoStack.length === 1
);

console.log(
  "Redo stack empty:",
  state1.redoStack.length === 0
);

// ===== Test 2: edge case — redo on empty stack =====
const state2 = createState();

console.log("\n=== Test 2: Before redo (empty stack) ===");
console.log("Undo stack length:", state2.undoStack.length);
console.log("Redo stack length:", state2.redoStack.length);

redo(state2);

console.log("=== Test 2: After redo (empty stack) ===");
console.log("Undo stack length:", state2.undoStack.length);
console.log("Redo stack length:", state2.redoStack.length);

console.log(
  "Undo stack still empty:",
  state2.undoStack.length === 0
);

console.log(
  "Redo stack still empty:",
  state2.redoStack.length === 0
);