import { dragstart, dragover, createDropHandler } from "./drag.js";

const stages = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "rejected"
];

const stageTitles = {
  wishlist: "Wishlist",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected"
};

export function render(state, handlers = {}) {
  const { openEditForm } = handlers;

  const board = document.getElementById("board");
  board.innerHTML = "";

  for (const stage of stages) {
    const column = document.createElement("div");
    column.className = "column";
    column.dataset.stage = stage;

    const heading = document.createElement("h2");
    heading.textContent = stageTitles[stage];

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "cards";
    cardsContainer.addEventListener("dragover", dragover);
    cardsContainer.addEventListener(
      "drop",
      createDropHandler(state, handlers)
    );

    column.appendChild(heading);
    column.appendChild(cardsContainer);

    for (const cardId of state.board.columns[stage]) {
      const card = state.board.cardsById[cardId];

      const cardElement = document.createElement("div");
      cardElement.className = "card";
      cardElement.dataset.cardId = card.id;
      cardElement.draggable = true;
      cardElement.addEventListener("dragstart", dragstart);

      const heading3 = document.createElement("h3");
      heading3.textContent = card.company;

      const paragraph = document.createElement("p");
      paragraph.textContent = card.role;

      cardElement.appendChild(heading3);
      cardElement.appendChild(paragraph);

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";

      editButton.addEventListener("click", () => {
        openEditForm(card);
      });

      cardElement.appendChild(editButton);

      cardsContainer.appendChild(cardElement);
    }

    board.appendChild(column);
  }
}