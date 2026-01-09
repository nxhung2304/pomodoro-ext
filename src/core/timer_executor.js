import { updateBadge } from "../features/badge/badge_handler.js";
import PomodoroManager from "./timer.js";
import { loadState, saveState } from "./storage.js";

export async function executeWithManager(callback) {
  const savedState = await loadState()
  const manager = new PomodoroManager(savedState)

  const newState = await callback(manager)

  await saveState(newState)
  updateBadge(newState)

  return newState
}

