"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input, Select, SelectItem, Button, Slider } from "@heroui/react";
import type { MarketFilters, CategoryType } from "@/types/market";
import { CATEGORY_MAP } from "@/types/market";

interface FilterSidebarProps {
    onFilterChange: (filters: MarketFilters) => void;
    onCategoryChange: (category: CategoryType | undefined) => void;
    currentCategory?: CategoryType;
}

export default function FilterSidebar({
                                          onFilterChange,
                                          onCategoryChange,
                                          currentCategory,
                                      }: FilterSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [sortBy, setSortBy] = useState<string>("date_to_down");

    const handleApplyFilters = () => {
        const filters: MarketFilters = {
            title: searchQuery || undefined,
            pmin: priceRange[0] > 0 ? priceRange[0] : undefined,
            pmax: priceRange[1] < 1000 ? priceRange[1] : undefined,
            orderby: sortBy as any,
        };

        onFilterChange(filters);
    };

    const handleReset = () => {
        setSearchQuery("");
        setPriceRange([0, 1000]);
        setSortBy("date_to_down");
        onCategoryChange(undefined);
        onFilterChange({});
    };

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <div className="bg-black/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                <h3 className="text-lg font-black text-white mb-4">Category</h3>

                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onCategoryChange(undefined)}
                        className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                            !currentCategory
                                ? 'bg-white/20 border-2 border-white/30 text-white'
                                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                    >
                        All
                    </motion.button>

                    {Object.entries(CATEGORY_MAP).map(([label, value]) => (
                        <motion.button
                            key={value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onCategoryChange(value)}
                            className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                                currentCategory === value
                                    ? 'bg-white/20 border-2 border-white/30 text-white'
                                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                            }`}
                        >
                            {label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-black/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                <div className="relative space-y-6">
                    <h3 className="text-lg font-black text-white">Filters</h3>

                    {/* Search */}
                    <Input
                        label="Search"
                        placeholder="Search accounts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        classNames={{
                            input: "text-white",
                            inputWrapper: "bg-white/5 border-white/10 hover:border-white/20",
                        }}
                    />

                    {/* Price Range */}
                    <div>
                        <label className="text-sm font-bold text-white mb-3 block">
                            Price Range: ${priceRange[0]} - ${priceRange[1]}
                        </label>
                        <Slider
                            step={10}
                            minValue={0}
                            maxValue={1000}
                            value={priceRange}
                            onChange={(value) => setPriceRange(value as [number, number])}
                            className="max-w-full"
                            classNames={{
                                track: "bg-white/10",
                                filler: "bg-gradient-to-r from-purple-500 to-blue-500",
                                thumb: "bg-white border-2 border-purple-500",
                            }}
                        />
                    </div>

                    {/* Sort By */}
                    <Select
                        label="Sort By"
                        selectedKeys={[sortBy]}
                        onChange={(e) => setSortBy(e.target.value)}
                        classNames={{
                            trigger: "bg-white/5 border-white/10 hover:border-white/20",
                        }}
                    >
                        <SelectItem key="date_to_down" value="date_to_down">
                            Newest First
                        </SelectItem>
                        <SelectItem key="date_to_up" value="date_to_up">
                            Oldest First
                        </SelectItem>
                        <SelectItem key="price_to_down" value="price_to_down">
                            Highest Price
                        </SelectItem>
                        <SelectItem key="price_to_up" value="price_to_up">
                            Lowest Price
                        </SelectItem>
                    </Select>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            radius="full"
                            className="flex-1 bg-gradient-to-r from-white to-gray-100 text-black font-bold"
                            onPress={handleApplyFilters}
                        >
                            Apply Filters
                        </Button>
                        <Button
                            radius="full"
                            variant="bordered"
                            className="border-white/20 text-white hover:bg-white/10"
                            onPress={handleReset}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}