import shuffleText from './shuffleText.js';
import insertScrambledText from './insertScrambledText.js';
import detectAIImports from './detectAIImports.js';

export default function createPasteHandler({ state, config, maybeReport, report }) {
  return (event) => {
    const clipboardValue = event?.clipboardData?.getData?.('text/plain') ?? '';
    const { sanitized, triggered } = detectAIImports(clipboardValue);
    const sanitizedValue = triggered ? sanitized : clipboardValue;
    const shouldScramble = config.scramblePaste && sanitizedValue;
    const detail = {
      count: state.paste + 1,
      originalLength: clipboardValue.length
    };

    let scrambledLength = 0;
    if (shouldScramble) {
      const scrambled = shuffleText(sanitizedValue);
      scrambledLength = scrambled.length;
      insertScrambledText(event, scrambled);
    } else if (triggered) {
      insertScrambledText(event, sanitizedValue);
    }

    state.paste += 1;
    if (scrambledLength > 0) {
      detail.scrambledLength = scrambledLength;
    }
    if (triggered) {
      detail.aiImportBlocked = true;
      detail.sanitizedLength = sanitizedValue.length;
    }

    maybeReport('paste', state.paste, config.copyPasteThreshold, detail);

    if (triggered && report) {
      report('ai-import-block', {
        original: clipboardValue,
        sanitized: sanitizedValue
      });
    }
  };
}
