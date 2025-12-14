# VOY

`VOY` is a lightweight helper for educational or professional assessments that need a low-friction way to detect potentially suspicious interactions in a browser context. Install it once, configure a callback, and let it report unusual events without sending any data on its own.

## Quick start

```js
import { createVoy } from 'voy-rvy';

const voy = createVoy({
  onDetection({ type, detail, state }) {
    // send `type`/`detail` to your preferred telemetry or incident path
    console.log('voy event', type, detail, state);
  }
});

voy.start();
// later, if the session ends:
// voy.stop();
```

## Step-by-step usage

1. **Install VOY** in your project:
```bash
npm install voy-rvy
   ```

2. **Import and configure** the factory before your secure session begins:
   ```js
  import { createVoy } from 'voy-rvy';

   const voy = createVoy({
     scramblePaste: true,          // optional: shuffle every paste
     onDetection({ type, detail }) {
       navigator.sendBeacon('/api/telemetry', JSON.stringify({ type, detail }));
     }
   });
   ```
   Replace the `/api/telemetry` placeholder with your real logging sink or endpoint (consider storing the URL in an environment variable so different stages can send data to different receivers).

3. **Start monitoring** when the exam or assessment page loads, e.g. inside `DOMContentLoaded`:
   ```js
   document.addEventListener('DOMContentLoaded', () => {
     voy.start();
   });
   ```

4. **React to detections** via your telemetry backend. Watch for:
   - `visibility-hidden` / `blur` events when the tab loses focus.
   - `copy` / `paste` counts (VOY blocks or shuffles large pastes).
   - `contextmenu` or forbidden key combos (like `Control+Shift+I`).
   - `ai-import-block` when a banned AI import string is removed.

5. **Stop/reset** VOY when the session ends or transitions:
   ```js
   voy.stop();
   // or for section reset:
   voy.reset();
   ```

## What it watches

- **Blurs** (`window.blur`) and **visibility changes** to count how often the tab loses focus.
- **Copy/paste** events to see if students continuously copy or paste larger inputs.
- **Paste scramble** rewrites pasted characters in random order (you can disable it) so pasted answers arrive out of order in the UI, making large clipboard dumps harder to read.
- **AI import guard** strips occurrences of `import claude` or `import codex` that students type or paste and surfaces an `ai-import-block` detection so your telemetry can highlight possible AI assistance attempts.
- **Disabled context menus** that may reveal browser dev tools or shortcuts.
- **Forbidden key combinations** (e.g. `Control+Shift+I`, `Control+S`) that commonly open dev tools or save dialogs.

Any detection fires the user-provided `onDetection` callback with

```json
{
  "type": "event-name",
  "detail": { ...event-specific data },
  "state": { ...currentCounters }
}
```

## Configuration options

| option | default | description |
| --- | --- | --- |
| `visibilityThreshold` | `3` | Number of `visibilitychange` events with `document.hidden` before triggering once. |
| `blurThreshold` | `3` | Number of `blur` events before reporting. |
| `copyPasteThreshold` | `5` | Number of copy or paste events before reporting. |
| `scramblePaste` | `true` | Prevents the default paste by shuffling the clipboard text before inserting it; set to `false` to leave pasted content untouched. |
| `forbiddenKeyCombos` | `['Control+Shift+I', 'Control+Shift+C', 'Control+Shift+J', 'Control+Shift+K', 'Control+S', 'Meta+S']` | Key combos that should trigger immediately when pressed. |
| `onDetection` | `console.warn` wrapper | Callback invoked with each detection. |

## Lifecycle helpers

- `voy.start()` begins monitoring. Safe to call multiple times.
- `voy.stop()` removes listeners and resets internal counters.
- `voy.reset()` clears counters without tearing down listeners (useful for multi-section exams).
- `voy.getState()` returns the latest counter snapshot.

## Best practices

1. Keep the `onDetection` handler lightweight; wire it directly into your logging/telemetry pipeline (e.g., via `navigator.sendBeacon` or a queued `fetch`) so each detection arrives on your server without blocking the UI.
2. Combine this library with server-side scoring, not as the sole proof of misconduct.
3. Always test against the browsers your environment supports before rolling it out.
4. Monitor `ai-import-block` detections in your backend; they indicate attempted references to Claude or Codex that VOY removed before they reached the UI.

## Telemetry hooks

```js
  import { createVoy } from 'voy-rvy';

const sendTelemetry = (payload) => {
  navigator.sendBeacon(process.env.VOY_TELEMETRY_ENDPOINT || '/api/cheat', JSON.stringify(payload));
};

const voy = createVoy({
  scramblePaste: true,
  onDetection({ type, detail, state }) {
    sendTelemetry({ type, detail, state });
  }
});

voy.start();
```

Adapt `sendTelemetry` to whatever backend endpoint or logging sink you operate. Keep the handler small so it merely packages the payload and hands it off.
`ai-import-block` detections are emitted whenever VOY removes a banned AI import statement so you can treat them as higher priority alerts.
