
export const commands = {
  MOVE_CARD: {
    do(state, action) {
      const { cardId, from, to } = action;

     
      const sourceColumn = state.board.columns[from.stage];
      const destinationColumn = state.board.columns[to.stage];

      
      const cardIndex = sourceColumn.indexOf(cardId);

      
      sourceColumn.splice(cardIndex, 1);

      
      destinationColumn.splice(to.index, 0, cardId);

     
      state.board.cardsById[cardId].stage = to.stage;
    },

    undo(state, action) {
      const { cardId, from, to } = action;

      
      const sourceColumn = state.board.columns[to.stage];
      const destinationColumn = state.board.columns[from.stage];

      // Find the card in the current column
      const cardIndex = sourceColumn.indexOf(cardId);

      
      sourceColumn.splice(cardIndex, 1);

      // Put it back where it originally was
      destinationColumn.splice(from.index, 0, cardId);

     
      state.board.cardsById[cardId].stage = from.stage;
    }
  },

  ADD_CARD: {
    do(state, action) {
      const { card, index } = action;

      // Add the card to cardsById
      state.board.cardsById[card.id] = card;

      // Insert the card's id into the correct column
      state.board.columns[card.stage].splice(index, 0, card.id);
    },

    undo(state, action) {
      const { card } = action;

      // Find the card in its column
      const column = state.board.columns[card.stage];
      const cardIndex = column.indexOf(card.id);

      // Remove the card's id from the column
      column.splice(cardIndex, 1);

      // Remove the card object
      delete state.board.cardsById[card.id];
    }
  },
  EDIT_CARD: {
  do(state, action) {
    const card = state.board.cardsById[action.cardId];

    Object.assign(card, action.after);
  },

  undo(state, action) {
    const card = state.board.cardsById[action.cardId];

    Object.assign(card, action.before);
  }
},
DELETE_CARD: {
  do(state, action) {
    const { card } = action;

    // Find the card in its column
    const column = state.board.columns[card.stage];
    const cardIndex = column.indexOf(card.id);

    // Remove the card's id from the column
    column.splice(cardIndex, 1);

    // Remove the card object
    delete state.board.cardsById[card.id];
  },

  undo(state, action) {
    const { card, index } = action;

    // Restore the card object
    state.board.cardsById[card.id] = card;

    // Restore the card's id to its original position
    state.board.columns[card.stage].splice(index, 0, card.id);
  }
},
};
