import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-nowpayments-sig');

        // Verify signature if secret is set
        if (process.env.NOWPAYMENTS_IPN_SECRET && signature) {
            const hmac = crypto.createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET);
            hmac.update(bodyText);
            const expectedSignature = hmac.digest('hex');

            if (signature !== expectedSignature) {
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        }

        const body = JSON.parse(bodyText);
        const { payment_id, payment_status, pay_amount, pay_currency, order_id, actually_paid } = body;

        console.log('Received NOWPayments Webhook:', body);

        if (payment_status === 'finished' || payment_status === 'confirmed') {
            // order_id format: Topup_{userId}_{timestamp}
            const parts = order_id?.split('_');
            if (!parts || parts.length < 3) {
                console.error('Invalid order_id format:', order_id);
                return NextResponse.json({ success: true }); // Acknowledge anyway
            }

            const userId = parts[1];
            const amountCrypto = parseFloat(actually_paid);

            // Calculate 4% fee
            const fee = amountCrypto * 0.04;

            // We need to store this for admin approval
            // Using adminDb from firebase-admin
            await adminDb.collection('payment_requests').add({
                user_id: userId,
                amount: amountCrypto,
                currency: pay_currency.toUpperCase(),
                method: 'crypto',
                status: 'pending', // Admin must approve
                nowpayments_payment_id: payment_id,
                crypto_amount: amountCrypto,
                fee: fee,
                created_at: new Date(),
                provider: 'nowpayments',
                raw_data: body
            });

            console.log(`Crypto payment recorded for user ${userId}: ${amountCrypto} ${pay_currency}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('NOWPayments Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
