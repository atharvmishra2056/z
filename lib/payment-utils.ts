export const FAMPAY_UPI_ID = "7389556886@fam";
export const UPI_FEE_PERCENTAGE = 0.10; // 10%

export function calculateUPIFee(amount: number): number {
    return amount * UPI_FEE_PERCENTAGE;
}

export function calculateUPINetAmount(amount: number): number {
    return amount - calculateUPIFee(amount);
}

export function generateUPILink(amount: number, userId: string): string {
    // Transaction Note format: Deposit_{userId}_{timestamp}
    // This is crucial for the webhook to identify the user
    const transactionNote = `Deposit_${userId}_${Date.now()}`;
    const payeeName = "KXW Marketplace";

    // UPI URL format
    // pa: Payee Address (VPA)
    // pn: Payee Name
    // am: Amount
    // tn: Transaction Note
    // cu: Currency (INR)

    const params = new URLSearchParams({
        pa: FAMPAY_UPI_ID,
        pn: payeeName,
        am: amount.toFixed(2),
        tn: transactionNote,
        cu: "INR"
    });

    return `upi://pay?${params.toString()}`;
}
