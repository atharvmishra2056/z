import { NextRequest, NextResponse } from 'next/server';
import { fetchItemDetails } from '@/services/lzt-api';

/**
 * GET /api/marketplace/[itemId]
 * Fetch single item details with pricing
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId: itemIdStr } = await params;
        const itemId = parseInt(itemIdStr);

        if (isNaN(itemId)) {
            return NextResponse.json(
                { success: false, error: 'Invalid item ID' },
                { status: 400 }
            );
        }

        const item = await fetchItemDetails(itemId);

        return NextResponse.json({
            success: true,
            item
        });
    } catch (error: any) {
        console.error(`Error fetching item:`, error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch item details'
            },
            { status: 500 }
        );
    }
}
