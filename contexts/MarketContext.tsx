"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type SortOption = "default" | "price_asc" | "price_desc" | "newest" | "oldest";

export interface FilterState {
    selectedGame: string | null;
    searchQuery: string;
    priceMin: number;
    priceMax: number;
    selectedRanks: string[];
    selectedRegions: string[];
    selectedOrigins: string[];
    hasCompetitiveHistory: string; // "no-matter" | "yes" | "no"
    minLevel: number;
    maxLevel: number;
}

interface MarketContextType {
    filters: FilterState;
    sortBy: SortOption;
    currentPage: number;
    itemsPerPage: number;
    setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    setSortBy: (sort: SortOption) => void;
    resetFilters: () => void;
    setSearchQuery: (query: string) => void;
    setSelectedGame: (game: string | null) => void;
    nextPage: () => void;
    resetPagination: () => void;
}

const INITIAL_FILTERS: FilterState = {
    selectedGame: null,
    searchQuery: "",
    priceMin: 0,
    priceMax: 10000,
    selectedRanks: [],
    selectedRegions: [],
    selectedOrigins: [],
    hasCompetitiveHistory: "no-matter",
    minLevel: 0,
    maxLevel: 1000
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [sortBy, setSortByState] = useState<SortOption>("default");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const setSortBy = (sort: SortOption) => {
        setSortByState(sort);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters(INITIAL_FILTERS);
        setSortByState("default");
        setCurrentPage(1);
    };

    const setSearchQuery = (query: string) => {
        setFilter("searchQuery", query);
    };

    const setSelectedGame = (game: string | null) => {
        setFilter("selectedGame", game);
        // Reset game-specific filters when changing games
        setFilters(prev => ({
            ...prev,
            selectedGame: game,
            selectedRanks: [],
            selectedRegions: [],
            minLevel: 0,
            maxLevel: 1000
        }));
    };

    const nextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const resetPagination = () => {
        setCurrentPage(1);
    };

    const value: MarketContextType = {
        filters,
        sortBy,
        currentPage,
        itemsPerPage,
        setFilter,
        setSortBy,
        resetFilters,
        setSearchQuery,
        setSelectedGame,
        nextPage,
        resetPagination
    };

    return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket() {
    const context = useContext(MarketContext);
    if (context === undefined) {
        throw new Error("useMarket must be used within a MarketProvider");
    }
    return context;
}
