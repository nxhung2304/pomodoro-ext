import { executeWithManager } from "../services/pomodoro_service.js"

export async function onPomodoroToggle() {
  await executeWithManager(manager => manager.toggle())
}

