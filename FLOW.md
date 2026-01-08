# Pomodoro Timer Chrome Extension - Complete Development Flow

## 🎯 Extension Flow Overview

### User Journey
```
1. User clicks extension icon
   ↓
2. Popup opens showing timer (25:00) + Start button
   ↓
3. User clicks Start → Timer begins countdown
   ↓
4. Badge shows countdown (24:59, 24:58...)
   ↓
5. User can pause/resume anytime via popup
   ↓
6. When timer hits 00:00 → Notification appears
   ↓
7. User can start break timer or new focus session
```

### Technical Flow
```
Popup Click → Message → Background → Storage → Alarms → Badge → Notification
     ↑                                                              ↓
User Interface ←←←←←←← State Updates ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←← Timer Events
```

---

## 🏗️ Development Phases Breakdown

### **Phase 1: Foundation Setup**

#### Issue #1: Project Cleanup
```bash
# Before (Demo structure)
pomodoro-ext/
├── background.js          ❌ Delete
├── workers/               ❌ Delete
├── content.js            ❌ Delete
├── manifest.json         ✅ Keep but modify
├── app.js                ✅ Keep → rename to popup.js
└── index.html            ✅ Keep → rename to popup.html

# After (Clean structure)
pomodoro-ext/
├── manifest.json         ✅ Updated
├── popup/
│   ├── popup.html        ✅ Renamed from index.html
│   └── popup.js          ✅ Renamed from app.js
└── icons/                ✅ New folder
```

**Verification**: Load extension → No console errors

#### Issue #2: Manifest Configuration
```json
{
  "manifest_version": 3,
  "name": "Pomodoro Timer",
  "version": "1.0.0",
  "description": "Simple Pomodoro technique timer",

  "permissions": ["alarms", "storage", "notifications"],

  "background": {
    "service_worker": "background/background.js"
  },

  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },

  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

**Verification**: Extension loads without permission errors

---

### **Phase 2: Core Backend Logic**

#### Issue #3: TimerManager Class
```javascript
// background/background.js
class TimerManager {
  constructor() {
    this.state = {
      mode: 'focus',           // 'focus'|'shortBreak'|'longBreak'
      status: 'idle',          // 'idle'|'running'|'paused'|'completed'
      timeLeft: 1500,          // 25 min = 1500 seconds
      totalTime: 1500,
      completedPomodoros: 0
    };
  }

  async start(mode = 'focus') {
    // Set durations based on mode
    // Save state to chrome.storage.local
    // Create alarm for ticking
  }

  async pause() {
    // Clear alarm, save state
  }

  async reset() {
    // Clear alarm, reset to default state
  }

  async getState() {
    // Return current state from storage
  }
}

const timerManager = new TimerManager();
```

**Verification**: `console.log(timerManager.getState())` works

#### Issue #4: Chrome Alarms Integration
```javascript
// Timer tick every second
chrome.alarms.create('pomodoro-tick', {
  delayInMinutes: 1/60,    // Start immediately (1 second)
  periodInMinutes: 1/60    // Repeat every second
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoro-tick') {
    // Decrement timeLeft
    // Update badge
    // Check if completed
    // Save state
  }
});
```

**Verification**: Badge updates every second when timer running

#### Issue #8: Message Protocol (Early Setup)
```javascript
// Background: Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch(message.action) {
    case 'start':
      timerManager.start(message.mode);
      break;
    case 'pause':
      timerManager.pause();
      break;
    case 'reset':
      timerManager.reset();
      break;
    case 'getState':
      sendResponse(timerManager.getState());
      break;
  }
});

// Popup: Send messages to background
chrome.runtime.sendMessage({action: 'start', mode: 'focus'});
```

**Verification**: Popup button clicks trigger background actions

---

### **Phase 3: Frontend UI**

#### Issue #5: Popup HTML Structure
```html
<!-- popup/popup.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="container">
    <div class="mode-selector">
      <button id="focus-btn" class="mode-btn active">Focus</button>
      <button id="short-break-btn" class="mode-btn">Short Break</button>
      <button id="long-break-btn" class="mode-btn">Long Break</button>
    </div>

    <!-- Control Buttons -->
    <div class="controls">
      <button id="start-pause-btn" class="control-btn primary">Start</button>
      <button id="reset-btn" class="control-btn secondary">Reset</button>
    </div>
  </div>

  <script src="popup.js"></script>
