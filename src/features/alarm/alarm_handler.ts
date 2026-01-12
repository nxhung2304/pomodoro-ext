import PomodoroManager from "../../core/timer.js";
import { executeWithManager } from "../../core/timer_executor.js"

export const POMODORO_TICK_ALARM_KEY = 'pomodoro-tick'

export async function startPomodoroAlarm() {
  console.log(`[AlarmHandler] startPomodoroAlarm() called at ${Date.now()}`)

  await clearAlarm();

  chrome.alarms.create(POMODORO_TICK_ALARM_KEY,  { periodInMinutes: 1 / 60 })
}

export async function stopPomodoroAlarm(): Promise<void> {
  console.log(`[AlarmHandler] stopPomodoroAlarm() called at ${Date.now()}`)

  await clearAlarm();
}

async function clearAlarm() {
  console.log(`[AlarmHandler] clearAlarm() called at ${Date.now()}`)

  await chrome.alarms.clear(POMODORO_TICK_ALARM_KEY)
}

export async function onAlarmTrigger(alarm: chrome.alarms.Alarm) {
  const alarmName = alarm.name

  if (alarmName !== POMODORO_TICK_ALARM_KEY) {
    console.warn(`Alarm name = ${alarmName} is invalid`)

    return
  }

  await executeWithManager(async (manager: PomodoroManager) => {
    let updatedState = manager.tick()

    const onTimerCompleted = updatedState.timeLeft === 0
    if (onTimerCompleted) {
      console.log(`[AlarmHandler] Timer completed at ${Date.now()}`);

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
