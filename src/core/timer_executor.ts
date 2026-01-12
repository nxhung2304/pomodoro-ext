import { updateBadge } from "../features/badge/badge_handler.js";
import PomodoroManager from "./timer.js";
import { loadState, saveState } from "./storage.js";
import { PomodoroState } from "./types.js";

/**
 * Callback function type for timer operations.
 * Receives a PomodoroManager instance and returns updated state.
 *
 * @param manager - The PomodoroManager instance to operate on
 * @returns Promise or direct PomodoroState result
 */
type ManagerCallback = (manager: PomodoroManager) => Promise<PomodoroState> | PomodoroState;


/**
 * Executes a callback with an initialized PomodoroManager.
 * Automatically handles loading state, applying changes, saving state, and updating badge.
 *
 * @param callback - Function that performs timer operations on the manager
 * @returns Promise resolving to the updated state after save
 */
export async function executeWithManager(callback: ManagerCallback) {
  const savedState = await loadState()
  const manager = new PomodoroManager(savedState)

  const newState = await callback(manager)

  await saveState(newState)
  updateBadge(newState)

  return newState
}
