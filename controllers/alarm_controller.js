import { POMODORO_TICK_ALARM_KEY, stopPomodoroAlarm } from "../services/alarm_service.js"
import { executeWithManager } from "../services/pomodoro_service.js"

export async function onAlarmTrigger(alarm) {
  const alarmName = alarm.name

  if (alarmName !== POMODORO_TICK_ALARM_KEY) {
    console.warn(`Alarm name = ${alarmName} is invalid`)

    return
  }

  await executeWithManager(async manager => {
    let updatedState = manager.tick()

    const onTimerCompleted = updatedState.timeLeft === 0
    if (onTimerCompleted) {
      console.log('Timer completed');

      updatedState = manager.complete()

      await stopPomodoroAlarm()

      await openExpirePage()
    }

    return updatedState
  })
}

async function openExpirePage() {
  const expirePageUrl = chrome.runtime.getURL('pages/expire.html');

  try {
    await chrome.tabs.create({
      url: expirePageUrl
    })
  } catch (error) {
    console.error(`Error creating tab: ${error}`);  
  }
}
