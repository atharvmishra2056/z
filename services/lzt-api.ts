/**
 * LZT Market API Integration Service
 * Mega Phase 2.0: Complete API Integration
 * 
 * This service handles all interactions with the LZT Market API:
 * - Fetching marketplace items with English translation
 * - Dynamic pricing (2x + margin)
 * - Proxy purchases (buy on behalf of user)
 * - Balance monitoring
 * - Category-specific queries
 * - Seller information
 * 
 * API Endpoints:
 * - / - All latest accounts
 * - /steam - Steam accounts
 * - /fortnite - Fortnite accounts
 * - /riot - Riot accounts (Valorant, LoL)
 * - /supercell - Supercell accounts (Clash of Clans, etc.)
 * - /epicgames - Epic Games accounts
 * - /battlenet - Battle.net accounts
 * - /minecraft - Minecraft accounts
 * - /warface - Warface accounts
 */

import {
    LZTItem,
    LZTItemListResponse,
    LZTItemDetailResponse,
    LZTPurchaseResponse,
    LZTBalanceResponse,
    LZTBaseFilters,
    LZTSteamFilters,
    LZTValorantFilters,
    LZT_CATEGORIES,
} from '@/types/lzt-types';

// Use prod-api as primary (more stable), fallback to api
const LZT_API_ENDPOINTS = [
    'https://prod-api.lzt.market',
    'https://api.lzt.market'
];
const LZT_TOKEN = process.env.LZT_TOKEN;

if (!LZT_TOKEN && typeof window === 'undefined') {
    console.warn('⚠️ LZT_TOKEN not found - API calls will fail');
}

// Category slug to API endpoint mapping
export const CATEGORY_ENDPOINTS: Record<string, string> = {
    'all': '/',
    'steam': '/steam',
    'valorant': '/riot', // Valorant is under /riot
    'fortnite': '/fortnite',
    'minecraft': '/minecraft',
    'clash-of-clans': '/supercell',
    'epic-games': '/epicgames',
    'battlenet': '/battlenet',
    'warface': '/warface',
};

// API Headers with authorization
const getHeaders = () => ({
    'Authorization': `Bearer ${LZT_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

// Rate limiting helper (120 req/min = 500ms between requests)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 500; // ms
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // ms

/**
 * Fetch with retry logic and endpoint fallback
 */
async function fetchWithRetry(
    path: string, 
    options?: RequestInit,
    retries = MAX_RETRIES
): Promise<Response> {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();
    
    let lastError: Error | null = null;
    
    // Try each endpoint
    for (const baseUrl of LZT_API_ENDPOINTS) {
        const url = `${baseUrl}${path}`;
        
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: getHeaders(),
                });
                
                // If successful or client error (4xx), return
                if (response.ok || (response.status >= 400 && response.status < 500)) {
                    return response;
                }
                
                // Server error (5xx) - retry
                if (response.status >= 500) {
                    const errorText = await response.text();
                    console.warn(`⚠️ LZT API ${response.status} from ${baseUrl}, attempt ${attempt + 1}/${retries + 1}:`, errorText.slice(0, 200));
                    lastError = new Error(`LZT API Error: ${response.status}`);
                    
                    if (attempt < retries) {
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
                    }
                    continue;
                }
                
                return response;
            } catch (error: any) {
                console.warn(`⚠️ Fetch error from ${baseUrl}, attempt ${attempt + 1}:`, error.message);
                lastError = error;
                
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
                }
            }
        }
    }
    
    throw lastError || new Error('All LZT API endpoints failed');
}

// Legacy function for backwards compatibility
async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
    // Extract path from full URL
    const urlObj = new URL(url);
    return fetchWithRetry(urlObj.pathname + urlObj.search, options);
}

// Build query string from filters object
function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    searchParams.append('i18n', 'en'); // Always English
    
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(v => searchParams.append(`${key}[]`, String(v)));
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([k, v]) => {
                    searchParams.append(`${key}[${k}]`, String(v));
                });
            } else {
                searchParams.append(key, String(value));
            }
        }
    });
    
    return searchParams.toString();
}

/**
 * Dynamic Pricing Engine
 * Formula: (originalPrice * 2) + margin
 * Margin: $2 for items under $20, $5 for $20+
 */
export function calculateDisplayPrice(lztPrice: number): {
    displayPrice: number;
    lztPrice: number;
    margin: number;
    markup: number;
} {
    const markup = lztPrice * 2;
    const margin = lztPrice < 20 ? 2 : 5;
    const displayPrice = markup + margin;

    return {
        displayPrice: Number(displayPrice.toFixed(2)),
        lztPrice: Number(lztPrice.toFixed(2)),
        margin,
        markup: Number(markup.toFixed(2))
    };
}

/**
 * Apply pricing to item
 */
function applyPricing<T extends { price?: number }>(item: T): T & {
    original_price: number;
    display_price: number;
    our_margin: number;
    our_markup: number;
} {
    const pricing = calculateDisplayPrice(item.price || 0);
    return {
        ...item,
        original_price: pricing.lztPrice,
        display_price: pricing.displayPrice,
        our_margin: pricing.margin,
        our_markup: pricing.markup,
    };
}

/**
 * Apply pricing to array of items
 */
function applyPricingToItems<T extends { price?: number }>(items: T[]): Array<T & {
    original_price: number;
    display_price: number;
    our_margin: number;
    our_markup: number;
}> {
    return items.map(item => applyPricing(item));
}

/**
 * Fetch marketplace items by category slug
 * Supports: all, steam, valorant, fortnite, minecraft, clash-of-clans, epic-games, battlenet, warface
 */
export async function fetchMarketplaceItems(
    filters: LZTBaseFilters = {},
    categorySlug: string = 'all'
): Promise<LZTItemListResponse> {
    try {
        const endpoint = CATEGORY_ENDPOINTS[categorySlug] || '/';
        const queryString = buildQueryString(filters);
        const path = `${endpoint}?${queryString}`;
        
        console.log(`🔍 Fetching LZT items [${categorySlug}]:`, path);

        const response = await fetchWithRetry(path, {
            next: { revalidate: 60 } // Cache for 1 minute
        } as any);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LZT API Error Response:', errorText.slice(0, 500));
            throw new Error(`LZT API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle different response structures
        let rawItems = data.items || [];
        
        // Some endpoints return items directly in the response
        if (!rawItems.length && Array.isArray(data)) {
            rawItems = data;
        }
        
        const items = applyPricingToItems(rawItems);

        return {
            items,
            totalItems: data.totalItems || data.total_items || items.length,
            page: filters.page || 1,
        };
    } catch (error) {
        console.error('❌ Error fetching marketplace items:', error);
        // Return empty result instead of throwing to prevent UI crashes
        return {
            items: [],
            totalItems: 0,
            page: filters.page || 1,
        };
    }
}

