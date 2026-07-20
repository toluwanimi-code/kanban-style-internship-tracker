import { createState } from "./state.js";
import { dispatch } from "./engine.js";

// Create a fresh state
const state = createState();

// Add two fake cards
state.board.cardsById = {
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

// Place both cards in the Wishlist column
state.board.columns.wishlist = ["card1", "card2"];

// Seed the redo stack with a fake action
state.redoStack.push({
  type: "FAKE_ACTION"
});

// The real action we'll dispatch
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

console.log("=== Before dispatch ===");
console.log("Columns:", state.board.columns);
console.log("Undo stack length:", state.undoStack.length);
console.log("Redo stack length:", state.redoStack.length);

// Dispatch the action
dispatch(state, action);

console.log("=== After dispatch ===");
console.log("Columns:", state.board.columns);
console.log("Undo stack length:", state.undoStack.length);
console.log("Redo stack length:", state.redoStack.length);
console.log("Undo stack contains same action:", state.undoStack[0] === action);