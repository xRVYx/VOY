export default function registerListener(target, type, listener, options, listeners) {
  target.addEventListener(type, listener, options);
  listeners.push(() => target.removeEventListener(type, listener, options));
}
