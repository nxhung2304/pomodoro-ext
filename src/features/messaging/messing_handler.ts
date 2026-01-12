import { startPomodoroAlarm } from "../alarm/alarm_handler.js";
import { executeWithManager } from "../../core/timer_executor.js";

export async function onStartSessionMessage(mode) {
  await executeWithManager(async manager => { 
    let updatedState = manager.start(mode)
 
    await startPomodoroAlarm()

    return updatedState
  })
}
