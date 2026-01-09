# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Pomodoro Timer Chrome Extension - Development Context

## Project Overview
Building a Chrome extension for Pomodoro technique with 25min focus, 5min short break, 15min long break cycles.

## Architecture
- **Service Worker**: background/background.js (Manifest V3)
- **Popup UI**: popup/popup.html, popup.js, popup.css  
- **Storage**: chrome.storage.local for state persistence
- **Timer**: chrome.alarms API for countdown
- **Communication**: chrome.runtime.onMessage between popup ↔ background
- **Display**: chrome.action.setBadgeText for icon countdown

## All GitHub Issues Created

### 🏗️ Setup & Foundation
**#1: Project Setup & Cleanup**
- Delete: background.js, workers/, content.js
- Create: popup/, background/, options/, icons/ folders
- Remove unused manifest permissions: omnibox, content_scripts
- Add required: notifications, alarms, storage

**#2: Manifest Configuration**
- Update name/description for Pomodoro extension
- Set service worker: background/background.js
- Add icons: 16px, 48px, 128px PNG files
- Configure action popup: popup/popup.html
- Permissions: ["alarms", "storage", "notifications"]

### ⚡ Core Timer Logic
**#3: Timer State Management**
```javascript
class TimerManager {
  start(mode)    // 'focus'|'shortBreak'|'longBreak'
  pause()
  reset() 
  getState()     // {mode, status, timeLeft, totalTime}
}
State: {mode, status:'idle'|'running'|'paused', timeLeft, totalTime}
```

**#4: Chrome Alarms Integration**
- chrome.alarms.create() for timer tick every second
- chrome.alarms.onAlarm listener in service worker
- Countdown logic: decrement timeLeft
- Handle completion: clear alarm + notify

### 🎨 Popup Interface
**#5: Popup HTML Structure**
- Timer display: MM:SS format
- Buttons: Start/Pause, Reset
- Mode selector: Focus/Short Break/Long Break
- Current mode indicator
- Max width: 320px

**#6: Popup JavaScript Controller**
- Button event handlers
- chrome.runtime.sendMessage() to background
- Real-time timer display updates
- State synchronization on popup open

**#7: Popup Styling**
- Clean minimal design
- Prominent timer display
- Button states (start/pause visual feedback)
- Mode indicator colors

### 🔗 Integration Features
**#8: Message Protocol**
```javascript
// Popup → Background
{action: 'start', mode: 'focus'}
{action: 'pause'}
{action: 'reset'}
{action: 'getState'}

// Background → Popup  
{type: 'stateUpdate', state: {...}}
{type: 'timerComplete', mode: 'focus'}
```

**#9: Badge Display**
- chrome.action.setBadgeText() with remaining time
- Update every second during countdown
- Different colors for modes
- Clear when idle

**#10: Notifications**
- chrome.notifications.create() on timer completion
- "Focus session complete!" / "Break time over!"
- Optional sound notifications
- Clear after user interaction

### ⚙️ Settings & Enhancement
**#11: Options Page**
- Custom durations for focus/break times
- Notification preferences (sound on/off)
- Auto-start next session setting
- chrome.storage.sync for user preferences

**#12: Statistics Tracking**
- Count completed pomodoros
- Daily/weekly stats
- Display in popup or options
- Reset stats option

### 🧪 Testing & Polish
**#13: Error Handling**
- try/catch for chrome.storage operations
- Alarm creation failures
- Message passing errors
- UI error states display

**#14: Performance Optimization**
- Minimize background script activity
- Efficient state updates
- Battery usage optimization
- Memory leak prevention

## Development Priority Order
1. **#1** → Clean up demo code
2. **#2** → Configure manifest.json
3. **#3** → Build TimerManager class
4. **#4** → Implement Chrome alarms
5. **#8** → Set up message protocol
6. **#5** → Create popup HTML
7. **#6** → Add popup JavaScript
8. **#9** → Badge display
9. **#10** → Notifications
10. **#7** → Polish UI styling

## Key Code Patterns
```javascript
// State persistence
await chrome.storage.local.set({timerState: state});
const {timerState} = await chrome.storage.local.get('timerState');

// Message passing
chrome.runtime.sendMessage({action: 'start', mode: 'focus'});
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {});

// Alarms
chrome.alarms.create('pomodoro-tick', {delayInMinutes: 0, periodInMinutes: 1/60});
chrome.alarms.onAlarm.addListener((alarm) => {});

// Badge
chrome.action.setBadgeText({text: '24:59'});
chrome.action.setBadgeBackgroundColor({color: '#FF6B6B'});
```

## Timer Durations (seconds)
- Focus: 1500 (25 min)
- Short Break: 300 (5 min)  
- Long Break: 900 (15 min)

# Pomodoro Timer Chrome Extension - Project Structure

## Final Folder Structure
```
pomodoro-ext/
├── manifest.json
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── background/
│   └── background.js        # Service Worker (Manifest V3)
├── options/                 # Phase 2
│   ├── options.html
│   └── options.js
└── docs/                    # Development docs
    ├── claude.md
    ├── PROJECT_STRUCTURE.md
    └── DEVELOPMENT_FLOW.md
```

## File Responsibilities
- **manifest.json**: Extension configuration, permissions, entry points
- **popup/**: Extension popup UI (320px max width)
- **background/**: Service worker for timer logic, alarms, storage
- **options/**: Settings page for custom durations
- **icons/**: PNG icons for extension (16, 48, 128px)

## Current Working Issue
**Issue #[4]**:

