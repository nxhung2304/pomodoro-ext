import { MODES } from "../constants/mode.js";

const NOTIFICATION_MESSAGES = {
 [MODES.focus]: {
   title: "Focus is successfully"
 },
 [MODES.shortBreak]: {
   title: "Short break is successfully"
 },
 [MODES.longBreak]:  {
   title: "Long break is successfully"
 }
};

const NOTIFICATION_KEY = "completed-notification"

// Function: showTimerCompleteNotification
// Requirements: Display a notification to the user when timer ends.
// Input: mode (string) - one of MODES values ('focus', 'shortBreak', 'longBreak')
// Output: Promise<string> - notification ID on success
// Expectations:
//   - Valid mode: show appropriate notification
//   - Invalid mode: log warning, show generic fallback or throw
// Edge cases: Mode not found in NOTIFICATION_MESSAGES
// Notes: Use chrome.notifications.create() with iconUrl pointing to extension icon
export function showTimerCompleteNotification(mode) {
  const validMode = Object.values(MODES).includes(mode);

  if (!validMode) {
    console.warn(`Mode = ${mode} is invalid`)
  }

  const options =  {
    type: 'basic',
    title: NOTIFICATION_MESSAGES[MODES.focus].title,
    message: 'Hello, world! This is a rich notification.',
    iconUrl: chrome.runtime.getURL("icons/icon-128.png"),
    priority: 2
  }
  chrome.notifications.create(NOTIFICATION_KEY, options, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('Notification error:', chrome.runtime.lastError.message);
    } else {
      console.log('Notification created:', notificationId);
    }
  });

    // TODO: Get title and message from NOTIFICATION_MESSAGES for given mode
    // TODO: Handle case where mode is not found
    // TODO: Create notification options object with type, iconUrl, title, message
    // TODO: Call chrome.notifications.create() and return notification ID
}

// Function: clearNotification (optional enhancement)
// Requirements: Clear a notification by ID
// Input: notificationId (string)
// Output: Promise<boolean> - true if cleared successfully
// Notes: Useful for cleaning up after user interaction
export async function clearNotification(notificationId) {
    // TODO: Call chrome.notifications.clear(notificationId)
}
