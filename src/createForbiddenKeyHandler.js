import normalizeCombo from './normalizeCombo.js';

export default function createForbiddenKeyHandler({ state, config, report }) {
  return (event) => {
    const combo = normalizeCombo(event);
    if (!combo) {
      return;
    }

    if (config.forbiddenKeyCombos.includes(combo)) {
      state.forbiddenKey += 1;
      report('forbidden-key', { combo, count: state.forbiddenKey });
      event.preventDefault();
    }
  };
}
