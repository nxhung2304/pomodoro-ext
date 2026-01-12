import { MODES, PomodoroState, STATUSES } from "./types.js"
import { isObject, isOneOf } from "./utils.js"

const KEY = 'time-manager'


function isPomodoroState(data: unknown): data is PomodoroState {
    if (!isObject(data)) return false

    const d = data as Record<string, unknown>

    if (!isOneOf(MODES, d.mode)) return false
    if (!isOneOf(STATUSES, d.status)) return false
    if (typeof d.timeLeft !== "number") return false
    if (typeof d.totalTime !== "number") return false

    return true
}

export async function loadState(): Promise<PomodoroState> {
    const result = await chrome.storage.local.get(KEY);
    const data = result[KEY]

    if (isPomodoroState(data)) {
        return data
    }

    // return fallback value
    return {
        status: 'idle',
        mode: 'focus',
        timeLeft: 1500,
        totalTime: 1500
    }
}

export async function saveState(state: PomodoroState): Promise<void> {
    await chrome.storage.local.set({ [KEY]: state })
}