/**
 * Fetch Steam items - wrapper using main function
 */
export async function fetchSteamItems(filters: LZTSteamFilters = {}): Promise<LZTItemListResponse> {
    return fetchMarketplaceItems(filters, 'steam');
}

/**
 * Fetch Valorant items - wrapper using main function
 */
export async function fetchValorantItems(filters: LZTValorantFilters = {}): Promise<LZTItemListResponse> {
    return fetchMarketplaceItems(filters, 'valorant');
}

/**
 * Fetch Fortnite items - wrapper using main function
 */
export async function fetchFortniteItems(filters: LZTBaseFilters = {}): Promise<LZTItemListResponse> {
    return fetchMarketplaceItems(filters, 'fortnite');
}

/**
 * Fetch items by category slug - wrapper using main function
 */
export async function fetchItemsByCategory(
    category: keyof typeof LZT_CATEGORIES | string,
    filters: LZTBaseFilters = {}
): Promise<LZTItemListResponse> {
    return fetchMarketplaceItems(filters, category.toLowerCase());
}

/**
 * Fetch single item details
 * GET /{itemId}
 */
export async function fetchItemDetails(itemId: number): Promise<LZTItem> {
    try {
        console.log('🔍 Fetching item details:', itemId);

        const response = await fetchWithRetry(`/${itemId}?i18n=en`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Item not found or already sold');
            }
            throw new Error(`LZT API Error: ${response.status}`);
        }

        const data = await response.json();
        const item = data.item || data;

        return applyPricing(item);
    } catch (error) {
        console.error(`❌ Error fetching item ${itemId}:`, error);
        throw error;
    }
}

/**
 * Check if item is still available
 * GET /{itemId}/check
 */
export async function checkItemAvailability(itemId: number): Promise<{
    available: boolean;
    price?: number;
    display_price?: number;
}> {
    try {
        const item = await fetchItemDetails(itemId);
        return {
            available: true,
            price: item.price,
            display_price: item.display_price,
        };
    } catch (error: any) {
        if (error.message?.includes('not found') || error.message?.includes('sold')) {
            return { available: false };
        }
        throw error;
    }
}

