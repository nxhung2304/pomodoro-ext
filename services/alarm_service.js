export const POMODORO_TICK_ALARM_KEY = 'pomodoro-tick'

export async function startPomodoroAlarm() {
  console.log('[AlarmService] startPomodoroAlarm() called')

  await clearAlarm();

  chrome.alarms.create(POMODORO_TICK_ALARM_KEY,  { periodInMinutes: 1 / 60 })
}

export async function stopPomodoroAlarm() {
  console.log('[AlarmService] stopPomodoroAlarm() called')

  await clearAlarm();
}

async function clearAlarm() {
  console.log('[AlarmService] clearAlarm() called')

  await chrome.alarms.clear(POMODORO_TICK_ALARM_KEY)
}
