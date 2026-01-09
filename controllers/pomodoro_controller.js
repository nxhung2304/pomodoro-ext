import { STATUSES } from "../constants/status.js"
import { startPomodoroAlarm, stopPomodoroAlarm } from "../services/alarm_service.js"
import { executeWithManager } from "../services/pomodoro_service.js"

export async function onPomodoroToggle() {
  await executeWithManager(async manager => {
    const newState = manager.toggle()

    if (newState.status === STATUSES.running) {
      await startPomodoroAlarm()
    } else {
      await stopPomodoroAlarm()
    }

    return newState
  })
}