/**
 * Purchase item via fast-buy (Proxy Purchase)
 * CRITICAL: Must send original LZT price for anti-sniping validation
 * 
 * @param itemId - LZT item ID
 * @param originalPrice - The ORIGINAL LZT price (not marked up)
 */
export async function purchaseItem(itemId: number, originalPrice: number): Promise<{
    success: boolean;
    loginData?: {
        login: string;
        password: string;
        raw: string;
        encodedPassword?: string;
        adviceToChangePassword?: boolean;
    };
    error?: string;
}> {
    try {
        console.log('💰 Attempting purchase:', { itemId, originalPrice });

        const response = await fetchWithRetry(`/${itemId}/fast-buy`, {
            method: 'POST',
            body: JSON.stringify({
                price: originalPrice // CRITICAL: Send original price for validation
            })
        });

        const data = await response.json();

        if (!response.ok || data.errors) {
            console.error('❌ Purchase failed:', data.errors);
            return {
                success: false,
                error: data.errors?.join(', ') || 'Purchase failed'
            };
        }

        if (data.status === 'ok' && data.item?.loginData) {
            console.log('✅ Purchase successful! Item ID:', itemId);
            return {
                success: true,
                loginData: data.item.loginData
            };
        }

        return {
            success: false,
            error: 'Invalid response from LZT API'
        };
    } catch (error: any) {
        console.error('❌ Purchase error:', error);
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}

/**
 * Check LZT Master Balance
 * Used for monitoring and alerts
 */
export async function checkMasterBalance(): Promise<{
    market_balance: number;
    hold_balance: number;
    total: number;
}> {
    try {
        const response = await fetchWithRetry('/payments/balance/list');

        if (!response.ok) {
            throw new Error(`Failed to check balance: ${response.status}`);
        }

        const data = await response.json();

        return {
            market_balance: data.market_balance || 0,
            hold_balance: data.hold_balance || 0,
            total: (data.market_balance || 0) + (data.hold_balance || 0)
        };
    } catch (error) {
        console.error('❌ Error checking balance:', error);
        throw error;
    }
}

/**
 * Search marketplace by title
 */
export async function searchMarketplace(searchQuery: string, filters: LZTBaseFilters = {}): Promise<LZTItemListResponse> {
    return fetchMarketplaceItems({
        ...filters,
        title: searchQuery,
    });
}

/**
 * Fetch items by category ID (legacy support)
 */
export async function fetchByCategory(categoryId: number, page: number = 1): Promise<LZTItemListResponse> {
    const categorySlugMap: Record<number, string> = {
        1: 'steam',
        4: 'warface',
        9: 'fortnite',
        11: 'battlenet',
        12: 'epic-games',
        13: 'valorant',
        15: 'clash-of-clans',
        28: 'minecraft',
    };
    
    const slug = categorySlugMap[categoryId];
    if (slug) {
        return fetchItemsByCategory(slug, { page });
    }
    
    return fetchMarketplaceItems({ page });
}

/**
 * Get seller profile
 * GET /user/{userId}/items
 */
export async function getSellerItems(userId: number, page: number = 1): Promise<LZTItemListResponse> {
    try {
        const response = await fetchWithRetry(`/user/${userId}/items?i18n=en&page=${page}`);

        if (!response.ok) {
            throw new Error(`LZT API Error: ${response.status}`);
        }

        const data = await response.json();
        return {
            items: applyPricingToItems(data.items || []),
            totalItems: data.totalItems || 0,
            page,
        };
    } catch (error) {
        console.error(`❌ Error fetching seller ${userId} items:`, error);
        throw error;
    }
}

/**
 * Reserve item (sticky buy)
 * POST /{itemId}/reserve
 */
export async function reserveItem(itemId: number, price: number): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetchWithRetry(`/${itemId}/reserve`, {
            method: 'POST',
            body: JSON.stringify({ price })
        });

        const data = await response.json();
        
        if (!response.ok || data.errors) {
            return {
                success: false,
                error: data.errors?.join(', ') || 'Failed to reserve item'
            };
        }

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}

/**
 * Cancel reservation
 * DELETE /{itemId}/reserve
 */
export async function cancelReservation(itemId: number): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetchWithRetry(`/${itemId}/reserve`, {
            method: 'DELETE'
        });

        const data = await response.json();
        
        if (!response.ok || data.errors) {
            return {
                success: false,
                error: data.errors?.join(', ') || 'Failed to cancel reservation'
            };
        }

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}
