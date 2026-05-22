/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#D5D6E2',
        card: '#FFFFFF',
        soft: '#C7C8D6',
        ink: '#1F1F2E',
        heading: '#2D2D3A',
        muted: '#8A8B98',
        accent: '#E783DA',
        'accent-soft': '#F5C9EE',
        'accent-deep': '#D670C6',
        silver: '#B8BCC8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
