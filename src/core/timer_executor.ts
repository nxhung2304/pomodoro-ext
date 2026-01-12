import { updateBadge } from "../features/badge/badge_handler.js";
import PomodoroManager from "./timer.js";
import { loadState, saveState } from "./storage.js";
import { PomodoroState } from "./types.js";

type ManagerCallback = (manager: PomodoroManager) => Promise<PomodoroState> | PomodoroState;

export async function executeWithManager(callback: ManagerCallback) {
  const savedState = await loadState()
  const manager = new PomodoroManager(savedState)

  const newState = await callback(manager)

  await saveState(newState)
  updateBadge(newState)

  return newState
}

