export default function normalizeCombo(event) {
  const parts = [];
  if (event.ctrlKey) parts.push('Control');
  if (event.metaKey) parts.push('Meta');
  if (event.altKey) parts.push('Alt');
  if (event.shiftKey) parts.push('Shift');

  const key = (event.key || '').toUpperCase();
  if (key && key.length === 1) {
    parts.push(key);
  } else if (
    ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(key)
  ) {
    parts.push(key);
  }

  return parts.join('+');
}
