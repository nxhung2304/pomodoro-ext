import { MODES, STATUSES } from "./constants.js";

const TOGGLE_MAP = {
  [STATUSES.running]: STATUSES.paused,

  [STATUSES.paused]: STATUSES.running,
  [STATUSES.idle]: STATUSES.running,
}

const DURATIONS = {
    focus: 1500, // 25m
    shortBreak: 300, // 5m
    longBreak: 900 // 15m
};

export default class PomodoroManager {
    constructor(state) {
        this.state = state
    }

    toggle() {
      this.state.status = TOGGLE_MAP[this.state.status]

      return this.state
    }

    tick() {
        if (this.state.status !== STATUSES.running) return this.state

        if (this.state.timeLeft > 0) {
            this.state.timeLeft -= 1
        }

        return this.state
    }
    
    start(mode) {
      console.log('[PomodoroManager] start() called');

      const existedMode = Object.values(MODES).includes(mode)
 
      if (!existedMode) { throw new Error(`Mode ${mode} is not valid`) }

      this.reset(mode)
      
      return this.state
    }

    reset(mode) {
      console.log('[PomodoroManager] reset() called');

      this.state.totalTime = DURATIONS[mode]
      this.state.timeLeft = DURATIONS[mode]
      this.state.mode = mode
      this.state.status = STATUSES.running 
    }

    complete()  {
      this.state.status = STATUSES.idle
      
      return this.state
    }
}
