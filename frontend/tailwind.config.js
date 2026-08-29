/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background, #07090E)',
        foreground: 'var(--foreground, #F8FAFC)',
        card: {
          DEFAULT: 'var(--card, #0D111A)',
          foreground: 'var(--card-foreground, #F8FAFC)',
        },
        popover: {
          DEFAULT: 'var(--popover, #131826)',
          foreground: 'var(--popover-foreground, #F8FAFC)',
        },
        primary: {
          DEFAULT: 'var(--primary, #00F0FF)',
          foreground: 'var(--primary-foreground, #000000)',
        },
        secondary: {
          DEFAULT: 'var(--secondary, #1C2234)',
          foreground: 'var(--secondary-foreground, #F8FAFC)',
        },
        muted: {
          DEFAULT: 'var(--muted, #131826)',
          foreground: 'var(--muted-foreground, #94A3B8)',
        },
        destructive: {
          DEFAULT: 'var(--destructive, #F43F5E)',
          foreground: 'var(--destructive-foreground, #FFFFFF)',
        },
        border: 'var(--border, rgba(255, 255, 255, 0.08))',
        input: 'var(--input, rgba(255, 255, 255, 0.08))',
        ring: 'var(--ring, #00F0FF)',
        surface: {
          0: '#07090E',   // Deep obsidian canvas
          1: '#0D111A',   // Primary card surface
          2: '#131826',   // Elevated card / input surface
          3: '#1C2234',   // Popovers & active states
          4: '#252D44',   // Borders & dividers
        },
        brand: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
          accent: '#00F0FF', // Electric cyan
        },
        accent: {
          DEFAULT: 'var(--accent, #1C2234)',
          foreground: 'var(--accent-foreground, #F8FAFC)',
          teal: '#00F0FF',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          violet: '#8B5CF6',
          indigo: '#6366F1',
        },
        ops: {
          bg: '#07090E',
          card: '#0D111A',
          panel: '#131826',
          border: '#1C2234',
          hover: '#192033',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-teal': '0 0 24px -4px rgba(0, 240, 255, 0.25)',
        'glow-emerald': '0 0 24px -4px rgba(16, 185, 129, 0.25)',
        'glow-rose': '0 0 24px -4px rgba(244, 63, 94, 0.25)',
        'glow-violet': '0 0 24px -4px rgba(139, 92, 246, 0.25)',
        'card-surface': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 240, 255, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
