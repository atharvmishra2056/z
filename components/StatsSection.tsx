"use client";

import CountUpStats from "@/components/ui/CountUpStats";
import { motion } from "framer-motion";

const STATS = [
    {
        id: 1,
        label: "Verified Accounts",
        value: 12500,
        prefix: "",
        suffix: "+",
        color: "from-brand-primary to-purple-600", // Solid Purple
        delay: 0,
    },
    {
        id: 2,
        label: "Total Transactions",
        value: 850,
        prefix: "$",
        suffix: "k+",
        color: "from-brand-secondary to-blue-600", // Solid Blue
        delay: 1.5,
    },
    {
        id: 3,
        label: "Active Gamers",
        value: 45000,
        prefix: "",
        suffix: "",
        color: "from-brand-success to-green-600", // Solid Green
        delay: 0.5,
    },
    {
        id: 4,
        label: "Review Score",
        value: 4.9,
        prefix: "⭐ ",
        suffix: "/5",
        color: "from-orange-500 to-red-600", // Solid Orange
        delay: 2,
    },
];

export default function StatsSection() {
    return (
        <section className="relative py-32 w-full overflow-hidden">
            {/* Background "Speed Lines" (Subtle) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent delay-700" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {STATS.map((stat) => (
                        <div key={stat.id} className="flex justify-center">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: stat.delay * 0.2 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                {/* The Floating Animation Wrapper */}
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: stat.delay, // Randomize float start
                                    }}
                                    className="relative w-64 h-64 flex flex-col items-center justify-center"
                                >
                                    {/* --- EXTERNAL GLOW (Behind the sphere) --- */}
                                    <div className={`absolute -inset-10 bg-gradient-to-br ${stat.color} opacity-40 blur-3xl rounded-full z-0`} />

                                    {/* --- THE GLASS SPHERE --- */}
                                    <div
                                        className={`absolute inset-0 rounded-full bg-white/5 border border-white/20 backdrop-blur-md overflow-hidden transition-transform duration-500 group-hover:scale-105 z-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]`}
                                    >
                                        {/* Core Light Source */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/40 opacity-80" />

                                        {/* Colored Internal Gradient */}
                                        <div className={`absolute inset-0 opacity-50 bg-gradient-to-br ${stat.color} mix-blend-overlay`} />

                                        {/* Inner Shadow for Depth */}
                                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-full" />

                                        {/* Specular Highlight (Top Left) */}
                                        <div className="absolute top-6 left-6 w-20 h-10 bg-white/80 blur-lg rounded-full rotate-[-45deg]" />

                                        {/* Rim Light (Bottom Right) */}
                                        <div className="absolute bottom-4 right-4 w-32 h-32 bg-gradient-to-tl from-white/30 to-transparent blur-xl rounded-full opacity-60" />
                                    </div>

                                    {/* --- CONTENT --- */}
                                    <div className="relative z-10 text-center space-y-2">
                                        <div className="text-4xl lg:text-5xl font-black text-white drop-shadow-lg tracking-tight">
                                            <CountUpStats
                                                value={stat.value}
                                                prefix={stat.prefix}
                                                suffix={stat.suffix}
                                            />
                                        </div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-white/60 group-hover:text-brand-primary transition-colors">
                                            {stat.label}
                                        </p>
                                    </div>

                                    {/* Orbiting Ring (Decorative) */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-8 rounded-full border border-white/5 border-t-white/20 border-l-transparent pointer-events-none"
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}