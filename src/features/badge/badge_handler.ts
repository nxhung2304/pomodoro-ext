import { STATUSES } from "../../core/constants.js"
import { formatToMinutesFrom } from "../../core/utils.js"

export function updateBadge(state) {
  if (state.timeLeft === undefined || state.timeLeft === null) { throw new Error(`timeLeft = ${state.timeLeft} is invalid`) }

  let stateText = '---'  

  if (state.status === STATUSES.running) {
    stateText = formatToMinutesFrom(state.timeLeft)
  }

  chrome.action.setBadgeText({ text: stateText })
}
