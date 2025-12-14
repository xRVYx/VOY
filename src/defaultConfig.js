const defaultConfig = {
  visibilityThreshold: 3,
  blurThreshold: 3,
  copyPasteThreshold: 5,
  scramblePaste: true,
  onDetection: (detail) => {
    // eslint-disable-next-line no-console
    console.warn('[voy] detection', detail);
  },
  forbiddenKeyCombos: [
    'Control+Shift+I',
    'Control+Shift+C',
    'Control+Shift+J',
    'Control+Shift+K',
    'Control+S',
    'Meta+S'
  ]
};

export default defaultConfig;
