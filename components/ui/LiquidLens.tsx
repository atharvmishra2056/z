"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface Tab {
    id: string;
    label: string;
    href: string;
}

interface LiquidLensProps {
    tabs: Tab[];
    activeTabId: string;
    onHover: (id: string | null) => void;
}

export default function LiquidLens({ tabs, activeTabId, onHover }: LiquidLensProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/20 border border-white/5">
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    href={tab.href}
                    onMouseEnter={() => {
                        setHoveredId(tab.id);
                        onHover(tab.id);
                    }}
                    onMouseLeave={() => {
                        setHoveredId(null);
                        onHover(null);
                    }}
                    className="relative px-6 py-2.5 rounded-full text-sm font-bold transition-colors focus:outline-none"
                >
                    {/* The Sliding Glass Lens (Now with Glow) */}
                    {hoveredId === tab.id && (
                        <motion.div
                            layoutId="lens-glass"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            className="absolute inset-0 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                        />
                    )}

                    {/* Content */}
                    <span className={`relative z-10 flex items-center gap-2 transition-colors ${
                        hoveredId === tab.id ? "text-white" : "text-white/60"
                    }`}>
                        {tab.label}
                    </span>
                </Link>
            ))}
        </div>
    );
}