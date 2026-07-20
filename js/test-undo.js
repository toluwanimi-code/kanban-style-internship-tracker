import { createState } from "./state.js";
import { dispatch, undo } from "./engine.js";

// ===== Test 1: normal case — dispatch, then undo =====
const state1 = createState();

state1.board.cardsById = {
  card1: {
    id: "card1", userId: "user1", company: "Google",
    role: "Software Engineer Intern", stage: "wishlist",
    createdAt: new Date().toISOString(), notes: ""
  },
  card2: {
    id: "card2", userId: "user1", company: "Meta",
    role: "Frontend Intern", stage: "wishlist",
    createdAt: new Date().toISOString(), notes: ""
  }
};

state1.board.columns.wishlist = ["card1", "card2"];

const action = {
  type: "MOVE_CARD",
  cardId: "card2",
  from: { stage: "wishlist", index: 1 },
  to: { stage: "applied", index: 0 }
};

dispatch(state1, action);

console.log("=== Test 1: After dispatch, before undo ===");
console.log("Columns:", state1.board.columns);
console.log("Undo stack length:", state1.undoStack.length);
console.log("Redo stack length:", state1.redoStack.length);

undo(state1);

console.log("=== Test 1: After undo ===");
console.log("Columns:", state1.board.columns);
console.log("Undo stack length:", state1.undoStack.length);
console.log("Redo stack length:", state1.redoStack.length);
console.log("Redo stack contains same action:", state1.redoStack[0] === action);

console.log("Wishlist restored:",
  JSON.stringify(state1.board.columns.wishlist) === JSON.stringify(["card1", "card2"])
);

console.log("Applied empty:",
  state1.board.columns.applied.length === 0
);

console.log("Card stage restored:",
  state1.board.cardsById.card2.stage === "wishlist"
);

console.log("Undo stack empty:",
  state1.undoStack.length === 0
);

console.log("Redo stack has one action:",
  state1.redoStack.length === 1
);

// ===== Test 2: edge case — undo on empty stack =====
const state2 = createState();

console.log("\n=== Test 2: Before undo (empty stack) ===");
console.log("Undo stack length:", state2.undoStack.length);
console.log("Redo stack length:", state2.redoStack.length);

undo(state2);

console.log("=== Test 2: After undo (empty stack) ===");
console.log("Undo stack length:", state2.undoStack.length);
console.log("Redo stack length:", state2.redoStack.length);