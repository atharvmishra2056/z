// app/api/item/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getMockItem } from '@/lib/mock-data';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
        return NextResponse.json({ error: 'Invalid id format' }, { status: 400 });
    }

    // Get mock item
    const item = getMockItem(itemId);

    if (!item) {
        return NextResponse.json(
            { error: 'Item not found' },
            { status: 404 }
        );
    }

    console.log(`✅ Returning dummy item ${itemId}:`, item.title);
    return NextResponse.json(item);
}