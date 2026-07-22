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

export function render(state) {
  const board = document.getElementById("board");

  // Clear the previous UI
  board.innerHTML = "";

  for (const stage of stages) {
    // Create the column
    const column = document.createElement("div");
    column.className = "column";
    column.dataset.stage = stage;

    // Column heading
    const heading = document.createElement("h2");
    heading.textContent = stageTitles[stage];

    // Cards container
    const cardsContainer = document.createElement("div");
    cardsContainer.className = "cards";
    cardsContainer.addEventListener("dragover", dragover);
    cardsContainer.addEventListener("drop", createDropHandler(state));

    column.appendChild(heading);
    column.appendChild(cardsContainer);

    // Create each card
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

      cardsContainer.appendChild(cardElement);
    }

    board.appendChild(column);
  }
}

