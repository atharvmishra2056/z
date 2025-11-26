"use client";

import { Button } from "@heroui/react";
import { ArrowDownAZ, ArrowUpAZ, Clock, RotateCcw } from "lucide-react";

interface TacticalFooterProps {
    currentSort?: string;
    onSortChange?: (sort: string) => void;
}

export default function TacticalFooter({ currentSort = "default", onSortChange }: TacticalFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex items-center justify-between">

            {/* Left: Results Count */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                    <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
                        Live Feed Active
                    </span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-white font-mono text-sm">
                    Shown ~ <span className="text-white font-bold">50,176</span> accounts
                </span>
            </div>

            {/* Right: Sort Controls */}
            <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs uppercase tracking-wider mr-2 hidden sm:block">Sort By:</span>

                <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                    <Button
                        size="sm"
                        variant={currentSort === 'default' ? "flat" : "light"}
                        className={`text-xs h-8 ${currentSort === 'default' ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                        onClick={() => onSortChange?.('default')}
                    >
                        Default
                    </Button>
                    <Button
                        size="sm"
                        variant={currentSort === 'price_asc' ? "flat" : "light"}
                        className={`text-xs h-8 ${currentSort === 'price_asc' ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                        startContent={<ArrowDownAZ size={14} />}
                        onClick={() => onSortChange?.('price_asc')}
                    >
                        Cheap
                    </Button>
                    <Button
                        size="sm"
                        variant={currentSort === 'price_desc' ? "flat" : "light"}
                        className={`text-xs h-8 ${currentSort === 'price_desc' ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                        startContent={<ArrowUpAZ size={14} />}
                        onClick={() => onSortChange?.('price_desc')}
                    >
                        Expensive
                    </Button>
                    <Button
                        size="sm"
                        variant={currentSort === 'newest' ? "flat" : "light"}
                        className={`text-xs h-8 ${currentSort === 'newest' ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                        startContent={<Clock size={14} />}
                        onClick={() => onSortChange?.('newest')}
                    >
                        Newest
                    </Button>
                </div>

                <div className="h-4 w-px bg-white/10 mx-2" />

                <Button
                    size="sm"
                    variant="flat"
                    className="text-brand-accent hover:bg-brand-accent/10 h-8"
                    startContent={<RotateCcw size={14} />}
                    onClick={() => onSortChange?.('default')}
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}
