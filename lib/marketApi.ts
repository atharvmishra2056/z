// lib/marketApi.ts
import type { MarketItem, MarketItemListResponse, MarketFilters, CategoryType } from '@/types/market';

/**
 * Fetch market items via our Next.js API route
 */
export async function fetchMarketItems({
                                           page = 1,
                                           perPage = 20,
                                           category,
                                           filters = {},
                                       }: {
    page?: number;
    perPage?: number;
    category?: CategoryType;
    filters?: MarketFilters;
}): Promise<MarketItemListResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(), // Changed from 'limit' to 'per_page'
    });

    if (category) {
        params.append('category', category);
    }

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    try {
        const response = await fetch(`/api/marketplace?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Market API Error:', error);
        throw error instanceof Error ? error : new Error('Failed to fetch market items');
    }
}

/**
 * Fetch single market item
 */
export async function fetchMarketItem(itemid: number): Promise<MarketItem> {
    try {
        const response = await fetch(`/api/item/${itemid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch account details');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Item API Error:', error);
        throw error instanceof Error ? error : new Error('Failed to fetch account details');
    }
}

/**
 * Get marketplace statistics
 */
export async function fetchMarketStats(): Promise<{
    totalAccounts: number;
    steamAccounts: number;
    valorantAccounts: number;
    epicAccounts: number;
}> {
    try {
        const [steam, valorant, epic] = await Promise.all([
            fetchMarketItems({ category: 'steam', perPage: 1 }),
            fetchMarketItems({ category: 'valorant', perPage: 1 }),
            fetchMarketItems({ category: 'epicgames', perPage: 1 }),
        ]);

        return {
            totalAccounts: steam.totalItems + valorant.totalItems + epic.totalItems,
            steamAccounts: steam.totalItems,
            valorantAccounts: valorant.totalItems,
            epicAccounts: epic.totalItems,
        };
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return {
            totalAccounts: 0,
            steamAccounts: 0,
            valorantAccounts: 0,
            epicAccounts: 0,
        };
    }
}