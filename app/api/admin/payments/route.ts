import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

/**
 * GET /api/admin/payments
 * Fetch all payment requests for admin dashboard
 * 
 * Query params:
 * - status: Filter by status (pending, completed, rejected, all)
 * - limit: Number of results (default 50)
 * - method: Filter by payment method (upi, crypto)
 */
export async function GET(request: NextRequest) {
    try {
        // Verify admin auth
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await adminAuth.verifyIdToken(token);
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Check if user is admin (by email or role)
        const adminEmails = ['atharv.kuzzboost@gmail.com']; // Add more as needed
        const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
        const isAdmin = adminEmails.includes(decodedToken.email || '') || 
                       userDoc.data()?.role === 'admin';

        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Parse query params
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status') || 'all';
        const limit = parseInt(searchParams.get('limit') || '50');
        const method = searchParams.get('method');

        // Build query
        let query = adminDb.collection('payment_requests')
            .orderBy('created_at', 'desc')
            .limit(limit);

        if (status !== 'all') {
            query = query.where('status', '==', status);
        }

        if (method) {
            query = query.where('method', '==', method);
        }

        const snapshot = await query.get();
        
        const payments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate?.()?.toISOString() || null,
            completed_at: doc.data().completed_at?.toDate?.()?.toISOString() || null,
        }));

        // Get counts for dashboard
        const pendingCount = await adminDb.collection('payment_requests')
            .where('status', '==', 'pending')
            .count()
            .get();

        return NextResponse.json({
            success: true,
            payments,
            counts: {
                pending: pendingCount.data().count,
                total: payments.length,
            }
        });
    } catch (error: any) {
        console.error('Admin payments API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
