import { MENU_IDS } from "../constants/menu_id.js";

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

