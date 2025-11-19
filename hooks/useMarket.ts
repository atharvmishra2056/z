// hooks/useMarket.ts
"use client";

import { useEffect, useState, useCallback } from 'react';
import { fetchMarketItems, fetchMarketItem } from '@/lib/marketApi';
import type { MarketItem, MarketItemListResponse, MarketFilters, CategoryType } from '@/types/market';

export function useMarketAccounts({
                                      category,
                                      filters = {},
                                      page = 1,
                                      perPage = 20,
                                  }: {
    category?: CategoryType;
    filters?: MarketFilters;
    page?: number;
    perPage?: number;
}) {
    const [data, setData] = useState<MarketItemListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchMarketItems({ page, perPage, category, filters });
            setData(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [category, page, perPage, JSON.stringify(filters)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

export function useMarketAccount(itemid: number | null) {
    const [item, setItem] = useState<MarketItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!itemid) {
            setItem(null);
            return;
        }

        setLoading(true);
        setError(null);

        fetchMarketItem(itemid)
            .then(setItem)
            .catch((e) => setError(e instanceof Error ? e.message : 'Unknown error'))
            .finally(() => setLoading(false));
    }, [itemid]);

    return { item, loading, error };
}