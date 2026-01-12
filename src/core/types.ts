// ==CONSTANTS==
export const MENU_IDS = {
  focus: 'start-focusing',
  shortBreak: 'start-short-break',
  longBreak: 'start-long-break'
} as const;

export const MODES = {
    focus: 'focus',
    longBreak: 'longBreak',
    shortBreak: 'shortBreak'
} as const

export const STATUSES = {
  idle: 'idle',
  running: 'running',
  paused: 'paused'
} as const;


export const DURATIONS: Record<ModeValue, number> = {
  focus: 1500, // 25m
  shortBreak: 300, // 5m
  longBreak: 900 // 15m
} as const;

// ==TYPES==

export type StatusValue = typeof STATUSES[keyof typeof STATUSES];

export interface PomodoroState {
  mode: ModeValue;
  status: StatusValue;
  timeLeft: number;
  totalTime: number;
}

export type ModeValue = typeof MODES[keyof typeof MODES];


export const ACTIONS = {
  start: "start"
} as const

export type ActionValue = typeof ACTIONS[keyof typeof ACTIONS];

interface StartMessage {
  action: ActionValue;
  mode: ModeValue;
}

export type MessageRequest = StartMessage;
