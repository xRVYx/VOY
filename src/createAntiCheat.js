import defaultConfig from './defaultConfig.js';
import ensureDom from './ensureDom.js';
import createBlurHandler from './createBlurHandler.js';
import createVisibilityHandler from './createVisibilityHandler.js';
import createCopyHandler from './createCopyHandler.js';
import createPasteHandler from './createPasteHandler.js';
import createContextMenuHandler from './createContextMenuHandler.js';
import createForbiddenKeyHandler from './createForbiddenKeyHandler.js';
import registerListener from './registerListener.js';

export function createAntiCheat(userConfig = {}) {
  const config = {
    ...defaultConfig,
    ...userConfig,
    forbiddenKeyCombos: userConfig.forbiddenKeyCombos || defaultConfig.forbiddenKeyCombos
  };

  const thresholdsMet = new Set();
  const state = {
    blur: 0,
    hidden: 0,
    copy: 0,
    paste: 0,
    contextmenu: 0,
    forbiddenKey: 0
  };

  const listeners = [];
  let active = false;

  const report = (type, detail = {}) => {
    config.onDetection({ type, detail, state: { ...state } });
  };

  const maybeReport = (type, count, threshold, detail = {}) => {
    if (!threshold || threshold <= 0) {
      return;
    }

    if (count >= threshold && !thresholdsMet.has(type)) {
      thresholdsMet.add(type);
      report(type, { ...detail, threshold });
    }
  };

  const reset = () => {
    state.blur = 0;
    state.hidden = 0;
    state.copy = 0;
    state.paste = 0;
    state.contextmenu = 0;
    state.forbiddenKey = 0;
    thresholdsMet.clear();
  };

  const blurHandler = createBlurHandler({ state, config, maybeReport });
  const visibilityHandler = createVisibilityHandler({ state, config, maybeReport });
  const copyHandler = createCopyHandler({ state, config, maybeReport });
  const pasteHandler = createPasteHandler({ state, config, maybeReport });
  const contextMenuHandler = createContextMenuHandler({ state, report });
  const forbiddenKeyHandler = createForbiddenKeyHandler({ state, config, report });

  const start = () => {
    if (active) {
      return;
    }

    ensureDom();

    registerListener(window, 'blur', blurHandler, undefined, listeners);
    registerListener(document, 'visibilitychange', visibilityHandler, undefined, listeners);
    registerListener(document, 'copy', copyHandler, undefined, listeners);
    registerListener(document, 'paste', pasteHandler, undefined, listeners);
    registerListener(document, 'contextmenu', contextMenuHandler, { capture: true }, listeners);
    registerListener(document, 'keydown', forbiddenKeyHandler, undefined, listeners);

    active = true;
  };

  const stop = () => {
    if (!active) {
      return;
    }

    listeners.splice(0, listeners.length).forEach((remove) => remove());
    reset();
    active = false;
  };

  return {
    start,
    stop,
    reset,
    getState: () => ({ ...state }),
    isActive: () => active,
    config
  };
}
