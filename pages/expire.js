import { MODES } from "../constants/mode.js";
import { loadState } from "../services/time_storage_service.js"

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

function renderExpirePage(config) {
  const h1Ele = document.querySelector("h1")
  const button = document.querySelector('.button');

  h1Ele.textContent = config.title

  button.textContent = config.buttonText
  button.classList.add(config.buttonClass)
}

function setupButtonListener(config) {
  const buttonEle = document.querySelector(`.${config.buttonClass}`);

  buttonEle.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'start',
      mode: config.nextMode
    })

    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.remove(tab.id);
    });
  });
}

await init()
