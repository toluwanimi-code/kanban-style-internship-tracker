import { createState } from "./state.js";
import { commands } from "./command.js";

// ===== Test 1: DELETE_CARD do() then undo() =====
const state = createState();

const card = {
  id: "card1",
  userId: "user1",
  company: "Google",
  role: "Software Engineer Intern",
  stage: "wishlist",
  createdAt: new Date().toISOString(),
  notes: ""
};

state.board.cardsById[card.id] = card;
state.board.columns.wishlist.push(card.id);

const action = {
  type: "DELETE_CARD",
  card,
  index: 0
};

console.log("=== Before DELETE_CARD ===");
console.log("cardsById:", state.board.cardsById);
console.log("Wishlist:", state.board.columns.wishlist);

// Apply the command
commands.DELETE_CARD.do(state, action);

console.log("=== After do() ===");
console.log("cardsById:", state.board.cardsById);
console.log("Wishlist:", state.board.columns.wishlist);

console.log(
  "Card removed from cardsById:",
  !(card.id in state.board.cardsById)
);

console.log(
  "Wishlist empty:",
  state.board.columns.wishlist.length === 0
);

console.log(
  "Card id removed from wishlist:",
  !state.board.columns.wishlist.includes(card.id)
);

// Undo the command
commands.DELETE_CARD.undo(state, action);

console.log("=== After undo() ===");
console.log("cardsById:", state.board.cardsById);
console.log("Wishlist:", state.board.columns.wishlist);

console.log(
  "Card restored to cardsById:",
  state.board.cardsById[card.id] === card
);

console.log(
  "Card restored to wishlist:",
  JSON.stringify(state.board.columns.wishlist) === JSON.stringify(["card1"])
);

console.log(
  "Card restored at index 0:",
  state.board.columns.wishlist[0] === "card1"
);

console.log(
  "Wishlist contains one card:",
  state.board.columns.wishlist.length === 1
);