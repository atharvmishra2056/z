"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    variant?: "default" | "deep" | "frosted" | "tahoe";
    hover?: boolean;
    glow?: "none" | "purple" | "blue" | "green" | "red";
    className?: string;
}

const variantClasses = {
    default: "glass-panel",
    deep: "glass-deep",
    frosted: "glass-frosted",
    tahoe: "glass-tahoe",
};

const glowClasses = {
    none: "",
    purple: "hover:glow-purple",
    blue: "hover:glow-blue",
    green: "hover:glow-green",
    red: "hover:glow-red",
};

export default function GlassCard({
    children,
    variant = "default",
    hover = true,
    glow = "none",
    className,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                variantClasses[variant],
                "shape-squircle overflow-hidden",
                hover && "hover-lift cursor-pointer",
                glowClasses[glow],
                className
            )}
            whileHover={hover ? { scale: 1.02 } : undefined}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

// Header variant for cards with a title section
interface GlassCardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function GlassCardHeader({ children, className }: GlassCardHeaderProps) {
    return (
        <div className={cn("px-6 py-4 border-b border-white/5", className)}>
            {children}
        </div>
    );
}

// Body variant for main content
interface GlassCardBodyProps {
    children: ReactNode;
    className?: string;
}

export function GlassCardBody({ children, className }: GlassCardBodyProps) {
    return (
        <div className={cn("p-6", className)}>
            {children}
        </div>
    );
}

// Footer variant for actions
interface GlassCardFooterProps {
    children: ReactNode;
    className?: string;
}

export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
    return (
        <div className={cn("px-6 py-4 border-t border-white/5 bg-white/[0.02]", className)}>
            {children}
        </div>
    );
}

// Stat card variant
interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon?: ReactNode;
}

export function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
    const changeColors = {
        positive: "text-green-400",
        negative: "text-red-400",
        neutral: "text-white/40",
    };

    return (
        <GlassCard hover={false} className="p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{title}</p>
                    <p className="text-3xl font-black text-white">{value}</p>
                    {change && (
                        <p className={cn("text-xs mt-1", changeColors[changeType])}>
                            {change}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-3 rounded-xl bg-white/5 text-white/60">
                        {icon}
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
