"use client";

import Navbar from "@/components/Navbar";
import TacticalFooter from "@/components/TacticalFooter";
import TacticalCard from "@/components/TacticalCard";
import AdvancedFilters, { FilterConfig } from "@/components/AdvancedFilters";
import { Button, Slider } from "@heroui/react";
import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Filter, SlidersHorizontal } from "lucide-react";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { debounce } from "@/lib/utils";

// Helper to get slug from category ID
const getSlug = (id: number) => {
    const slugMap: Record<number, string> = {
        1: "steam",
        4: "warface",
        9: "fortnite",
        11: "battlenet",
        12: "epic-games",
        13: "valorant",
        15: "clash-of-clans",
        28: "minecraft",
    };
    return slugMap[id] || "valorant";
};

// Category tabs with colors
const CATEGORIES = [
    { key: "all", label: "All", color: "#22c55e" },
    { key: "valorant", label: "Valorant", id: 13, color: "#ff4655" },
    { key: "steam", label: "Steam", id: 1, color: "#1b2838" },
    { key: "fortnite", label: "Fortnite", id: 9, color: "#9d4dbb" },
    { key: "minecraft", label: "Minecraft", id: 28, color: "#62b47a" },
    { key: "clash-of-clans", label: "CoC", id: 15, color: "#f5a623" },
    { key: "epic-games", label: "Epic", id: 12, color: "#0078f2" },
    { key: "battlenet", label: "Blizzard", id: 11, color: "#00aeff" },
];

