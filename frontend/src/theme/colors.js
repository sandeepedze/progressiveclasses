export const colors = {
    // Primary Gradient Colors (Purple/Indigo)
    primary: {
        start: '#6366F1', // Indigo 500
        end: '#8B5CF6',   // Violet 500
        DEFAULT: '#6366F1',
        light: '#818CF8',
        dark: '#4F46E5',
        bg: '#EEF2FF', // Indigo 50
    },
    // Accent Colors (Blue/Orange)
    accent: {
        blue: '#3B82F6',
        orange: '#F97316',
        pink: '#EC4899',
        teal: '#14B8A6',
    },
    // Semantics
    success: '#10B981', // Emerald 500
    warning: '#F59E0B', // Amber 500
    danger: '#EF4444',  // Red 500
    info: '#3B82F6',    // Blue 500

    // Neutrals / Backgrounds
    background: {
        light: '#F3F4F6', // Gray 100
        dark: '#0F172A',  // Slate 900
        cardLight: '#FFFFFF',
        cardDark: '#1E293B', // Slate 800
    },
    text: {
        primaryLight: '#111827', // Gray 900
        secondaryLight: '#6B7280', // Gray 500
        primaryDark: '#F9FAFB', // Gray 50
        secondaryDark: '#9CA3AF', // Gray 400
    },
    border: {
        light: '#E5E7EB', // Gray 200
        dark: '#334155',  // Slate 700
    }
};

export const gradients = {
    primary: [colors.primary.start, colors.primary.end],
    subscription: ['#F59E0B', '#F97316'], // Orange to Amber
    admin: ['#3B82F6', '#2563EB'], // Blue
    success: ['#34D399', '#10B981'],
    danger: ['#F87171', '#EF4444'],
};
