"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import type { MarketFilters, CategoryType } from "@/types/market";

export default function MarketplacePage() {
    // DEBUG: Quick status check for API route and API token
    const [apiStatus, setApiStatus] = useState<string>('Checking...');

    useEffect(() => {
        fetch('/api/market?limit=1')
            .then(res => {
                if (res.ok) {
                    setApiStatus('✅ API Connected');
                } else {
                    res.json().then(data => {
                        setApiStatus(`❌ API Error: ${data.error}`);
                    });
                }
            })
            .catch(err => {
                setApiStatus(`❌ Network Error: ${err.message}`);
            });
    }, []);

    // Main marketplace state management
    const [category, setCategory] = useState<CategoryType | undefined>();
    const [filters, setFilters] = useState<MarketFilters>({});

    return (
        <main className="min-h-screen bg-black overflow-hidden">
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-[1600px]">

                {/* DEBUG STATUS - REMOVE AFTER TESTING */}
                <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <p className="text-yellow-400 font-mono text-sm">
                        API Status: {apiStatus}
                    </p>
                    <p className="text-yellow-400/70 font-mono text-xs mt-1">
                        Token Set: {process.env.NEXT_PUBLIC_LZT_API_TOKEN ? '✅ Yes' : '❌ No'}
                    </p>
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black gradient-text">
                        Live Marketplace
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 font-medium max-w-3xl mx-auto">
                        Browse thousands of verified gaming accounts from trusted sellers.
                        All transactions protected by LZT Market.
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <FilterSidebar
                                onFilterChange={setFilters}
                                onCategoryChange={setCategory}
                                currentCategory={category}
                            />
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="lg:col-span-3">
                        <MarketplaceGrid category={category} filters={filters} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
