"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface SpotlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    as?: "button" | "a";
    href?: string;
    variant?: "primary" | "glass";
}

export default function SpotlightButton({
    children,
    as = "button",
    variant = "primary",
    className = "",
    ...props
}: SpotlightButtonProps) {
    // Fix: Use a generic ref to handle both button and anchor elements
    const btnRef = useRef<any>(null);

    // Fix: Determine the component type
    const Component = as === "a" ? motion.a : motion.button;

    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty("--x", `${x}px`);
            btn.style.setProperty("--y", `${y}px`);
        };

        btn.addEventListener("mousemove", handleMouseMove);
        return () => btn.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const baseStyles = "relative overflow-hidden rounded-full px-8 py-4 font-bold text-lg transition-all duration-300 group";
    const variants = {
        primary: "bg-white text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]",
        glass: "glass-tahoe text-white border-white/20 hover:bg-white/10 hover:scale-105"
    };

    return (
        // @ts-ignore - standard fix for polymorphic refs in framer-motion
        <Component
            ref={btnRef}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {/* The Spotlight Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.15), transparent 40%)`
                }}
            />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </Component>
    );
}