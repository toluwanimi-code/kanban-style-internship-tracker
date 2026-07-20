
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
  }
};