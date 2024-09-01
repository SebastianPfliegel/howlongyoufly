import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Handjet"', ...defaultTheme.fontFamily.mono],
        sc: ['"Noto Sans SC"', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: []
}
