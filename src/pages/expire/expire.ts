import { loadState } from "../../core/storage.js"
import { ACTIONS, MODES, ModeValue } from "../../core/types.js";

type DISPLAY_MODE = {
  title: string,
  buttonText: string,
  nextMode: ModeValue,
  buttonClass: string
}

const MODE_DISPLAY_CONFIG = {
  [MODES.focus]: {
    title: 'Focus Complete!',
    buttonText: 'Start Break',
    nextMode: MODES.shortBreak,
    buttonClass: 'short-break'
  },
  [MODES.shortBreak]: {
    title: 'Short Break Complete!',
    buttonText: 'Start Focus',
    nextMode: MODES.focus,
    buttonClass: 'focus'
  },
  [MODES.longBreak]: {
    title: 'Long Break Complete!',
    buttonText: 'Start Focus',
    nextMode: MODES.focus,
    buttonClass: 'focus'
  },
};

async function init() {
  const state = await loadState();
  const config = MODE_DISPLAY_CONFIG[state.mode];

  renderExpirePage(config);

  setupButtonListener(config);
}

function renderExpirePage(config: DISPLAY_MODE) {
  const h1Ele = document.querySelector("h1")
  const buttonEle = document.querySelector('.button');

  if (buttonEle === null) {
    console.warn("Button is not present")

    return
  }

  if (h1Ele === null) {
    console.warn("h1 is not present")

    return
  }


  h1Ele.textContent = config.title

  buttonEle.textContent = config.buttonText
  buttonEle.classList.add(config.buttonClass)
}

function setupButtonListener(config: DISPLAY_MODE) {
  const buttonEle = document.querySelector(`.${config.buttonClass}`);

  if (buttonEle === null) {
    console.warn("Button is not present")
    return
  }

  buttonEle.addEventListener('click', async () => {
    chrome.runtime.sendMessage({
      action: ACTIONS.start,
      mode: config.nextMode
    });

    try {
      const tab = await chrome.tabs.getCurrent();
      if (tab?.id) {
        await chrome.tabs.remove(tab.id);
      }
    } catch (error) {
      console.error('Error removing tab:', error);
    }
  });
}

await init()
