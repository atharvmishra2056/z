"use client";

import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { UsersIcon } from "@/components/icons/UsersIcon";
import { ShoppingBagIcon } from "@/components/icons/ShoppingBagIcon";
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon";
import { ZapIcon } from "@/components/icons/ZapIcon";

const stats = [
    {
        label: "Active Users",
        value: "10K+",
        icon: UsersIcon,
        color: "rgba(59, 130, 246, 0.25)",
        iconColor: "#3b82f6",
        iconBg: "from-blue-500/20 to-blue-600/10",
    },
    {
        label: "Accounts Sold",
        value: "50K+",
        icon: ShoppingBagIcon,
        color: "rgba(168, 85, 247, 0.25)",
        iconColor: "#a855f7",
        iconBg: "from-purple-500/20 to-purple-600/10",
    },
    {
        label: "Success Rate",
        value: "99.9%",
        icon: CheckCircleIcon,
        color: "rgba(34, 197, 94, 0.25)",
        iconColor: "#22c55e",
        iconBg: "from-green-500/20 to-green-600/10",
    },
    {
        label: "Support Time",
        value: "<1hr",
        icon: ZapIcon,
        color: "rgba(251, 146, 60, 0.25)",
        iconColor: "#fb923c",
        iconBg: "from-orange-500/20 to-orange-600/10",
    },
];

export default function StatsSection() {
    return (
        <section className="w-full py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <SpotlightCard spotlightColor={stat.color} className="h-full">
                            <div className="relative h-full rounded-3xl border border-white/[0.08] bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_48px_rgba(0,0,0,0.5)] hover:border-white/[0.15] transition-all duration-500 p-6">
                                {/* Subtle inner glow */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                                <div className="relative flex flex-col items-center text-center gap-4">
                                    {/* Icon with rounded gradient background */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.iconBg} border border-white/[0.08] flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                                        <stat.icon fill={stat.iconColor} size={28} />
                                    </div>

                                    {/* Value & Label */}
                                    <div>
                                        <p className="text-3xl lg:text-4xl font-black gradient-text mb-1">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs lg:text-sm text-white/60 font-semibold">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}