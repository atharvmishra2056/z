"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpStatsProps {
    value: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export default function CountUpStats({
    value,
    prefix = "",
    suffix = "",
    className = "",
}: CountUpStatsProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
        duration: 2.5, // Slow, premium feel
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                // Format with commas for thousands (e.g., 10,000)
                ref.current.textContent = 
                    prefix + Math.floor(latest).toLocaleString("en-US") + suffix;
            }
        });
    }, [springValue, prefix, suffix]);

    return <span ref={ref} className={className} />;
}