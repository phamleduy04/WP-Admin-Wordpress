function defineBackground(callback: () => void) {
  return { config: {}, run: callback };
}

export default defineBackground(() => {
  console.log('WordPress Admin Switcher background script initialized');
});