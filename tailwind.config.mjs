/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cherry: '#D7263D',
        'cherry-dark': '#9E1B2C',
        pink: '#FFD6E0',
        'pink-soft': '#FFE9F0',
        cream: '#FFF5E4',
        brown: '#5C4033',
        'brown-soft': '#8A6A57'
      },
      fontFamily: {
        pixel: ['"Mona12"', '"Mona12 Text KR"', 'Tahoma', 'monospace'],
        retro: ['"Mona12"', '"Mona12 Text KR"', 'Tahoma', '"MS Sans Serif"', 'sans-serif']
      },
      boxShadow: {
        win95: '2px 2px 0 0 rgba(92, 64, 51, 0.4)',
        'win95-inset':
          'inset 1px 1px 0 0 rgba(255,255,255,0.8), inset -1px -1px 0 0 rgba(92,64,51,0.35)',
        bookmark: '3px 3px 0 0 rgba(158, 27, 44, 0.35)'
      },
      keyframes: {
        bounceCherry: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        sparkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.1) rotate(15deg)' }
        },
        shine: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '100%': { transform: 'translateX(220%) skewX(-20deg)' }
        }
      },
      animation: {
        bounceCherry: 'bounceCherry 1.2s ease-in-out infinite',
        sparkle: 'sparkle 1.4s ease-in-out infinite',
        shine: 'shine 2.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
