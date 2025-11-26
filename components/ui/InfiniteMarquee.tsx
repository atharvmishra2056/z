"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface InfiniteMarqueeProps {
    children: React.ReactNode;
    direction?: "left" | "right";
    speed?: number;
    className?: string;
}

export default function InfiniteMarquee({
    children,
    direction = "left",
    speed = 20,
    className = "",
}: InfiniteMarqueeProps) {
    const [contentWidth, setContentWidth] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setContentWidth(contentRef.current.scrollWidth);
        }
    }, []);

    // Calculate duration based on width and speed desired
    const duration = contentWidth > 0 ? contentWidth / speed : 10;

    return (
        <div className={`flex overflow-hidden select-none gap-8 ${className}`}>
            <motion.div
                className="flex shrink-0 gap-8 min-w-full"
                animate={{
                    x: direction === "left" ? [0, -contentWidth] : [-contentWidth, 0],
                }}
                transition={{
                    duration: duration,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                <div ref={contentRef} className="flex gap-8">
                    {children}
                </div>
            </motion.div>

            {/* Duplicate for seamless loop */}
            <motion.div
                className="flex shrink-0 gap-8 min-w-full"
                animate={{
                    x: direction === "left" ? [0, -contentWidth] : [-contentWidth, 0],
                }}
                transition={{
                    duration: duration,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                <div className="flex gap-8">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}