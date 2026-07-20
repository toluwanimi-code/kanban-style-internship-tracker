import { commands } from "./command.js";

export function applyAction(state, action, method) {
  const command = commands[action.type];

  if (!command) {
    throw new Error(`Unknown action type: ${action.type}`);
  }

  command[method](state, action);
}
export function dispatch(state, action) {
  applyAction(state, action, "do");
  state.undoStack.push(action);
  state.redoStack = [];
 
}

export function undo(state) {
  // Nothing to undo
  if (state.undoStack.length === 0) {
    return;
  }

  // Get the most recent action
  const action = state.undoStack.pop();

  // Apply the inverse of the action
  applyAction(state, action, "undo");

  // Save it so it can be redone later
  state.redoStack.push(action);

  // Re-render the UI (later)
  // render(state);
}