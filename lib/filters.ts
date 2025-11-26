import { MarketItem } from "@/types/api-types";
import { FilterState, SortOption } from "@/contexts/MarketContext";

// Get game category ID from slug
export function getGameIdFromSlug(slug: string): number {
    const gameMap: Record<string, number> = {
        "valorant": 13,
        "steam": 1,
        "fortnite": 9,
        "clash-of-clans": 15,
        "minecraft": 28,
        "battlenet": 11,
        "epic-games": 12,
        "warface": 4
    };
    return gameMap[slug] || 13;
}

// Filter by search query
export function filterBySearch(items: MarketItem[], query: string): MarketItem[] {
    if (!query.trim()) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );
}

// Filter by game category
export function filterByGame(items: MarketItem[], gameSlug: string | null): MarketItem[] {
    if (!gameSlug) return items;

    const gameId = getGameIdFromSlug(gameSlug);
    return items.filter(item => item.category_id === gameId);
}

// Filter by price range
export function filterByPriceRange(items: MarketItem[], min: number, max: number): MarketItem[] {
    return items.filter(item => item.price >= min && item.price <= max);
}

// Filter by Valorant ranks
export function filterByRanks(items: MarketItem[], ranks: string[]): MarketItem[] {
    if (ranks.length === 0) return items;

    return items.filter(item => {
        if (!item.valorant_rank) return false;
        return ranks.includes(String(item.valorant_rank));
    });
}

// Filter by regions
export function filterByRegions(items: MarketItem[], regions: string[]): MarketItem[] {
    if (regions.length === 0) return items;

    return items.filter(item => {
        const region = item.valorant_region;
        if (!region) return false;
        return regions.includes(region);
    });
}

// Filter by origins
export function filterByOrigins(items: MarketItem[], origins: string[]): MarketItem[] {
    if (origins.length === 0) return items;

    return items.filter(item => {
        // Simplified since original_owner properties don't exist
        const isNativeEmail = item.email_type === 'native' || item.email_type === 'personal';

        if (origins.includes("original") && isNativeEmail) return true;
        if (origins.includes("full-access") && item.email_type !== 'no_market') return true;

        return false;
    });
}

// Filter by competitive history
export function filterByHistory(items: MarketItem[], hasHistory: string): MarketItem[] {
    if (hasHistory === "no-matter") return items;

    return items.filter(item => {
        // Assume items have competitive history if they have high ranks/levels
        const hasCompetitiveHistory = (item.valorant_rank && item.valorant_rank > 0) ||
            (item.steam_vac_bans === 0);

        if (hasHistory === "yes" && hasCompetitiveHistory) return true;
        if (hasHistory === "no" && !hasCompetitiveHistory) return true;

        return false;
    });
}

// Filter by level range
export function filterByLevelRange(items: MarketItem[], min: number, max: number): MarketItem[] {
    return items.filter(item => {
        const level = item.steam_level || item.clash_town_hall_level || 0;
        return level >= min && level <= max;
    });
}

// Sort items
export function sortItems(items: MarketItem[], sortBy: SortOption): MarketItem[] {
    const sorted = [...items];

    switch (sortBy) {
        case "price_asc":
            return sorted.sort((a, b) => a.price - b.price);
        case "price_desc":
            return sorted.sort((a, b) => b.price - a.price);
        case "newest":
            return sorted.sort((a, b) => {
                const dateA = a.publisheddate || 0;
                const dateB = b.publisheddate || 0;
                return dateB - dateA;
            });
        case "oldest":
            return sorted.sort((a, b) => {
                const dateA = a.publisheddate || 0;
                const dateB = b.publisheddate || 0;
                return dateA - dateB;
            });
        default:
            return sorted;
    }
}

// Apply all filters
export function applyAllFilters(items: MarketItem[], filters: FilterState, sortBy: SortOption): MarketItem[] {
    let filtered = items;

    // Apply each filter in sequence
    filtered = filterBySearch(filtered, filters.searchQuery);
    filtered = filterByGame(filtered, filters.selectedGame);
    filtered = filterByPriceRange(filtered, filters.priceMin, filters.priceMax);
    filtered = filterByRanks(filtered, filters.selectedRanks);
    filtered = filterByRegions(filtered, filters.selectedRegions);
    filtered = filterByOrigins(filtered, filters.selectedOrigins);
    filtered = filterByHistory(filtered, filters.hasCompetitiveHistory);
    filtered = filterByLevelRange(filtered, filters.minLevel, filters.maxLevel);

    // Apply sorting
    filtered = sortItems(filtered, sortBy);

    return filtered;
}

// Paginate items
export function paginateItems(items: MarketItem[], page: number, itemsPerPage: number): MarketItem[] {
    const startIndex = 0;
    const endIndex = page * itemsPerPage;
    return items.slice(startIndex, endIndex);
}
