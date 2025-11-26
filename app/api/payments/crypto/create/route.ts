import { NextRequest, NextResponse } from 'next/server';
import { createPayment, getMinimumAmount } from '@/lib/nowpayments';

export async function POST(req: NextRequest) {
    try {
        const { amount, currency, userId } = await req.json();

        if (!amount || !currency || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const orderId = `Topup_${userId}_${Date.now()}`;

        // Get the origin from the request
        const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'http://localhost:3000';
        const callbackUrl = `${origin}/api/webhooks/nowpayments`;

        const payment = await createPayment(amount, currency, orderId, callbackUrl);

        return NextResponse.json(payment);
    } catch (error: any) {
        console.error('Create Payment Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create payment' }, { status: 500 });
    }
}
