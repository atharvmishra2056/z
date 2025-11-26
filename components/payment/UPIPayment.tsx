"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateUPILink, calculateUPIFee, calculateUPINetAmount } from '@/lib/payment-utils';
import { Card, CardBody, Button, Input } from "@heroui/react";
import { useUser } from '@/contexts/UserContext';

export default function UPIPayment() {
    const user = useUser();
    const [amount, setAmount] = useState<string>("100");
    const [upiLink, setUpiLink] = useState<string>("");

    useEffect(() => {
        if (user.isAuthenticated && amount) {
            const numAmount = parseFloat(amount);
            if (!isNaN(numAmount) && numAmount > 0) {
                // Use a dummy ID if user ID is not available yet (though it should be)
                const userId = user.username || "guest";
                setUpiLink(generateUPILink(numAmount, userId));
            }
        }
    }, [amount, user.isAuthenticated, user.username]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const numAmount = parseFloat(amount) || 0;
    const fee = calculateUPIFee(numAmount);
    const netAmount = calculateUPINetAmount(numAmount);

    return (
        <div className="flex flex-col gap-6 items-center w-full max-w-md mx-auto">
            <Card className="w-full bg-black/40 backdrop-blur-xl border border-white/10">
                <CardBody className="gap-4 p-6">
                    <h2 className="text-xl font-bold text-center text-white">Add Funds via UPI</h2>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Amount (INR)</label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            startContent={<span className="text-default-400">₹</span>}
                            className="w-full"
                            size="lg"
                        />
                    </div>

                    <div className="flex flex-col gap-1 text-sm">
                        <div className="flex justify-between text-gray-400">
                            <span>Processing Fee (10%)</span>
                            <span>-₹{fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-green-400 text-lg">
                            <span>You Receive</span>
                            <span>₹{netAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {numAmount > 0 && (
                        <div className="flex flex-col items-center gap-4 mt-4 bg-white/5 p-4 rounded-xl">
                            <div className="bg-white p-2 rounded-lg">
                                <QRCodeSVG value={upiLink} size={200} />
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                Scan with any UPI App<br />(GPay, PhonePe, Paytm, FamPay)
                            </p>
                        </div>
                    )}

                    <Button
                        as="a"
                        href={upiLink}
                        color="primary"
                        size="lg"
                        className="w-full font-bold mt-2"
                    >
                        Pay ₹{numAmount}
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-2">
                        Funds will be added automatically within 5-10 minutes after payment.
                    </p>
                </CardBody>
            </Card>
        </div>
    );
}
