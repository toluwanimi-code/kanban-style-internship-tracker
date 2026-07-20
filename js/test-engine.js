import { createState } from "./state.js";
import { applyAction } from "./engine.js";

const state = createState();
const badAction = { type: "MOVE_CRAD" };

try {
  applyAction(state, badAction, "do");
  console.log("FAIL: expected an error but none was thrown");
} catch (err) {
  console.log("PASS: threw as expected →", err.message);
}