import { NextRequest, NextResponse } from 'next/server';
import { checkMasterBalance } from '@/services/lzt-api';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from '@google-cloud/firestore';

/**
 * GET /api/cron/check-lzt-balance
 * 
 * Cron job to monitor LZT master balance
 * Schedule: Every hour
 * 
 * Alerts if balance < $50
 * Logs balance to Firestore for tracking
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (optional security)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('🔍 Checking LZT master balance...');

        // Fetch balance from LZT API
        const balance = await checkMasterBalance();

        console.log(`💰 LZT Balance: $${balance.market_balance} (Hold: $${balance.hold_balance})`);

        // Log to Firestore
        await adminDb.collection('lzt_balance_logs').add({
            market_balance: balance.market_balance,
            hold_balance: balance.hold_balance,
            total_balance: balance.total,
            checked_at: FieldValue.serverTimestamp(),
            status: balance.market_balance < 50 ? 'low' : 'normal'
        });

        // Check threshold and alert if needed
        const LOW_BALANCE_THRESHOLD = 50;

        if (balance.market_balance < LOW_BALANCE_THRESHOLD) {
            console.warn(`⚠️ LOW BALANCE ALERT: LZT balance is $${balance.market_balance}`);

            // Log alert to Firestore
            await adminDb.collection('admin_alerts').add({
                type: 'low_lzt_balance',
                severity: 'high',
                message: `LZT master balance is low: $${balance.market_balance}. Please top up immediately.`,
                balance: balance.market_balance,
                threshold: LOW_BALANCE_THRESHOLD,
                created_at: FieldValue.serverTimestamp(),
                resolved: false
            });

            // TODO: Send email/Discord notification
            // await sendDiscordAlert(`🚨 LOW BALANCE: $${ balance.market_balance }`);

            return NextResponse.json({
                success: true,
                alert: true,
                message: 'Low balance detected',
                balance
            });
        }

        return NextResponse.json({
            success: true,
            alert: false,
            message: 'Balance OK',
            balance
        });
    } catch (error: any) {
        console.error('❌ Error checking LZT balance:', error);

        // Log error to Firestore
        await adminDb.collection('admin_alerts').add({
            type: 'lzt_balance_check_failed',
            severity: 'medium',
            message: `Failed to check LZT balance: ${error.message}`,
            error: error.message,
            created_at: FieldValue.serverTimestamp(),
            resolved: false
        });

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to check balance'
            },
            { status: 500 }
        );
    }
}