</body>
</html>
```

**Verification**: Popup opens with proper layout (320px max width)

#### Issue #6: Popup JavaScript Controller
```javascript
// popup/popup.js
class PopupController {
  constructor() {
    this.initializeElements();
    this.attachEventListeners();
    this.updateDisplay();
  }

  initializeElements() {
    this.timerText = document.getElementById('timer-text');
    this.startPauseBtn = document.getElementById('start-pause-btn');
    this.resetBtn = document.getElementById('reset-btn');
    // etc...
  }

  attachEventListeners() {
    this.startPauseBtn.addEventListener('click', () => {
      this.handleStartPause();
    });

    this.resetBtn.addEventListener('click', () => {
      this.handleReset();
    });
  }

  async updateDisplay() {
    // Get current state from background
    // Update timer display
    // Update button text (Start/Pause)
    // Update mode buttons
  }

  handleStartPause() {
    // Send start or pause message to background
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

new PopupController();
```

**Verification**: Buttons work, timer display updates, state syncs

---

### **Phase 4: Integration Features**

#### Issue #9: Badge Display
```javascript
// In background/background.js alarm listener
async function updateBadge() {
  const state = await getState();

  if (state.status === 'running') {
    const timeText = formatTimeForBadge(state.timeLeft);
    const color = state.mode === 'focus' ? '#FF6B6B' : '#4ECDC4';

    chrome.action.setBadgeText({text: timeText});
    chrome.action.setBadgeBackgroundColor({color: color});
  } else {
    chrome.action.setBadgeText({text: ''});
  }
}

function formatTimeForBadge(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m`;  // "24m", "23m", etc.
}
```

**Verification**: Badge shows countdown, different colors for focus/break

#### Issue #10: Notifications
```javascript
// When timer completes in alarm listener
async function handleTimerComplete(state) {
  const message = state.mode === 'focus'
    ? 'Focus session complete! Time for a break.'
    : 'Break time over! Ready for another focus session?';

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: 'Pomodoro Timer',
    message: message
  });

  // Update state to completed
  state.status = 'completed';
  await saveState(state);
}
```

**Verification**: Notification appears when timer reaches 00:00

---

### **Phase 5: Polish & Enhancement**

#### Issue #7: CSS Styling
```css
/* popup/popup.css */
.container {
  width: 300px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.timer-display {
  text-align: center;
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.mode-btn.active {
  background: #FF6B6B;
  color: white;
}

.control-btn.primary {
  background: #4ECDC4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
```

**Verification**: Clean, professional UI that fits 320px popup

#### Issue #11: Options Page (Optional)
```html
<!-- options/options.html -->
<div class="settings">
  <h2>Pomodoro Settings</h2>

  <label>Focus Duration (minutes):</label>
  <input type="number" id="focus-duration" value="25" min="1" max="60">

  <label>Short Break (minutes):</label>
  <input type="number" id="short-break" value="5" min="1" max="30">

  <label>Long Break (minutes):</label>
  <input type="number" id="long-break" value="15" min="5" max="60">

  <button id="save-settings">Save Settings</button>
</div>
```

---

## 🧪 Testing Flow After Each Phase

### Phase 1 Testing
```bash
1. Load extension in chrome://extensions/
2. Click extension icon → Popup opens without errors
3. Check console → No JavaScript errors
```

### Phase 2 Testing
```bash
1. Open popup → Click Start button
2. Check badge → Should show countdown
3. Wait 1 minute → Badge should update
4. Click pause → Timer should stop
```

### Phase 3 Testing
```bash
1. Click Start → Button changes to "Pause"
2. Timer display updates every second
3. Mode buttons work (Focus/Break switching)
4. Reset button resets to default state
```

### Phase 4 Testing
```bash
1. Start timer → Badge shows countdown with color
2. Let timer complete → Notification appears
3. Different modes show different badge colors
4. Notification click behavior works
```

### Phase 5 Testing
```bash
1. UI looks professional and clean
2. Options page saves/loads settings correctly
3. Custom durations work properly
4. No memory leaks or performance issues
```

---

## 🎯 Final Working Flow

### Complete User Experience
```
1. Install extension
   ↓
2. Click icon → Clean popup opens
   ↓
3. Select Focus mode → Click Start
   ↓
4. Badge shows "24m" countdown in red
   ↓
5. Timer runs for 25 minutes
   ↓
6. Notification: "Focus session complete!"
   ↓
7. Switch to Break mode → Badge turns blue
   ↓
8. Complete break → Ready for next focus
   ↓
9. Access options for custom durations
   ↓
10. Track statistics (optional)
```

### Technical Achievemen
