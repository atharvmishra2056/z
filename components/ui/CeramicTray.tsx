"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { ReactNode } from "react";

interface CeramicTrayProps {
    isOpen: boolean;
    items: Array<{ key: string; label: string; icon: ReactNode }>;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export default function CeramicTray({ isOpen, items, onMouseEnter, onMouseLeave }: CeramicTrayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    // Safety Handlers attached here
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] pt-6 z-50"
                >
                    <div className="relative p-1 bg-void border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                        
                        {/* The "Ceramic" Matte Texture */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
                        
                        <div className="relative p-6 grid grid-cols-2 gap-2">
                            {items.map((item) => (
                                <Button
                                    key={item.key}
                                    as="a"
                                    href={`/marketplace?category=${item.key}`}
                                    variant="light"
                                    className="justify-start h-16 px-4 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col items-start ml-3">
                                        <span className="text-white font-bold text-sm tracking-wide group-hover:text-brand-primary transition-colors">
                                            {item.label}
                                        </span>
                                        <span className="text-white/30 text-[10px] font-mono uppercase">View Inventory</span>
                                    </div>
                                </Button>
                            ))}
                        </div>

                        {/* Bottom Status Bar */}
                        <div className="relative px-6 py-3 bg-white/5 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-mono text-white/40 tracking-widest">SYSTEM: READY</span>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                <span className="text-[10px] font-mono text-brand-primary">LIVE MARKET</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}