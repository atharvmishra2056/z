// app/api/marketplace/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ITEMS } from '@/lib/mock-data';

const CATEGORY_MAP: Record<number, string> = {
    13: 'valorant',
    1: 'steam',
    9: 'fortnite',
    12: 'epicgames',
    11: 'battlenet',
    28: 'minecraft',
    15: 'clash-of-clans',
};

export async function GET(request: NextRequest) {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || searchParams.get('limit') || '20');
    const title = searchParams.get('title')?.toLowerCase();
    const pmin = searchParams.get('pmin') ? parseFloat(searchParams.get('pmin')!) : undefined;
    const pmax = searchParams.get('pmax') ? parseFloat(searchParams.get('pmax')!) : undefined;
    const orderBy = searchParams.get('order_by') || searchParams.get('orderby');

    console.log('🔍 Marketplace API called with:', { category, page, perPage, title, pmin, pmax, orderBy });

    // Filter items
    let filteredItems = [...MOCK_ITEMS];

    // Filter by category
    if (category !== 'all') {
        const categoryLower = category.toLowerCase();
        filteredItems = filteredItems.filter(item => {
            const itemCategory = CATEGORY_MAP[item.category_id]?.toLowerCase();
            return itemCategory === categoryLower || categoryLower === 'epicgames' && itemCategory === 'fortnite';
        });
    }

    // Filter by title
    if (title) {
        filteredItems = filteredItems.filter(item =>
            item.title.toLowerCase().includes(title)
        );
    }

    // Filter by price range
    if (pmin !== undefined) {
        filteredItems = filteredItems.filter(item => item.price >= pmin);
    }
    if (pmax !== undefined) {
        filteredItems = filteredItems.filter(item => item.price <= pmax);
    }

    // Sort items
    if (orderBy) {
        switch (orderBy) {
            case 'price_asc':
                filteredItems.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filteredItems.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filteredItems.sort((a, b) => (b.publisheddate || 0) - (a.publisheddate || 0));
                break;
            case 'oldest':
                filteredItems.sort((a, b) => (a.publisheddate || 0) - (b.publisheddate || 0));
                break;
        }
    }

    // Pagination
    const totalItems = filteredItems.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    const data = {
        items: paginatedItems,
        totalItems,
        perPage,
        page,
        hasNextPage: endIndex < totalItems,
    };

    console.log(`✅ Returning ${paginatedItems.length} dummy items (page ${page}/${Math.ceil(totalItems / perPage)})`);
    return NextResponse.json(data);
}