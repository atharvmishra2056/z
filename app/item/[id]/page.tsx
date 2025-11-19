"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ItemDetailView from '@/components/marketplace/ItemDetailView';
import { MarketItem } from '@/types/market';

export default function ItemPage() {
    const params = useParams();
    const id = params.id as string;
    const [item, setItem] = useState<MarketItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchItem = async () => {
                try {
                    setLoading(true);
                    const res = await fetch(`/api/item/${id}`);
                    if (!res.ok) {
                        throw new Error('Failed to fetch item');
                    }
                    const data = await res.json();
                    setItem(data.item);
                } catch (e) {
                    setError(e instanceof Error ? e.message : 'An unknown error occurred');
                } finally {
                    setLoading(false);
                }
            };
            fetchItem();
        }
    }, [id]);

    return (
        <div className="container mx-auto px-4 py-8">
            <ItemDetailView item={item} loading={loading} error={error} />
        </div>
    );
}
