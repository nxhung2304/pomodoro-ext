import createContextMenus, { onContextMenuClick } from "../features/context-menu/context_menu_handler.js"
import { onPomodoroToggle } from "../features/toggle/toggle_handler.js"
import { onAlarmTrigger } from "../features/alarm/alarm_handler.js"
import { onStartSessionMessage } from "../features/messaging/messing_handler.js"
import { isObject, isOneOf, isString } from "../core/utils.js";
import { ACTIONS, MessageRequest, MODES, ModeValue } from "../core/types.js";

// icon
chrome.action.onClicked.addListener(async () => {
  await onPomodoroToggle()
})

// context menu
chrome.runtime.onInstalled.addListener(() => {
  createContextMenus()
})

chrome.contextMenus.onClicked.addListener(async (info, _tab) => {
  await onContextMenuClick(info)
})

// alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {
  await onAlarmTrigger(alarm)
});


// message
chrome.runtime.onMessage.addListener(
  function (request, _sender, _sendResponse) {
    console.log("Message received:", request);

    if (!isValidMessage(request)) {
      console.error("[ServiceWorker] Invalid request:", request);

      return
    }

    if (request.action === ACTIONS.start) {
      (async () => {

        await onStartSessionMessage(request.mode)
      })()
    }
  }
)

function isValidMessage(request: unknown): request is MessageRequest {
  if (!isObject(request)) return false
  if (!isString(request.action)) return false

  switch (request.action) {
    case ACTIONS.start:
      return isOneOf(MODES, request.mode)

    default:
      return false
  }
}
