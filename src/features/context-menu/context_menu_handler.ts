import { startPomodoroAlarm } from "../alarm/alarm_handler.js";
import { executeWithManager } from "../../core/timer_executor.js";
import { MENU_IDS, MODES, ModeValue } from "../../core/types.js";

const MENU_TITLES = {
  focus:  "Start Focusing",
  shortBreak:  "Start Short Break",
  longBreak:  "Start Long Break",
}

const MENU_ITEMS = [
  {
    id: MENU_IDS.focus,
    title: MENU_TITLES.focus,
    contexts: ["action" as const]
  },
  {
    id: MENU_IDS.shortBreak,
    title: MENU_TITLES.shortBreak,
    contexts: ["action" as const]
  },
  {
    id: MENU_IDS.longBreak,
    title: MENU_TITLES.longBreak,
    contexts: ["action"] as const
  },
] as const

/**
 * Creates Pomodoro context menu items in Chrome extension.
 * Removes all existing context menus and creates fresh menu items for focus, short break, and long break.
 */
export default function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    for (const menuItem of MENU_ITEMS) {
      chrome.contextMenus.create({
        ...menuItem,
        contexts: [...menuItem.contexts]
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Context menu error:', chrome.runtime.lastError.message)
        }
      });
    }
  })
}

/**
 * Handles context menu click events.
 * Starts the Pomodoro timer with the mode corresponding to the clicked menu item.
 *
 * @param info - Context menu click data containing the selected menu item ID
 */
export async function onContextMenuClick(info: chrome.contextMenus.OnClickData) {
  const mode = _getModeBy(info.menuItemId)

  await executeWithManager(async (manager) => {
    const state = manager.start(mode)

    await startPomodoroAlarm()

    return state
  })
}

/**
 * Maps a context menu item ID to its corresponding Pomodoro mode.
 *
 * @param menuItemId - The context menu item ID to map
 * @returns The corresponding mode value
 * @throws {Error} If the menu item ID doesn't match any known mode
 * @internal
 */
function _getModeBy(menuItemId: string | number): ModeValue {
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
