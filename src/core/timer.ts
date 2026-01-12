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

  toggle(): PomodoroState {
    this.state.status = TOGGLE_MAP[this.state.status]

    return this.state
  }

  tick(): PomodoroState {
    if (this.state.status !== STATUSES.running) return this.state

    if (this.state.timeLeft > 0) {
      this.state.timeLeft -= 1
    }

    return this.state
  }

  start(mode: ModeValue): PomodoroState {
    console.log(`[PomodoroManager] start() called at ${Date.now()}`);

    this.reset(mode)

    return this.state
  }

  reset(mode: ModeValue) {
    console.log(`[PomodoroManager] reset() called at ${Date.now()}`);

    this.state.totalTime = DURATIONS[mode]
    this.state.timeLeft = DURATIONS[mode]
    this.state.mode = mode
    this.state.status = STATUSES.running
  }

  complete(): PomodoroState {
    this.state.status = STATUSES.idle

    return this.state
  }
}
