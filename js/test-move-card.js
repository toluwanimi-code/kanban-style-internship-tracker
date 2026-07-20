import { createState } from "./state.js";
import { commands } from "./command.js";

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

// Put both cards in the Wishlist column
state.board.columns.wishlist = ["card1", "card2"];

// Create a MOVE_CARD action
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

// Initial state
console.log("=== Initial State ===");
console.log(state.board.columns);
console.log(state.board.cardsById.card2);

// Move the card
commands.MOVE_CARD.do(state, action);

console.log("=== After MOVE_CARD.do() ===");
console.log(state.board.columns);
console.log(state.board.cardsById.card2);

// Undo the move
commands.MOVE_CARD.undo(state, action);

console.log("=== After MOVE_CARD.undo() ===");
console.log(state.board.columns);
console.log(state.board.cardsById.card2);
