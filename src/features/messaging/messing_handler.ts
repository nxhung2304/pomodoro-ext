import { startPomodoroAlarm } from "../alarm/alarm_handler.js";
import { executeWithManager } from "../../core/timer_executor.js";
import { ModeValue } from "../../core/types.js";

export async function onStartSessionMessage(mode: ModeValue) {
  await executeWithManager(async manager => {
    let updatedState = manager.start(mode)

    await startPomodoroAlarm()

    return updatedState
  })
}
