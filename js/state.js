export function createState() {
  return {
    currentUser: null,

    board: {
      columns: {
        wishlist: [],
        applied: [],
        interviewing: [],
        offer: [],
        rejected: []
      },

      cardsById: {}
    },

    undoStack: [],
    redoStack: [],

    loading: false,
    error: null
  };
}