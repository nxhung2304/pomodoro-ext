import { STATUSES } from "../../core/constants.js"
import { startPomodoroAlarm, stopPomodoroAlarm } from "../alarm/alarm_handler.js"
import { executeWithManager } from "../../core/timer_executor.js"

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

