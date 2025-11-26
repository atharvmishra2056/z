import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { calculateUPIFee, calculateUPINetAmount } from '@/lib/payment-utils';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Received Webhook Payload:', body);

        let amountNum = 0;
        let userId = 'unknown'; // We might not get user ID from email body easily unless it's in the note
        let transactionNote = '';
        let senderVpa = '';
        let upiRef = '';

        // Handle Email-to-Webhook payload (Simplified)
        // User requested to stop parsing JSON for now, so we'll just try to get basic fields
        // and save the whole body for manual review.

        if (body.message) {
            // Email payload - extract amount from message
            const amountMatch = body.message.match(/₹\s*([\d.]+)/);
            if (amountMatch) {
                amountNum = parseFloat(amountMatch[1]);
            }
            transactionNote = body.message;
            upiRef = `EMAIL_${body.timestamp || Date.now()}`;

            // Try to extract user ID from the full email body if available
            // Pattern: Deposit_{userId}_{timestamp}
            const userIdMatch = body.message.match(/Deposit_([^_]+)_/);
            if (userIdMatch) {
                userId = userIdMatch[1];
            }
        } else {
            // Standard payload - extract from fields
            if (body.amount) amountNum = parseFloat(body.amount);
            if (body.upi_ref) upiRef = body.upi_ref;
            if (body.sender_vpa) senderVpa = body.sender_vpa;
            if (body.transaction_note) {
                transactionNote = body.transaction_note;

                // Extract user ID from transaction note
                // Pattern: Deposit_{userId}_{timestamp}
                const userIdMatch = transactionNote.match(/Deposit_([^_]+)_/);
                if (userIdMatch) {
                    userId = userIdMatch[1];
                }
            }
        }

        // Default to 'unknown' user if not found
        // We won't fail on invalid amount, just log it
        if (isNaN(amountNum)) amountNum = 0;

        const fee = calculateUPIFee(amountNum);
        const netAmount = calculateUPINetAmount(amountNum);
        const netAmountUSD = netAmount / 83;

        console.log('💾 Looking for matching payment request...');

        // Find existing payment request that matches this amount
        // Look for requests with status 'awaiting_payment' created in the last 15 minutes
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const snapshot = await adminDb.collection('payment_requests')
            .where('status', '==', 'awaiting_payment')
            .where('amount', '==', amountNum)
            .where('created_at', '>=', fifteenMinutesAgo)
            .orderBy('created_at', 'desc')
            .limit(1)
            .get();

        let docRef;
        let matched = false;

        if (!snapshot.empty) {
            // Found a matching pre-created request - update it!
            const doc = snapshot.docs[0];
            docRef = doc.ref;
            matched = true;
            userId = doc.data().user_id; // Get the real user ID!

            await docRef.update({
                status: 'pending',
                upi_ref_number: upiRef,
                sender_vpa: senderVpa,
                webhook_received_at: new Date(),
                transaction_note: transactionNote,
                source: 'webhook_matched',
                raw_payload: body
            });

            console.log(`✅ MATCHED existing request! DocID: ${docRef.id}`);
            console.log(`   Amount: ₹${amountNum} | User: ${userId} | Ref: ${upiRef}`);
        } else {
            // No match found - create new request as 'unknown' (probably old email or test)
            docRef = await adminDb.collection('payment_requests').add({
                user_id: 'unknown',
                amount: amountNum,
                currency: 'INR',
                method: 'upi',
                status: 'pending',
                upi_ref_number: upiRef,
                sender_vpa: senderVpa,
                created_at: new Date(),
                fee,
                net_amount_inr: netAmount,
                net_amount_usd: netAmountUSD,
                transaction_note: transactionNote,
                source: 'webhook_unmatched',
                raw_payload: body
            });

            console.log(`⚠️ NO MATCH - Created new request: DocID: ${docRef.id}`);
            console.log(`   Amount: ₹${amountNum} | User: unknown | Ref: ${upiRef}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Payment request received',
            docId: typeof docRef === 'string' ? docRef : docRef.id,
            matched
        });
    } catch (error: any) {
        console.error('❌ Webhook Error:', error);
        console.error('   Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message
        }, { status: 500 });
    }
}
