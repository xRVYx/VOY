export default function createCopyHandler({ state, config, maybeReport }) {
  return () => {
    state.copy += 1;
    maybeReport('copy', state.copy, config.copyPasteThreshold);
  };
}
