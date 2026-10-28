import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: { extend: { colors: { ink: '#11100E', ice: '#3E7CB8', cream: '#EDECE6', paper: '#E3E1D9', muted: '#77736C' } } },
  plugins: [],
} satisfies Config;
