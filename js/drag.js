import { dispatch } from "./engine.js";
import { render } from "./render.js";

export function dragstart(event) {
  const cardElement = event.currentTarget;
  const cardsContainer = cardElement.parentElement;
  const payload = {
    cardId: cardElement.dataset.cardId,
    from: {
      stage: cardsContainer.parentElement.dataset.stage,
      index: Array.from(cardsContainer.children).indexOf(cardElement)
    }
  };
  event.dataTransfer.setData("application/json", JSON.stringify(payload));
  event.dataTransfer.effectAllowed = "move";
}

export function dragover(event) {
  event.preventDefault();
}

export function createDropHandler(state) {
  return function drop(event) {
    event.preventDefault();

    const payload = JSON.parse(event.dataTransfer.getData("application/json"));
    const { cardId, from } = payload;

    const cardsContainer = event.currentTarget;
    const to = {
      stage: cardsContainer.parentElement.dataset.stage,
      index: cardsContainer.children.length
    };

    const action = { type: "MOVE_CARD", cardId, from, to };
console.log("DROP →", action);
    dispatch(state, action);
    render(state);
  };
}