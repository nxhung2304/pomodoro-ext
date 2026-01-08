import { updateBadge } from "../controllers/badge_controller.js";
import PomodoroManager from "../models/pomodoro_manager.js";
import { loadState, saveState } from "./time_storage_service.js";

export async function executeWithManager(callback) {
  const savedState = await loadState()
  const manager = new PomodoroManager(savedState)

  const newState = callback(manager)

  await saveState(newState)
  updateBadge(newState)

  return newState
}

