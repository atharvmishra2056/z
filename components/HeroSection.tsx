"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Chip } from "@heroui/react";
import TextType from "@/components/ui/TextType";
import SpotlightButton from "@/components/ui/SpotlightButton";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    
    // Parallax effect for the video inside the glass
    const y = useTransform(scrollY, [0, 1000], [0, 200]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        // Reduced top margin on mobile (mt-2 vs mt-8)
        <section id="home" className="relative w-full flex flex-col items-center justify-center mt-2 md:mt-8 perspective-1000">
            
            {/* --- ATMOSPHERE GLOWS (Behind the glass) --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-primary/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-brand-secondary/10 rounded-full blur-[100px] md:blur-[140px] animate-float" />
            </div>

            {/* --- THE LIQUID PORTAL CONTAINER --- */}
            <motion.div 
                ref={containerRef}
                style={{ opacity }}
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                // Responsive Height: 85vh on mobile prevents cutoff, fixed height on desktop
                className="relative w-full h-[85vh] min-h-[550px] md:h-auto md:min-h-[800px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-tahoe z-10 group"
            >
                {/* 1. The Video Layer */}
                <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                    <video
                        className="w-full h-full object-cover opacity-100" // Increased base opacity
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    >
                        <source src="/cute.mp4" type="video/mp4" />
                    </video>
                </motion.div>

                {/* 2. The "Tahoe" Texture Overlays (Enhanced Fade) */}
                {/* Darkens the video generally for text readability */}
                <div className="absolute inset-0 bg-black/40" /> 
                
                {/* Top Fade (prevents harsh cutoff at top) */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
                
                {/* Bottom Fade (seamless blend) */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-void via-void/40 to-transparent" /> 
                
                {/* Grain texture for realism */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* 3. Content Layer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pb-10 md:pb-0">
                    
                    {/* Badge */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mb-6 md:mb-8"
                    >
                        <Chip
                            variant="bordered"
                            classNames={{
                                base: "glass-tahoe border-white/20 px-4 py-2 h-auto",
                                content: "text-white/90 font-bold tracking-wide text-[10px] md:text-xs uppercase",
                            }}
                        >
                            ✨ The #1 Premium Marketplace
                        </Chip>
                    </motion.div>

                    {/* Giant Headline (Slam Effect) */}
                    <div className="overflow-hidden mb-4 md:mb-6">
                        <motion.h1
                            initial={{ y: 100, rotateX: 20 }}
                            animate={{ y: 0, rotateX: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.9]"
                        >
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
                                KXW x KUZZ
                            </span>
                        </motion.h1>
                    </div>

                    {/* Subtitle with Typewriter */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-lg md:text-2xl text-white/80 max-w-3xl font-medium leading-relaxed mb-8 md:mb-10 px-4"
                    >
                        <span className="hidden md:inline">We are the ultimate destination for </span>
                        <span className="md:hidden">The best place for </span>
                        <TextType
                            text={["Gamers", "Streamers", "Creators", "Collectors"]}
                            className="text-brand-primary font-bold inline-block"
                            typingSpeed={80}
                            cursorClassName="bg-brand-primary"
                        />
                    </motion.div>

                    {/* CTA Buttons (Spotlight) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0"
                    >
                        <SpotlightButton variant="primary" className="w-full sm:w-auto text-sm md:text-lg py-3 md:py-4">
                            Explore Market
                        </SpotlightButton>
                        
                        <SpotlightButton variant="glass" className="w-full sm:w-auto text-sm md:text-lg py-3 md:py-4">
                            View Stock
                        </SpotlightButton>
                    </motion.div>
                </div>

            </motion.div>
        </section>
    );
}