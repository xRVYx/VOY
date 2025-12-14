export default function createBlurHandler({ state, config, maybeReport }) {
  return () => {
    state.blur += 1;
    maybeReport('blur', state.blur, config.blurThreshold);
  };
}
