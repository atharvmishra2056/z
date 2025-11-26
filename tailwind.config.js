/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                satoshi: ['Satoshi', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                jakarta: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Existing Glass Colors (Preserved)
                'glass-white': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
                'glass-hover': 'rgba(255, 255, 255, 0.08)',
                
                // NEW: The Void Palette (Tahoe Upgrade)
                void: {
                    DEFAULT: '#050505', // Deepest black
                    light: '#0a0a0a',
                },
                glass: {
                    surface: 'rgba(20, 20, 20, 0.6)',
                    highlight: 'rgba(255, 255, 255, 0.05)',
                },
                // Hyper-Accents (Glows)
                brand: {
                    primary: '#7c3aed', // Cyber Purple
                    secondary: '#3b82f6', // Electric Blue
                    accent: '#FF4655', // Valorant Red
                    success: '#10b981', // Toxic Green
                }
            },
            backdropBlur: {
                xs: '2px',
                glass: '16px',
                'glass-heavy': '24px',
                'tahoe': '24px', // The signature blur
            },
            boxShadow: {
                glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glass-inset': 'inset 0 2px 8px 0 rgba(255, 255, 255, 0.05)',
                'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.5)',
                glow: '0 0 20px rgba(255, 255, 255, 0.1)',
                'tahoe': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                'purple-glow': '0 0 20px rgba(124, 58, 237, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                float: 'float 6s ease-in-out infinite',
                glow: 'glow 2s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'tilt': 'tilt 10s infinite linear',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%, 100%': { opacity: '0.5' },
                    '50%': { opacity: '1' },
                },
                tilt: {
                    '0%, 50%, 100%': { transform: 'rotate(0deg)' },
                    '25%': { transform: 'rotate(0.5deg)' },
                    '75%': { transform: 'rotate(-0.5deg)' },
                },
            },
        },
    },
    darkMode: 'class',
    plugins: [],
}