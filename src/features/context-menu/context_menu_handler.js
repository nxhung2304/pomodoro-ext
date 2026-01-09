import { MENU_IDS, MODES } from "../../core/constants.js";
import { startPomodoroAlarm } from "../alarm/alarm_handler.js";
import { executeWithManager } from "../../core/timer_executor.js";

const MENU_TITLES = {
  focus:  "Start Focusing",
  shortBreak:  "Start Short Break",
  longBreak:  "Start Long Break",
}

const MENU_ITEMS = [
  {
    id: MENU_IDS.focus,
    title: MENU_TITLES.focus,
    contexts: ["action"]
  },
  {
    id: MENU_IDS.shortBreak,
    title: MENU_TITLES.shortBreak,
    contexts: ["action"]
  },
  {
    id: MENU_IDS.longBreak,
    title: MENU_TITLES.longBreak,
    contexts: ["action"]
  },
]

export default function createContextMenus() { 
  chrome.contextMenus.removeAll(() => {
    for (const menuItem of MENU_ITEMS) {
      chrome.contextMenus.create(menuItem, () => {
        if (chrome.runtime.lastError) {
          console.error('Context menu error:', chrome.runtime.lastError.message)
        }
      });
    }
  })
}

export async function onContextMenuClick(info) {
  const mode = _getModeBy(info.menuItemId)

  await executeWithManager(async (manager) => {
    const state = manager.start(mode)

    await startPomodoroAlarm()

    return state
  })
}

function _getModeBy(menuItemId) {
  let mode

  switch (menuItemId) {
    case MENU_IDS.focus:
      mode = MODES.focus

      break;
    case MENU_IDS.shortBreak:
      mode = MODES.shortBreak

      break;
    case MENU_IDS.longBreak:
      mode = MODES.longBreak

      break;
  }

  if (!mode) { throw new Error(`mode = ${mode} is not valid`) }

  return mode
}

