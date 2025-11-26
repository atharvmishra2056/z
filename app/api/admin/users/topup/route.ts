import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
    try {
        const { userId, amount, adminId, reason } = await req.json();

        if (!userId || !amount || !adminId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const userRef = adminDb.collection('users').doc(userId);

        await adminDb.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists) {
                throw new Error('User not found');
            }

            const currentBalance = userDoc.data()?.balance || 0;
            const newBalance = currentBalance + parseFloat(amount);

            // 1. Update user balance
            transaction.update(userRef, {
                balance: newBalance
            });

            // 2. Log transaction
            const txRef = adminDb.collection('balance_transactions').doc();
            transaction.set(txRef, {
                user_id: userId,
                type: 'deposit', // or 'manual_adjustment'
                amount: parseFloat(amount),
                currency: 'USD',
                created_at: FieldValue.serverTimestamp(),
                description: `Manual Top-up by Admin (${reason || 'No reason provided'})`,
                verified_by: adminId
            });

            // 3. Log admin activity
            const logRef = adminDb.collection('admin_activity_log').doc();
            transaction.set(logRef, {
                admin_uid: adminId,
                action: 'manual_balance_add',
                target_user_id: userId,
                details: { amount, reason },
                timestamp: FieldValue.serverTimestamp()
            });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Manual Top-up Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
