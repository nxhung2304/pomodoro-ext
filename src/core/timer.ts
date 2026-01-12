import { DURATIONS, MODES, ModeValue, PomodoroState, STATUSES, StatusValue } from "./types.js";

const TOGGLE_MAP: Record<StatusValue, StatusValue> = {
  [STATUSES.running]: STATUSES.paused,
  [STATUSES.paused]: STATUSES.running,
  [STATUSES.idle]: STATUSES.running,
}

export default class PomodoroManager {
  state: PomodoroState;

  constructor(state: PomodoroState) {
    this.state = state
  }

  /**
   * Toggles the timer between running and paused states.
   * Idle timers will start when toggled
   *
   * @returns The updated Pomodoro state with new status
   */
  toggle(): PomodoroState {
    this.state.status = TOGGLE_MAP[this.state.status]

    return this.state
  }

  /**
   * Decrements the timer by one second if running.
   * Does nothing if timer is paused or idle.
   *
   * @returns The updated Pomodoro state with decremented timeLeft
   */
  tick(): PomodoroState {
    if (this.state.status !== STATUSES.running) return this.state

    if (this.state.timeLeft > 0) {
      this.state.timeLeft -= 1
    }

    return this.state
  }

  /**
    * Starts a new Pomodoro session with the specified mode.
    * Resets the timer to the mode's full duration and sets status to running
    *
    * @param mode - The timer mode: 'focus', 'shortBreak' or 'longBreak'
    * @returns The reset state with timer running
    */
  start(mode: ModeValue): PomodoroState {
    console.log(`[PomodoroManager] start() called at ${Date.now()}`);

    this.reset(mode)

    return this.state
  }

  /**
   * Reset state with timer running
   *
   * @param mode - The timer mode: 'focus', 'shortBreak', or 'longBreak'
   */
  reset(mode: ModeValue) {
    console.log(`[PomodoroManager] reset() called at ${Date.now()}`);

    this.state.totalTime = DURATIONS[mode]
    this.state.timeLeft = DURATIONS[mode]
    this.state.mode = mode
    this.state.status = STATUSES.running
  }

  /**
   * Marks the timer as completed and sets status to idle
   * Called when timeLeft reaches zero.
   *
   * @returns The updated state with idle status
   */
  complete(): PomodoroState {
    this.state.status = STATUSES.idle

    return this.state
  }
}
