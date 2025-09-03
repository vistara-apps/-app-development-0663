/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 15% 95%)',
        text: 'hsl(220 10% 15%)',
        accent: 'hsl(262 70% 55%)',
        primary: 'hsl(220 100% 50%)',
        surface: 'hsl(220 15% 100%)',
      },
      spacing: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.1)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'hsl(220 10% 15%)',
            a: {
              color: 'hsl(262 70% 55%)',
              '&:hover': {
                color: 'hsl(262 70% 45%)',
              },
            },
          },
        },
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  plugins: [],
}
