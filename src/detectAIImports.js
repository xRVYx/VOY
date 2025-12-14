const bannedPhrases = ['import claude', 'import codex'];

export default function detectAIImports(value) {
  if (!value) {
    return { sanitized: value, triggered: false };
  }

  let sanitized = value;
  let triggered = false;

  for (const phrase of bannedPhrases) {
    const regex = new RegExp(phrase, 'gi');
    if (regex.test(sanitized)) {
      triggered = true;
      sanitized = sanitized.replace(regex, '');
    }
  }

  return { sanitized, triggered };
}
