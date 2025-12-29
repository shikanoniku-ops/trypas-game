/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'screen-dynamic': 'calc(var(--vh, 1vh) * 100)',
        'screen-90': 'calc(var(--vh, 1vh) * 90)',
        'screen-80': 'calc(var(--vh, 1vh) * 80)',
        'screen-70': 'calc(var(--vh, 1vh) * 70)',
      },
      minHeight: {
        'screen-dynamic': 'calc(var(--vh, 1vh) * 100)',
      },
      maxHeight: {
        'screen-dynamic': 'calc(var(--vh, 1vh) * 100)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      }
    },
  },
  plugins: [],
}
