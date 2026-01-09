import { POMODORO_TICK_ALARM_KEY, stopPomodoroAlarm } from "../services/alarm_service.js"
import { executeWithManager } from "../services/pomodoro_service.js"

export async function onAlarmTrigger(alarm) {
  const alarmName = alarm.name

  if (alarmName !== POMODORO_TICK_ALARM_KEY) {
    console.warn(`Alarm name = ${alarmName} is invalid`)

    return
  }

  await executeWithManager(async manager => {
    const newState = manager.tick()

    const onTimerCompleted = newState.timeLeft === 0
    if (onTimerCompleted) {
      console.log('Timer completed');

      await stopPomodoroAlarm()
    }

    return newState
  })
}

