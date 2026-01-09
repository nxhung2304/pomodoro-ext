import { MENU_IDS } from "../constants/menu_id.js";
import { MODES } from "../constants/mode.js";
import { startPomodoroAlarm } from "../services/alarm_service.js";
import { executeWithManager } from "../services/pomodoro_service.js";

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

