import { MODES, PomodoroState, STATUSES } from "./types.js"
import { isObject, isOneOf } from "./utils.js"

const KEY = 'time-manager'

/**
 * Type guard to validate unknown data matches PomodoroState interface.
 * Checks all required fields and their types against MODES and STATUSES constants.
 *
 * @param data - Unknown data to validate (typically from chrome.storage)
 * @returns True if data is a valid PomodoroState, false otherwise
 *
 * @internal This is an internal helper, not exported
 */
function isPomodoroState(data: unknown): data is PomodoroState {
    if (!isObject(data)) return false

    const d = data as Record<string, unknown>

    if (!isOneOf(MODES, d.mode)) return false
    if (!isOneOf(STATUSES, d.status)) return false
    if (typeof d.timeLeft !== "number") return false
    if (typeof d.totalTime !== "number") return false

    return true
}

/**
 * Loads the Pomodoro timer state from Chrome's local storage.
 *
 * @returns Promise resolving to validated PomodoroState
 */
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

/**
 * Persists the Pomodoro timer state to Chrome's local storage
 * Overwrites any existing state.
 *
 * @param state - The PomodoroState to save
 */
export async function saveState(state: PomodoroState): Promise<void> {
    await chrome.storage.local.set({ [KEY]: state })
}
