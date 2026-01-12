import { startPomodoroAlarm, stopPomodoroAlarm } from "../alarm/alarm_handler.js"
import { executeWithManager } from "../../core/timer_executor.js"
import { STATUSES } from "../../core/types.js"

/**
 * Handles extension icon click events to toggle the timer state.
 * Toggles between running and paused states, starting or stopping the alarm accordingly.
 */
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

