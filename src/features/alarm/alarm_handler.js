import { executeWithManager } from "../../core/timer_executor.js"

export const POMODORO_TICK_ALARM_KEY = 'pomodoro-tick'

export async function startPomodoroAlarm() {
  console.log('[AlarmHandler] startPomodoroAlarm() called')

  await clearAlarm();

  chrome.alarms.create(POMODORO_TICK_ALARM_KEY,  { periodInMinutes: 1 / 60 })
}

export async function stopPomodoroAlarm() {
  console.log('[AlarmHandler] stopPomodoroAlarm() called')

  await clearAlarm();
}

async function clearAlarm() {
  console.log('[AlarmHandler] clearAlarm() called')

  await chrome.alarms.clear(POMODORO_TICK_ALARM_KEY)
}

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
  const expirePageUrl = chrome.runtime.getURL('src/pages/expire/expire.html');

  try {
    await chrome.tabs.create({
      url: expirePageUrl
    })
  } catch (error) {
    console.error(`Error creating tab: ${error}`);  
  }
}
