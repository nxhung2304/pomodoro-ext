import { startPomodoroAlarm } from "../alarm/alarm_handler.js";
import { executeWithManager } from "../../core/timer_executor.js";
import { ModeValue } from "../../core/types.js";

/**
 * Handles incoming message requests to start a new Pomodoro session.
 * Starts the timer with the specified mode and initiates the alarm.
 *
 * @param mode - The timer mode to start: 'focus', 'shortBreak', or 'longBreak'
 */
export async function onStartSessionMessage(mode: ModeValue) {
  await executeWithManager(async manager => {
    let updatedState = manager.start(mode)

    await startPomodoroAlarm()

    return updatedState
  })
}
