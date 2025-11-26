import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
    try {
        const { requestId, action, adminId } = await req.json();

        if (!requestId || !action || !adminId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // TODO: Verify adminId has admin role (middleware or db check)

        const requestRef = adminDb.collection('payment_requests').doc(requestId);

        await adminDb.runTransaction(async (transaction) => {
            const requestDoc = await transaction.get(requestRef);

            if (!requestDoc.exists) {
                throw new Error('Payment request not found');
            }

            const requestData = requestDoc.data();

            if (requestData?.status !== 'pending') {
                throw new Error('Request is not pending');
            }

            // PRE-FETCH User Doc (Read before Write)
            const userRef = adminDb.collection('users').doc(requestData.user_id);
            const userDoc = await transaction.get(userRef);

            if (action === 'approve') {
                // 1. Update request status (Write 1)
                transaction.update(requestRef, {
                    status: 'completed',
                    completed_at: FieldValue.serverTimestamp(),
                    verified_by: adminId
                });

                // 2. Add funds to user (Write 2)
                // Handle case where user doc might not exist yet (though it should)
                const currentBalance = userDoc.exists ? (userDoc.data()?.balance || 0) : 0;

                const amountToAdd = requestData.net_amount_usd || requestData.amount; // Fallback

                console.log(`Adding ${amountToAdd} to user ${requestData.user_id} (Current: ${currentBalance})`);

                transaction.set(userRef, {
                    balance: currentBalance + amountToAdd
                }, { merge: true });

                // 3. Log transaction (Write 3)
                const txRef = adminDb.collection('balance_transactions').doc();
                transaction.set(txRef, {
                    user_id: requestData.user_id,
                    type: 'deposit',
                    amount: amountToAdd,
                    currency: 'USD',
                    payment_request_id: requestId,
                    created_at: FieldValue.serverTimestamp(),
                    description: `Deposit via ${requestData.method}`
                });

            } else if (action === 'reject') {
                transaction.update(requestRef, {
                    status: 'rejected',
                    completed_at: FieldValue.serverTimestamp(),
                    verified_by: adminId
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Approval Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error', details: error.toString() }, { status: 500 });
    }
}
