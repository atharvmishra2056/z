export const designTokens = {
    glass: {
        default: "bg-black/60 backdrop-blur-xl border border-white/10",
        heavy: "bg-black/80 backdrop-blur-2xl border border-white/10",
        light: "bg-white/5 backdrop-blur-lg border border-white/10",
        card: "bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10",
        input: "bg-white/5 border border-white/20 focus:border-white/40 transition-all outline-none",
    },
    gradients: {
        primary: "bg-gradient-to-r from-brand-primary to-brand-secondary", // Assuming these exist in tailwind config, otherwise use hex
        success: "bg-gradient-to-r from-green-500 to-emerald-600",
        crypto: "bg-gradient-to-r from-purple-500 to-indigo-600",
        dark: "bg-gradient-to-b from-black via-zinc-900 to-black",
    },
    spacing: {
        page: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
        cardPadding: "p-6 sm:p-8",
    },
    rounded: {
        default: "rounded-2xl",
        lg: "rounded-3xl",
        sm: "rounded-xl",
    },
    text: {
        heading: "font-bold text-white tracking-tight",
        subheading: "text-white/60 text-sm",
        label: "text-xs font-bold text-white/40 uppercase tracking-wider",
    }
};
