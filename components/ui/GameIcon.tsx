"use client";

import { getGameAsset } from "@/lib/assets";
import { Gamepad2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface GameIconProps {
    slug: string;
    size?: number;
    className?: string;
}

export default function GameIcon({ slug, size = 24, className = "" }: GameIconProps) {
    const asset = getGameAsset(slug);
    const [error, setError] = useState(false);

    // 1. Try to load local SVG/PNG
    if (!error && asset.icon) {
        return (
            <div className={`relative ${className}`} style={{ width: size, height: size }}>
                <Image
                    src={asset.icon}
                    alt={slug}
                    fill
                    className="object-contain"
                    onError={() => setError(true)}
                />
            </div>
        );
    }

    // 2. Fallback: Gradient Circle with Lucide Icon
    return (
        <div
            className={`flex items-center justify-center rounded-full shadow-lg ${className}`}
            style={{
                width: size,
                height: size,
                background: asset.gradient
            }}
        >
            <Gamepad2 size={size * 0.6} className="text-white/80" />
        </div>
    );
}
