import { MODES } from "../constants/mode.js";
import { executeWithManager } from "../services/pomodoro_service.js";
import { MENU_IDS } from "../views/context_menu_view.js";

export async function onContextMenuClick(info) {
  const mode = _getModeBy(info.menuItemId)

  await executeWithManager(manager => manager.start(mode))
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

