import createContextMenus from "../views/context_menu_view.js"
import { onPomodoroToggle } from "../controllers/pomodoro_controller.js"
import { onContextMenuClick } from "../controllers/context_menu_controller.js"
import { onAlarmTrigger } from "../controllers/alarm_controller.js"

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
