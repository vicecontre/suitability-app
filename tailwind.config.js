/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1971c2',
          active: '#145591',
          disabled: '#a9c9e8',
        },
        ink: '#0a0b0d',
        body: '#5b616e',
        muted: '#7c828a',
        'muted-soft': '#a8acb3',
        hairline: '#dee1e6',
        'hairline-soft': '#eef0f3',
        canvas: '#ffffff',
        'surface-soft': '#f7f7f7',
        'surface-strong': '#eef0f3',
        'surface-dark': '#0a0b0d',
        'surface-dark-elevated': '#16181c',
        'semantic-up': '#05b169',
        'semantic-down': '#cf202f',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        base: '16px',
        md: '20px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        section: '96px',
      },
      borderRadius: {
        none: '0px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        pill: '100px',
        full: '9999px',
      }
    },
  },
  plugins: [],
}
