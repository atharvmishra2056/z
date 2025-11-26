import { NextRequest, NextResponse } from 'next/server';
import { 
    fetchMarketplaceItems, 
    searchMarketplace, 
    fetchByCategory,
    fetchItemsByCategory 
} from '@/services/lzt-api';
import { LZTBaseFilters } from '@/types/lzt-types';

/**
 * GET /api/marketplace/items
 * Fetch marketplace items with English translation and dynamic pricing
 * 
 * Query params:
 * - category: Category slug (valorant, steam, etc.) or ID
 * - search: Search term
 * - page: Page number
 * - pmin: Minimum price (LZT price, will be converted)
 * - pmax: Maximum price (LZT price, will be converted)
 * - order_by: Sort order
 * - Additional game-specific filters
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const pmin = searchParams.get('pmin');
        const pmax = searchParams.get('pmax');
        const orderBy = searchParams.get('order_by');

        // Build filters object
        const filters: LZTBaseFilters = { page };
        if (pmin) filters.pmin = parseFloat(pmin);
        if (pmax) filters.pmax = parseFloat(pmax);
        if (orderBy) filters.order_by = orderBy as any;

        let result;

        if (search) {
            // Search mode
            result = await searchMarketplace(search, filters);
        } else if (category) {
            // Check if category is a number (ID) or string (slug)
            const categoryNum = parseInt(category);
            if (!isNaN(categoryNum)) {
                result = await fetchByCategory(categoryNum, page);
            } else {
                result = await fetchItemsByCategory(category, filters);
            }
        } else {
            // Default: fetch all latest items
            result = await fetchMarketplaceItems(filters);
        }

        return NextResponse.json({
            success: true,
            ...result
        });
    } catch (error: any) {
        console.error('Error in marketplace API:', error);
        
        // Return empty result instead of error for better UX
        return NextResponse.json({
            success: false,
            items: [],
            totalItems: 0,
            page: 1,
            error: error.message || 'Failed to fetch marketplace items'
        });
    }
}
