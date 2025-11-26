"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { useUser } from '@/contexts/UserContext';
import { QRCodeSVG } from 'qrcode.react';

const CRYPTO_OPTIONS = [
    { value: 'btc', label: 'Bitcoin (BTC)' },
    { value: 'eth', label: 'Ethereum (ETH)' },
    { value: 'usdttrc20', label: 'Tether (USDT - TRC20)' },
    { value: 'ltc', label: 'Litecoin (LTC)' },
];

export default function CryptoPayment() {
    const user = useUser();
    const [amount, setAmount] = useState<string>("50");
    const [currency, setCurrency] = useState<string>("btc");
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreatePayment = async () => {
        if (!user.isAuthenticated) return;

        setLoading(true);
        setError(null);
        setPaymentData(null);

        try {
            const response = await fetch('/api/payments/crypto/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency,
                    userId: user.username || 'guest'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create payment');
            }

            setPaymentData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const numAmount = parseFloat(amount) || 0;
    const fee = numAmount * 0.04; // 4% fee
    const netAmount = numAmount - fee;

    return (
        <div className="flex flex-col gap-6 items-center w-full max-w-md mx-auto">
            <Card className="w-full glass-panel border-0">
                <CardBody className="gap-4 p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Crypto Deposit</h2>
                        <span className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-1 rounded border border-brand-primary/50">
                            PREFERRED (4% Fee)
                        </span>
                    </div>

                    {!paymentData ? (
                        <>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400">Amount (USD)</label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    startContent={<span className="text-default-400">$</span>}
                                    className="w-full"
                                    size="lg"
                                    classNames={{
                                        input: "text-white",
                                        inputWrapper: "bg-white/5 border border-white/10 hover:border-white/20"
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400">Select Cryptocurrency</label>
                                <Select
                                    selectedKeys={[currency]}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full"
                                    aria-label="Select Cryptocurrency"
                                >
                                    {CRYPTO_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} textValue={opt.label}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="flex flex-col gap-1 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Processing Fee (4%)</span>
                                    <span>-${fee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-green-400 text-lg">
                                    <span>You Receive</span>
                                    <span>${netAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                color="primary"
                                size="lg"
                                className="w-full font-bold mt-2 btn-squircle shadow-lg shadow-brand-primary/20"
                                onClick={handleCreatePayment}
                                isLoading={loading}
                            >
                                Pay with Crypto
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center space-y-1">
                                <p className="text-gray-400 text-sm">Send exact amount to:</p>
                                <div className="bg-white/5 p-3 rounded border border-white/10 break-all font-mono text-sm select-all cursor-pointer hover:bg-white/10 transition-colors"
                                    onClick={() => navigator.clipboard.writeText(paymentData.pay_address)}>
                                    {paymentData.pay_address}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2 bg-white p-4 shape-squircle mx-auto shadow-xl">
                                <QRCodeSVG value={paymentData.pay_address} size={180} />
                            </div>

                            <div className="text-center space-y-1">
                                <p className="text-gray-400 text-sm">Amount:</p>
                                <p className="text-2xl font-bold text-brand-primary">
                                    {paymentData.pay_amount} {paymentData.pay_currency.toUpperCase()}
                                </p>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded text-xs text-yellow-500 text-center">
                                Payment detected automatically. Please wait for network confirmation.
                            </div>

                            <Button
                                variant="bordered"
                                className="w-full"
                                onClick={() => setPaymentData(null)}
                            >
                                Create New Payment
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
