"use client";

import { ReactNode } from "react";

interface RotatingBorderProps {
    children: ReactNode;
    className?: string;
    borderColor?: string;
    speed?: number;
}

export default function RotatingBorder({
                                           children,
                                           className = "",
                                           borderColor = "#ffffff",
                                           speed = 5,
                                       }: RotatingBorderProps) {
    return (
        <div className={`relative ${className}`}>
            {/* Rotating Border */}
            <div
                className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, transparent 340deg, ${borderColor} 360deg)`,
                    animation: `rotate ${speed}s linear infinite`,
                    padding: "2px",
                }}
            >
                <div className="w-full h-full rounded-[2.5rem] bg-black" />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}