export default function MarketplacePage() {
    const [sortBy, setSortBy] = useState<string>("default");
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterConfig>({});
    const [priceRange, setPriceRange] = useState<number[]>([0, 500]);

    // Fetch items from LZT API
    const fetchItems = async (pageNum: number = 1, category?: string, search?: string, append: boolean = false) => {
        if (append) {
            setIsLoadingMore(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const params = new URLSearchParams({
                page: pageNum.toString()
            });

            // Add category (use slug for API)
            if (category && category !== "all") {
                params.append('category', category);
            }

            // Add search query
            if (search) {
                params.append('search', search);
            }
            
            // Add price filters
            if (filters.pmin) params.append('pmin', filters.pmin.toString());
            if (filters.pmax) params.append('pmax', filters.pmax.toString());
            if (filters.order_by) params.append('order_by', filters.order_by);

            const response = await fetch(`/api/marketplace/items?${params}`);
            const data = await response.json();

            if (!data.success && data.items?.length === 0) {
                // Not an error, just no results
                setItems(append ? items : []);
                setTotalItems(0);
            } else {
                const newItems = data.items || [];
                setItems(append ? [...items, ...newItems] : newItems);
                setTotalItems(data.totalItems || newItems.length);
            }
            setPage(pageNum);
        } catch (err: any) {
            console.error('Error fetching marketplace:', err);
            setError(err.message || 'Failed to load marketplace items');
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            fetchItems(1, selectedCategory, query);
        }, 500),
        [selectedCategory]
    );

    // Handle search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Initial load and category change
    useEffect(() => {
        fetchItems(1, selectedCategory, searchQuery);
    }, [selectedCategory]);

    const handleRefresh = () => {
        fetchItems(1, selectedCategory, searchQuery);
    };

    const handleLoadMore = () => {
        fetchItems(page + 1, selectedCategory, searchQuery, true);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setPage(1);
        setFilters({}); // Reset filters on category change
    };
    
    const handleFiltersApply = () => {
        fetchItems(1, selectedCategory, searchQuery);
    };
    
    const handlePriceChange = (value: number | number[]) => {
        const [min, max] = value as number[];
        setPriceRange([min, max]);
        setFilters(prev => ({
            ...prev,
            pmin: min > 0 ? min : undefined,
            pmax: max < 500 ? max : undefined
        }));
    };

    return (
        <main className="min-h-screen bg-void overflow-x-hidden selection:bg-brand-primary/30 pb-20">
            {/* Fixed Nav */}
            <div className="fixed top-6 z-50 w-full flex justify-center pointer-events-none">
                <div className="pointer-events-auto w-full">
                    <Navbar />
                </div>
            </div>

            {/* Cyber Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            <div className="container mx-auto px-4 pt-32 relative z-10 max-w-[1600px]">

                {/* MARKET HEADER */}
                <div className="flex flex-col gap-6 mb-8 border-b border-white/10 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                                Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Ledger</span>
                            </h1>
                            <p className="text-white/40 font-mono text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                SYSTEM_STATUS: OPERATIONAL // {totalItems} ASSETS SECURED
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {/* Search Input */}
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50 w-48 md:w-64"
                                />
                            </div>
                            <Button
                                variant="bordered"
                                className="border-white/20 text-white hover:bg-white/5 font-mono text-xs btn-squircle"
                                onClick={handleRefresh}
                                isDisabled={loading}
                                startContent={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
                            >
                                REFRESH
                            </Button>
                        </div>
                    </div>

                    {/* Category Pills - No Scrollbar */}
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => handleCategoryChange(cat.key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                                    selectedCategory === cat.key
                                        ? "text-white shadow-lg"
                                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                                }`}
                                style={selectedCategory === cat.key ? {
                                    backgroundColor: cat.color,
                                    boxShadow: `0 4px 20px -5px ${cat.color}40`
                                } : {}}
                            >
                                <span 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: cat.color }}
                                />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Filters Bar */}
                <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4">
                    {/* Price Range */}
                    <div className="flex-1 min-w-[200px] max-w-[300px]">
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                            <span>Price</span>
                            <span className="text-brand-primary font-mono">
                                ${priceRange[0]} - ${priceRange[1] >= 500 ? '∞' : priceRange[1]}
                            </span>
                        </div>
                        <Slider
                            size="sm"
                            step={10}
                            minValue={0}
                            maxValue={500}
                            value={priceRange}
                            onChange={handlePriceChange}
                            onChangeEnd={() => handleFiltersApply()}
                            color="secondary"
                            className="max-w-full"
                        />
                    </div>
                    
                    {/* Divider */}
                    <div className="w-px h-8 bg-white/10 hidden md:block" />
                    
                    {/* Advanced Filters Button */}
                    <Button
                        variant="bordered"
                        className="border-white/20 text-white hover:bg-white/5"
                        startContent={<SlidersHorizontal size={16} />}
                        onClick={() => setShowFilters(true)}
                    >
                        Advanced
                        {Object.keys(filters).filter(k => filters[k as keyof FilterConfig] !== undefined).length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-brand-primary text-black text-xs rounded-full">
                                {Object.keys(filters).filter(k => filters[k as keyof FilterConfig] !== undefined).length}
                            </span>
                        )}
                    </Button>
                </div>

                {/* MAIN GRID */}
                <div className="flex-1">
                    {/* Loading State with Skeleton */}
                    {loading && items.length === 0 && (
                        <CardGridSkeleton count={12} />
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="glass-panel shape-squircle p-8 text-center">
                            <p className="text-red-400 font-mono mb-4"> {error}</p>
                            <Button
                                onClick={handleRefresh}
                                className="bg-brand-primary text-white btn-squircle"
                            >
                                Try Again
                            </Button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && items.length === 0 && !error && (
                        <div className="glass-panel shape-squircle p-12 text-center">
                            <Search size={48} className="mx-auto mb-4 text-white/20" />
                            <p className="text-white/60 font-mono mb-2">No items found</p>
                            <p className="text-white/40 text-sm">Try adjusting your filters or search query</p>
                        </div>
                    )}

                    {/* Items Grid */}
                    {items.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                {items.map(item => (
                                    <TacticalCard
                                        key={item.item_id}
                                        item={item}
                                        gameSlug={getSlug(item.category_id)}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {items.length < totalItems && (
                                <div className="mt-12 flex justify-center mb-12">
                                    <Button
                                        variant="flat"
                                        className="bg-white/5 text-white/60 hover:text-white w-full max-w-xs font-mono text-xs btn-squircle"
                                        onClick={handleLoadMore}
                                        isLoading={isLoadingMore}
                                    >
                                        {isLoadingMore ? 'LOADING...' : `LOAD MORE (${items.length}/${totalItems})`}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Advanced Filters Modal */}
            <AdvancedFilters
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                selectedGame={selectedCategory}
                filters={filters}
                onFiltersChange={setFilters}
                onApply={handleFiltersApply}
            />

            <TacticalFooter currentSort={sortBy} onSortChange={setSortBy} />
        </main>
    );
}