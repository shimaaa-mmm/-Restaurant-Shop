module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1C1410',
          50: '#F4F1EE',
          100: '#E6DFD8',
          200: '#C9BBAE',
          300: '#9C8A79',
          400: '#6B584A',
          500: '#3E2E22',
          600: '#2C2119',
          700: '#241A14',
          800: '#1C1410',
          900: '#120D0A',
        },
        saffron: {
          DEFAULT: '#E3A008',
          50: '#FDF6E3',
          100: '#FBEBC0',
          200: '#F6D780',
          300: '#F4C430',
          400: '#EDB013',
          500: '#E3A008',
          600: '#B87F06',
          700: '#8C5F05',
        },
        paprika: {
          DEFAULT: '#C1440E',
          50: '#FBEAE2',
          400: '#D65A25',
          500: '#C1440E',
          600: '#9A360B',
        },
        cream: {
          DEFAULT: '#FBF6EC',
          50: '#FFFDF9',
          100: '#FBF6EC',
          200: '#F3EADA',
        },
      },
      fontFamily: {
        body: ['Vazirmatn', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Noto Naskh Arabic"', 'Vazirmatn', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(28, 20, 16, 0.25)',
        card: '0 8px 24px -8px rgba(28, 20, 16, 0.18)',
        'card-hover': '0 24px 48px -12px rgba(28, 20, 16, 0.35)',
        glow: '0 0 0 1px rgba(227,160,8,0.25), 0 12px 32px -8px rgba(227,160,8,0.35)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        drizzle: {
          '0%': { strokeDashoffset: 240 },
          '100%': { strokeDashoffset: 0 },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease forwards',
        fadeInUp: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.6s infinite linear',
        drizzle: 'drizzle 1.2s ease forwards',
        floaty: 'floaty 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
