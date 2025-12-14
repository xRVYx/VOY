export default function createVisibilityHandler({ state, config, maybeReport }) {
  return () => {
    if (document.hidden) {
      state.hidden += 1;
      maybeReport('visibility-hidden', state.hidden, config.visibilityThreshold);
    }
  };
}
