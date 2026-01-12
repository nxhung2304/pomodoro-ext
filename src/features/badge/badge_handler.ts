import { PomodoroState, STATUSES } from "../../core/types.js"
import { formatToMinutesFrom } from "../../core/utils.js"

/**
 * Updates the Chrome extension badge with current timer state.
 * Shows time remaining in minutes when running, "---" when paused / idle
 *
 * @param state - The current PomodoroState to display
 */
export function updateBadge(state: PomodoroState) {
  if (state.timeLeft === undefined || state.timeLeft === null) { throw new Error(`timeLeft = ${state.timeLeft} is invalid`) }

  let stateText = '---'

  if (state.status === STATUSES.running) {
    stateText = formatToMinutesFrom(state.timeLeft)
  }

  chrome.action.setBadgeText({ text: stateText })
}
