const KEY = 'time-manager'

export async function loadState() {
    const result = await chrome.storage.local.get(KEY)
    return result[KEY] ?? {
        status: 'idle',
        mode: 'focus',
        timeLeft: 1500,
        totalTime: 1500
    }
}

export async function saveState(state) {
    await chrome.storage.local.set({ [KEY]: state })
}

