export default function ensureDom() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('VOY must run in a browser environment');
  }
}
