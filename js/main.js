import { createState } from "./state.js";
import { render } from "./render.js";
import { undo, redo } from "./engine.js";

const state = createState();
const now = new Date().toISOString();

state.board.cardsById = {
  card1: {
    id: "card1",
    userId: "user1",
    company: "Google",
    role: "Software Engineer Intern",
    stage: "wishlist",
    createdAt: now,
    notes: ""
  },
  card2: {
    id: "card2",
    userId: "user1",
    company: "Meta",
    role: "Frontend Intern",
    stage: "applied",
    createdAt: now,
    notes: ""
  },
  card3: {
    id: "card3",
    userId: "user1",
    company: "Microsoft",
    role: "Backend Intern",
    stage: "interviewing",
    createdAt: now,
    notes: ""
  }
};

state.board.columns.wishlist = ["card1"];
state.board.columns.applied = ["card2"];
state.board.columns.interviewing = ["card3"];

render(state);

document.getElementById("undo-btn").addEventListener("click", () => {
  undo(state);
  render(state);
});

document.getElementById("redo-btn").addEventListener("click", () => {
  redo(state);
  render(state);
});