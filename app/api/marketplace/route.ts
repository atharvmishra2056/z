// app/api/marketplace/route.ts
import { NextRequest, NextResponse } from 'next/server';

const LZT_BASE = "https://api.lzt.market";

const CATEGORIES: Record<string, string> = {
    valorant: "/valorant",
    steam: "/steam",
    epicgames: "/epicgames",
    battlenet: "/battlenet",
    origin: "/ea",
    minecraft: "/minecraft",
    warface: "/warface",
    fortnite: "/epicgames", // Map to Epic Games
};

// In-memory cache
const cache = new Map<string, { time: number; data: any }>();
const CACHE_TTL = 120 * 1000; // 2 minutes

// Translation helper
async function translateToEnglish(text: string): Promise<string> {
    if (!text) return "";
    try {
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|en`
        );
        const data = await res.json();
        return data?.responseData?.translatedText || text;
    } catch {
        return text;
    }
}

export async function GET(request: NextRequest) {
    // Get token
    const token = process.env.LZT_TOKEN;
    if (!token) {
        return NextResponse.json(
            { error: 'LZT_TOKEN not configured in environment variables' },
            { status: 500 }
        );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'steam';
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || searchParams.get('limit') || '20';
    const title = searchParams.get('title');
    const pmin = searchParams.get('pmin');
    const pmax = searchParams.get('pmax');
    const orderBy = searchParams.get('order_by') || searchParams.get('orderby');

    // Get category endpoint
    const endpoint = CATEGORIES[category.toLowerCase()];
    if (!endpoint) {
        return NextResponse.json(
            { error: `Invalid category: ${category}` },
            { status: 400 }
        );
    }

    // Cache key
    const cacheKey = JSON.stringify({
        category,
        page,
        perPage,
        title,
        pmin,
        pmax,
        orderBy,
    });

    const now = Date.now();

    // Check cache
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)!;
        if (now - cached.time < CACHE_TTL) {
            console.log('✅ Returning cached data');
            return NextResponse.json(cached.data);
        }
    }

    try {
        // Build URL - CORRECT FORMAT!
        const url = new URL(`${LZT_BASE}${endpoint}`);
        url.searchParams.set('page', page);
        url.searchParams.set('per_page', perPage);

        // Add filters
        if (title) url.searchParams.set('title', title);
        if (pmin) url.searchParams.set('pmin', pmin);
        if (pmax) url.searchParams.set('pmax', pmax);
        if (orderBy) url.searchParams.set('order_by', orderBy);

        console.log('🔍 Fetching from LZT:', url.toString());

        const apiResp = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            cache: 'no-store',
        });

        console.log('📡 LZT Response Status:', apiResp.status);

        if (!apiResp.ok) {
            const errorText = await apiResp.text();
            console.error('❌ LZT API Error:', apiResp.status, errorText);
            return NextResponse.json(
                { error: `LZT API Error: ${apiResp.statusText}`, details: errorText },
                { status: apiResp.status }
            );
        }

        const json = await apiResp.json();
        const items = Array.isArray(json.items) ? json.items : [];

        console.log('✅ Fetched', items.length, 'items');

        // Translate titles in parallel
        const translatedItems = await Promise.all(
            items.map(async (item: any) => ({
                ...item,
                itemid: item.item_id || item.itemid,
                title: await translateToEnglish(item.title),
                description: item.description ? await translateToEnglish(item.description) : item.description,
            }))
        );

        console.log('✅ Translated all titles');

        // Construct response
        const data = {
            items: translatedItems,
            totalItems: json.totalItems || json.total || items.length,
            perPage: parseInt(perPage),
            page: parseInt(page),
            hasNextPage: json.hasNextPage || items.length === parseInt(perPage),
            links: json.links,
            meta: json.meta,
        };

        // Cache it
        cache.set(cacheKey, { time: now, data });

        return NextResponse.json(data);
    } catch (error) {
        console.error('💥 Handler error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}