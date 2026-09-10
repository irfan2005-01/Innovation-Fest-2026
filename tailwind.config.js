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
        obsidian: {
          950: '#03050C',
          900: '#050814',
          850: '#080C1E',
          800: '#0B0F19',
          700: '#111728',
          600: '#1E293B',
        },
        nexora: {
          cyan: '#00F2FE',
          violet: '#8B5CF6',
          orange: '#F97316',
          pink: '#EC4899',
          emerald: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #00F2FE 0%, #8B5CF6 50%, #F97316 100%)',
        'cyan-violet': 'linear-gradient(135deg, #00F2FE 0%, #8B5CF6 100%)',
        'violet-orange': 'linear-gradient(135deg, #8B5CF6 0%, #F97316 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.35)',
        'neon-violet': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'neon-orange': '0 0 25px -5px rgba(249, 115, 22, 0.35)',
      }
    },
  },
  plugins: [],
}

