import { NextRequest, NextResponse } from 'next/server';
import { purchaseItem } from '@/services/lzt-api';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from '@google-cloud/firestore';

/**
 * POST /api/purchase
 * Proxy Purchase Flow:
 * 1. Verify user authentication
 * 2. Check user balance
 * 3. Deduct display price from user
 * 4. Purchase from LZT using original price
 * 5. Save credentials or refund on failure
 * 
 * Body: {
 *   itemId: number,
 *   originalPrice: number,  // LZT price
 *   displayPrice: number,   // Our marked-up price
 *   itemTitle: string
 * }
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Verify Authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await adminAuth.verifyIdToken(token);
        } catch (error) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        const userId = decodedToken.uid;

        // 2. Parse request body
        const body = await request.json();
        const { itemId, originalPrice, displayPrice, itemTitle } = body;

        if (!itemId || !originalPrice || !displayPrice) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        console.log('🛒 Purchase request:', { userId, itemId, displayPrice, originalPrice });

        // 3. Check user balance
        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        const userData = userDoc.data();
        const userBalance = userData?.balance || 0;

        if (userBalance < displayPrice) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Insufficient balance',
                    required: displayPrice,
                    current: userBalance
                },
                { status: 400 }
            );
        }

        // 4. Create pending transaction
        const txRef = adminDb.collection('balance_transactions').doc();
        await txRef.set({
            user_id: userId,
            type: 'purchase',
            amount: -displayPrice, // Negative for deduction
            currency: 'USD',
            status: 'pending',
            lzt_item_id: itemId,
            lzt_price: originalPrice,
            display_price: displayPrice,
            item_title: itemTitle || `Item #${itemId}`,
            created_at: FieldValue.serverTimestamp(),
            description: `Purchase: ${itemTitle || `Item #${itemId}`}`
        });

        // 5. Deduct funds immediately (lock them)
        await userRef.update({
            balance: FieldValue.increment(-displayPrice)
        });

        console.log(`💰 Deducted $${displayPrice} from user ${userId}`);

        // 6. Attempt LZT purchase using ORIGINAL price
        const purchaseResult = await purchaseItem(itemId, originalPrice);

        if (purchaseResult.success && purchaseResult.loginData) {
            // SUCCESS: Save credentials
            const credentialsRef = adminDb.collection('purchased_items').doc();
            await credentialsRef.set({
                id: credentialsRef.id,
                user_id: userId,
                transaction_id: txRef.id,
                lzt_item_id: itemId,
                login: purchaseResult.loginData.login,
                password: purchaseResult.loginData.password,
                raw_data: purchaseResult.loginData.raw,
                encoded_password: purchaseResult.loginData.encodedPassword,
                advice_to_change_password: purchaseResult.loginData.adviceToChangePassword,
                created_at: FieldValue.serverTimestamp(),
                item_title: itemTitle || `Item #${itemId}`
            });

            // Update transaction to completed
            await txRef.update({
                status: 'completed',
                completed_at: FieldValue.serverTimestamp(),
                credentials_id: credentialsRef.id
            });

            console.log(`✅ Purchase successful! Credentials saved: ${credentialsRef.id}`);

            return NextResponse.json({
                success: true,
                transactionId: txRef.id,
                credentialsId: credentialsRef.id,
                message: 'Purchase successful! View your credentials in the success page.'
            });
        } else {
            // FAILURE: Refund user
            await userRef.update({
                balance: FieldValue.increment(displayPrice) // Add back
            });

            await txRef.update({
                status: 'failed',
                completed_at: FieldValue.serverTimestamp(),
                error_message: purchaseResult.error || 'Unknown error'
            });

            console.log(`❌ Purchase failed, refunded $${displayPrice} to user ${userId}`);

            return NextResponse.json(
                {
                    success: false,
                    error: purchaseResult.error || 'Purchase failed',
                    refunded: true
                },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error('❌ Purchase error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Internal server error'
            },
            { status: 500 }
        );
    }
}
