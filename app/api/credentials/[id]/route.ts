import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

/**
 * GET /api/credentials/[id]
 * Fetch purchased item credentials
 * Requires authentication
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.split('Bearer ')[1];
        let userId;
        try {
            const decodedToken = await adminAuth.verifyIdToken(token);
            userId = decodedToken.uid;
        } catch (error) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Fetch credentials
        const credDoc = await adminDb.collection('purchased_items').doc(id).get();

        if (!credDoc.exists) {
            return NextResponse.json(
                { success: false, error: 'Credentials not found' },
                { status: 404 }
            );
        }

        const credData = credDoc.data();

        // Verify ownership
        if (credData?.user_id !== userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            credentials: credData
        });
    } catch (error: any) {
        console.error('Error fetching credentials:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
