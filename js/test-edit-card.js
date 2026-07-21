import { createState } from "./state.js";
import { commands } from "./command.js";

// ===== Test 1: EDIT_CARD do() then undo() =====
const state = createState();

const card = {
  id: "card1",
  userId: "user1",
  company: "Google",
  role: "Software Engineer Intern",
  stage: "wishlist",
  createdAt: new Date().toISOString(),
  notes: "Applied through referral"
};

state.board.cardsById[card.id] = card;
state.board.columns.wishlist.push(card.id);

const action = {
  type: "EDIT_CARD",
  cardId: card.id,
  before: {
    notes: "Applied through referral"
  },
  after: {
    notes: "Applied through company website"
  }
};

console.log("=== Before EDIT_CARD ===");
console.log("Card:", state.board.cardsById[card.id]);
console.log("Wishlist:", state.board.columns.wishlist);

// Apply the edit
commands.EDIT_CARD.do(state, action);

console.log("=== After do() ===");
console.log("Card:", state.board.cardsById[card.id]);

console.log(
  "Notes updated:",
  state.board.cardsById[card.id].notes === "Applied through company website"
);

console.log(
  "Card still exists:",
  card.id in state.board.cardsById
);

console.log(
  "Card still in wishlist:",
  state.board.columns.wishlist.includes(card.id)
);

console.log(
  "Wishlist still contains one card:",
  state.board.columns.wishlist.length === 1
);

// Undo the edit
commands.EDIT_CARD.undo(state, action);

console.log("=== After undo() ===");
console.log("Card:", state.board.cardsById[card.id]);

console.log(
  "Notes restored:",
  state.board.cardsById[card.id].notes === "Applied through referral"
);

console.log(
  "Card still exists:",
  card.id in state.board.cardsById
);

console.log(
  "Card still in wishlist:",
  state.board.columns.wishlist.includes(card.id)
);

console.log(
  "Wishlist still contains one card:",
  state.board.columns.wishlist.length === 1
);