import createContextMenus, { onContextMenuClick } from "../features/context-menu/context_menu_handler.js"
import { onPomodoroToggle } from "../features/toggle/toggle_handler.js"
import { onAlarmTrigger } from "../features/alarm/alarm_handler.js"
import { onStartSessionMessage } from "../features/messaging/messing_handler.js"

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
chrome.alarms.onAlarm.addListener( async (alarm) => {
  await onAlarmTrigger(alarm)
});

// message
chrome.runtime.onMessage.addListener(
  async function(request, _sender, _sendResponse) {
    console.log("Message received:", request);

    const action = request.action

    if  (action === "start") {
      const mode = request.mode

      await onStartSessionMessage(mode)
    }
  }
)
