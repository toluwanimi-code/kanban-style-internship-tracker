import { createState } from "./state.js";
import { render } from "./render.js";
import { dispatch, undo, redo } from "./engine.js";

const state = createState();
const now = new Date().toISOString();

function openEditForm(card) {
  const form = document.getElementById("edit-card-form");

  document.getElementById("edit-card-id").value = card.id;
  document.getElementById("edit-company").value = card.company;
  document.getElementById("edit-role").value = card.role;
  document.getElementById("edit-notes").value = card.notes;

  form.style.display = "block";
}

const handlers = {
  openEditForm
};

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

render(state, handlers);

document.getElementById("undo-btn").addEventListener("click", () => {
  undo(state);
  render(state, handlers);
});

document.getElementById("redo-btn").addEventListener("click", () => {
  redo(state);
  render(state, handlers);
});

const form = document.getElementById("add-card-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const company = formData.get("company");
  const role = formData.get("role");
  const notes = formData.get("notes");
  const stage = formData.get("stage");

  const card = {
    id: crypto.randomUUID(),
    userId: "user1",
    company,
    role,
    notes,
    stage,
    createdAt: new Date().toISOString()
  };

  const action = {
    type: "ADD_CARD",
    card,
    index: state.board.columns[stage].length
  };

  dispatch(state, action);
  render(state, handlers);
  form.reset();
});

const editForm = document.getElementById("edit-card-form");

editForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(editForm);

  const cardId = formData.get("cardId");
  const company = formData.get("company");
  const role = formData.get("role");
  const notes = formData.get("notes");

  const originalCard = state.board.cardsById[cardId];

  const action = {
    type: "EDIT_CARD",
    cardId,
    before: {
      company: originalCard.company,
      role: originalCard.role,
      notes: originalCard.notes
    },
    after: {
      company,
      role,
      notes
    }
  };

  dispatch(state, action);
  render(state, handlers);

  editForm.reset();
  editForm.style.display = "none";
});