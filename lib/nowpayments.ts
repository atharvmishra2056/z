const NOWPAYMENTS_API_BASE = "https://api.nowpayments.io/v1";
const API_KEY = process.env.NOWPAYMENTS_API_KEY;

export async function createPayment(amount: number, currency: string, orderId: string, callbackUrl: string) {
    if (!API_KEY) throw new Error("NOWPayments API Key missing");

    const response = await fetch(`${NOWPAYMENTS_API_BASE}/payment`, {
        method: "POST",
        headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            price_amount: amount,
            price_currency: "usd", // Base currency is USD
            pay_currency: currency,
            ipn_callback_url: callbackUrl,
            order_id: orderId,
            order_description: "Wallet Topup",
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create payment");
    }

    return response.json();
}

export async function getAvailableCurrencies() {
    if (!API_KEY) return []; // Return empty if no key yet

    try {
        const response = await fetch(`${NOWPAYMENTS_API_BASE}/currencies?active=true`, {
            headers: { "x-api-key": API_KEY }
        });
        if (!response.ok) return ["btc", "eth", "usdttrc20", "ltc"]; // Fallback
        const data = await response.json();
        return data.currencies;
    } catch (e) {
        return ["btc", "eth", "usdttrc20", "ltc"]; // Fallback
    }
}

export async function getMinimumAmount(currency: string) {
    if (!API_KEY) return 10; // Fallback

    try {
        const response = await fetch(`${NOWPAYMENTS_API_BASE}/min-amount?currency_from=usd&currency_to=${currency}`, {
            headers: { "x-api-key": API_KEY }
        });
        const data = await response.json();
        return data.min_amount;
    } catch (e) {
        return 0;
    }
}
