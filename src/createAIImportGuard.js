import detectAIImports from './detectAIImports.js';

export default function createAIImportGuard({ report }) {
  return (event) => {
    const target = event.target;
    if (!target || typeof target.value !== 'string') {
      return;
    }

    const originalValue = target.value;
    const { sanitized, triggered } = detectAIImports(originalValue);
    if (!triggered) {
      return;
    }

    const cursor = typeof target.selectionStart === 'number' ? target.selectionStart : sanitized.length;
    target.value = sanitized;
    const caret = Math.min(sanitized.length, cursor);
    target.setSelectionRange(caret, caret);

    if (report) {
      report('ai-import-block', {
        original: originalValue,
        sanitized
      });
    }
  };
}
