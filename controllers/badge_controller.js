import { STATUSES } from "../constants/status.js"
import { formatToMinutesFrom } from "../helpers/string_helper.js"

export function updateBadge(state) {
  if (state.timeLeft === undefined || state.timeLeft === null) { throw new Error(`timeLeft = ${state.timeLeft} is invalid`) }

  let stateText = '---'  

  if (state.status === STATUSES.running) {
    stateText = formatToMinutesFrom(state.timeLeft)
  }

  chrome.action.setBadgeText({ text: stateText })
}
