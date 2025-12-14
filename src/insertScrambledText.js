export default function insertScrambledText(event, text) {
  if (!text) {
    return;
  }

  event.preventDefault();
  const target = event.target;

  if (
    target &&
    typeof target.value === 'string' &&
    typeof target.selectionStart === 'number' &&
    typeof target.selectionEnd === 'number'
  ) {
    const start = target.selectionStart;
    const end = target.selectionEnd;
    target.value = `${target.value.slice(0, start)}${text}${target.value.slice(end)}`;
    const caret = start + text.length;
    target.setSelectionRange(caret, caret);
    return;
  }

  const selection = document.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    return;
  }

  document.execCommand('insertText', false, text);
}
