"use client";

import { motion } from "framer-motion";
import { Button, Chip } from "@heroui/react";
import TextType from "@/components/ui/TextType";

export default function HeroSection() {
    return (
        <section
            id="home"
            className="relative w-full min-h-[700px] lg:min-h-[800px] flex items-center rounded-[2.5rem] overflow-hidden shadow-glass-lg mt-8"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden
                >
                    <source src="/cute.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/60 to-black/80" />

                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"
                />
            </div>

            <div className="absolute inset-0 z-10 glassmorphism-light" />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="relative z-20 flex flex-col gap-10 px-8 md:px-16 lg:px-24 py-20 max-w-6xl"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Chip
                        variant="bordered"
                        classNames={{
                            base: "glassmorphism border-white/30 px-6 py-6",
                            content: "text-white font-bold text-sm",
                        }}
                    >
                        🎮 #1 Gaming Marketplace
                    </Chip>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] gradient-text"
                >
                    KXW x KuzzBoost
                </motion.h1>

                {/* Subtitle with TextType */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.6 }}
                    className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/95 leading-relaxed max-w-4xl"
                >
                    <span>We are the best marketplace for </span>
                    <TextType
                        text={["gamers", "tech enthusiasts", "streamers", "content creators"]}
                        className="font-black gradient-text inline"
                        typingSpeed={100}
                        deletingSpeed={50}
                        pauseDuration={1500}
                        showCursor={true}
                        cursorCharacter="|"
                        cursorClassName="text-white/80"
                    />
                    <span>. You'll find all your account needs here.</span>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-5 mt-4"
                >
                    <Button
                        size="lg"
                        radius="full"
                        className="bg-gradient-to-r from-white to-gray-100 text-black font-bold text-base px-10 py-7 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        View Whole Marketplace
                    </Button>

                    <Button
                        size="lg"
                        radius="full"
                        variant="bordered"
                        className="glassmorphism border-white/40 text-white font-bold text-base px-10 py-7 hover:bg-white/10 transition-all"
                    >
                        View Valorant Accounts
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
}