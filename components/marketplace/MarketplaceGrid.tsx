"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pagination, Spinner } from "@heroui/react";
import { useMarketAccounts } from "@/hooks/useMarket";
import MarketplaceCard from "./MarketplaceCard";
import type { MarketFilters, CategoryType } from "@/types/market";

interface MarketplaceGridProps {
    category?: CategoryType;
    filters?: MarketFilters;
}

export default function MarketplaceGrid({ category, filters }: MarketplaceGridProps) {
    const [page, setPage] = useState(1);
    const perPage = 12;

    const { data, loading, error } = useMarketAccounts({
        category,
        filters,
        page,
        perPage,
    });

    if (loading && page === 1) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner size="lg" color="white" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-[2rem] p-8">
                <div className="text-center space-y-4">
                    <div className="text-6xl">⚠️</div>
                    <div>
                        <p className="text-red-400 font-bold text-xl mb-2">Error Loading Accounts</p>
                        <p className="text-white/70 mb-4">{error}</p>

                        {/* Debug info */}
                        <details className="text-left bg-black/50 rounded-xl p-4 mt-4">
                            <summary className="cursor-pointer text-white/60 font-mono text-sm">
                                Technical Details (click to expand)
                            </summary>
                            <div className="mt-2 text-xs text-white/50 font-mono space-y-2">
                                <p>Category: {category || 'all'}</p>
                                <p>Page: {page}</p>
                                <p>Filters: {JSON.stringify(filters, null, 2)}</p>
                                <p>Timestamp: {new Date().toISOString()}</p>
                            </div>
                        </details>

                        <div className="mt-6 space-y-3">
                            <p className="text-sm text-white/60">Common fixes:</p>
                            <ul className="text-xs text-white/50 space-y-1 text-left max-w-md mx-auto">
                                <li>✓ Check if NEXT_PUBLIC_LZT_API_TOKEN is set in .env.local</li>
                                <li>✓ Restart dev server after adding token (npm run dev)</li>
                                <li>✓ Verify token has "market" scope permissions</li>
                                <li>✓ Check browser console for detailed errors (F12)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-12 text-center">
                <p className="text-white/70 text-lg">No accounts found matching your criteria.</p>
            </div>
        );
    }

    const totalPages = Math.ceil(data.totalItems / perPage);

    return (
        <>
            <div className="space-y-8">
                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 font-medium">Total Accounts</p>
                            <p className="text-3xl font-black gradient-text">{data.totalItems.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-white/60 font-medium">Page</p>
                            <p className="text-3xl font-black text-white">{page} / {totalPages}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.items.map((item, index) => (
                        <motion.div
                            key={item.itemid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <MarketplaceCard
                                item={item}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center pt-8">
                        <Pagination
                            total={totalPages}
                            page={page}
                            onChange={setPage}
                            showControls
                            classNames={{
                                wrapper: "gap-2",
                                item: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
                                cursor: "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold",
                            }}
                        />
                    </div>
                )}
            </div>
        </>
    );
}