import { startPomodoroAlarm } from "../services/alarm_service.js";
import { executeWithManager } from "../services/pomodoro_service.js";

export async function onStartSessionMessage(mode) {
  await executeWithManager(async manager => { 
    let updatedState = manager.start(mode)
 
    await startPomodoroAlarm()

    return updatedState
  })
}
