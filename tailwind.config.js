/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Backgrounds
        'bg-primary': '#0F172A',
        'bg-secondary': '#1E293B',
        'bg-card': '#111827',
        'border-subtle': '#1F2937',

        // Accent — Indigo
        'accent-primary': '#6366F1',
        'accent-hover': '#818CF8',
        'accent-active': '#4F46E5',

        // Success — Emerald
        'success': '#10B981',
        'success-hover': '#34D399',
        'success-dark': '#059669',

        // Warning / Error
        'warning': '#F59E0B',
        'error': '#EF4444',

        // Typography
        'text-primary': '#F8FAFC',
        'text-secondary': '#CBD5E1',
        'text-muted': '#64748B',

        // Shadcn UI Tokens
        border: '#1F2937',
        input: '#1F2937',
        ring: '#6366F1',
        background: '#0F172A',
        foreground: '#F8FAFC',
        primary: {
          DEFAULT: '#6366F1',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1E293B',
          foreground: '#CBD5E1',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#1E293B',
          foreground: '#64748B',
        },
        accent: {
          DEFAULT: '#1E293B',
          foreground: '#F8FAFC',
        },
        popover: {
          DEFAULT: '#111827', // Using bg-card color for popovers
          foreground: '#F8FAFC',
        },
        card: {
          DEFAULT: '#111827',
          foreground: '#F8FAFC',
        },
      },
      letterSpacing: {
        'hero': '-0.02em',
        'section': '-0.01em',
      },
    },
  },
  plugins: [],
}
