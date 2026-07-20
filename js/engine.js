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
