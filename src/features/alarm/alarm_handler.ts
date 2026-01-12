import PomodoroManager from "../../core/timer.js";
import { executeWithManager } from "../../core/timer_executor.js"

/**
 * @internal
 */
const POMODORO_TICK_ALARM_KEY = 'pomodoro-tick'

/**
 * Starts the Pomodoro timer alarm that ticks every second.
 * Clears any existing alarm before creating a new one.
 *
 * @returns Promise that resolves when alarm is created
 */
export async function startPomodoroAlarm() {
  console.log(`[AlarmHandler] startPomodoroAlarm() called at ${Date.now()}`)

  await clearAlarm();

  chrome.alarms.create(POMODORO_TICK_ALARM_KEY,  { periodInMinutes: 1 / 60 })
}

/**
 * Stops the active Pomodoro timer alarm.
 *
 * @returns Promise that resolved when alarm is cleared
 */
export async function stopPomodoroAlarm(): Promise<void> {
  console.log(`[AlarmHandler] stopPomodoroAlarm() called at ${Date.now()}`)

  await clearAlarm();
}

/**
 * Clears the Pomodoro timer alarm if it exists.
 *
 * @returns Promise that resolves when alarm is cleared
 * @internal
 */
async function clearAlarm() {
  console.log(`[AlarmHandler] clearAlarm() called at ${Date.now()}`)

  await chrome.alarms.clear(POMODORO_TICK_ALARM_KEY)
}

/**
 * Handles Chrome alarm events for the Pomodoro timer.
 * Decrements timer each second and opens completion page when timer reaches
 *
 * @param alarm - The Chrome alarm that triggered
 * @returns Promise that resolves when tick processing completes
 */
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

/**
 * Opens the timer completion page in a new Chrome tab.
 * Called when a Pomodoro timer session completes.
 *
 * @returns Promise that resolves when tab is created
 * @internal
 */
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
