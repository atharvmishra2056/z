"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular" | "card";
    width?: string | number;
    height?: string | number;
    lines?: number;
}

export default function Skeleton({
    className,
    variant = "rectangular",
    width,
    height,
    lines = 1,
}: SkeletonProps) {
    const baseClasses = "skeleton rounded-lg";
    
    const variantClasses = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg",
        card: "rounded-2xl",
    };

    const style: React.CSSProperties = {
        width: width || "100%",
        height: height || (variant === "text" ? "1rem" : variant === "circular" ? width : "100%"),
    };

    if (variant === "text" && lines > 1) {
        return (
            <div className={cn("space-y-2", className)}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(baseClasses, variantClasses.text)}
                        style={{
                            width: i === lines - 1 ? "70%" : "100%",
                            height: "1rem",
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={cn(baseClasses, variantClasses[variant], className)}
            style={style}
        />
    );
}

// Card skeleton for marketplace
export function CardSkeleton() {
    return (
        <div className="glass-panel shape-squircle p-4 space-y-4">
            <Skeleton variant="rectangular" height={160} className="rounded-xl" />
            <div className="space-y-2">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
            </div>
            <div className="flex justify-between items-center">
                <Skeleton variant="text" width={80} />
                <Skeleton variant="rectangular" width={100} height={36} className="rounded-full" />
            </div>
        </div>
    );
}

// Grid of card skeletons
export function CardGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

// Profile skeleton
export function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={80} height={80} />
                <div className="space-y-2 flex-1">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="60%" />
                </div>
            </div>
            <Skeleton variant="rectangular" height={120} className="rounded-2xl" />
        </div>
    );
}
