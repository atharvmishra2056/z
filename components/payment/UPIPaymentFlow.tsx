"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateUPILink, calculateUPIFee, calculateUPINetAmount } from '@/lib/payment-utils';
import { Card, CardBody, Button, Input, CircularProgress } from "@heroui/react";
import { useUser } from '@/contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wallet, CheckCircle, Clock, QrCode, AlertCircle } from 'lucide-react';
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";

type PaymentStep = 'amount' | 'confirm' | 'payment' | 'status';

export default function UPIPaymentFlow() {
    const user = useUser();
    const [step, setStep] = useState<PaymentStep>('amount');
    const [amount, setAmount] = useState<string>("");
    const [upiLink, setUpiLink] = useState<string>("");
    const [paymentId, setPaymentId] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualUtr, setManualUtr] = useState("");
    const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);

    const presetAmounts = [100, 500, 1000, 2000, 5000];

    useEffect(() => {
        if (user.isAuthenticated && amount && parseFloat(amount) > 0) {
            const userId = user.uid || user.username || "guest";
            const numAmount = parseFloat(amount);
            setUpiLink(generateUPILink(numAmount, userId));
            setPaymentId(`UPI_${userId}_${Date.now()} `);
        }
    }, [amount, user.isAuthenticated, user.username, user.uid]);

    // Timer Logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'payment' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setShowManualEntry(true);
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    // Auto-confirm polling (Listen for payment request status update)
    useEffect(() => {
        if (step !== 'payment' || !paymentId) return;

        // Listen to the specific payment request document we created
        const docRef = collection(db, "payment_requests");
        const q = query(docRef, where("__name__", "==", paymentId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.forEach((doc) => {
                const data = doc.data();
                // If status changed from 'awaiting_payment' to 'pending' or 'completed', webhook received it!
                if (data.status === 'pending' || data.status === 'completed') {
                    setStep('status');
                }
            });
        });

        return () => unsubscribe();
    }, [step, paymentId]);


    const numAmount = parseFloat(amount) || 0;
    const fee = calculateUPIFee(numAmount);
    const netAmount = calculateUPINetAmount(numAmount);

    const handlePresetAmount = (value: number) => {
        setAmount(value.toString());
    };

    const handleProceedToConfirm = () => {
        if (numAmount > 0) {
            setStep('confirm');
        }
    };

    const handleProceedToPayment = async () => {
        try {
            // Pre-create payment request in Firestore
            const docRef = await addDoc(collection(db, "payment_requests"), {
                user_id: user.uid,
                amount: numAmount,
                currency: 'INR',
                method: 'upi',
                status: 'awaiting_payment', // Will be updated to 'pending' when webhook arrives
                created_at: new Date(),
                fee,
                net_amount_inr: netAmount,
                net_amount_usd: netAmount / 83,
                transaction_note: `QR Payment - ${user.username}`,
                source: 'qr_code',
                expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            });

            setPaymentId(docRef.id); // Use the Firestore doc ID as payment ID
            setStep('payment');
            setTimeLeft(300); // Reset timer
            setShowManualEntry(false);
        } catch (error) {
            console.error("Error creating payment request:", error);
            alert("Failed to generate QR code. Please try again.");
        }
    };

    const handlePaymentComplete = () => {
        setStep('status');
    };

    const handleManualSubmit = async () => {
        if (!manualUtr.trim()) return;
        setIsSubmittingUtr(true);
        try {
            // Create a manual payment request
            await addDoc(collection(db, "payment_requests"), {
                user_id: user.uid,
                amount: numAmount,
                currency: 'INR',
                method: 'upi',
                status: 'pending',
                upi_ref_number: manualUtr,
                created_at: new Date(),
                fee,
                net_amount_inr: netAmount,
                net_amount_usd: netAmount / 83,
                transaction_note: `Manual Entry: ${manualUtr} `,
                source: 'manual'
            });
            setStep('status');
        } catch (error) {
            console.error("Error submitting UTR:", error);
        } finally {
            setIsSubmittingUtr(false);
        }
    };

    const handleReset = () => {
        setStep('amount');
        setAmount("");
        setManualUtr("");
        setShowManualEntry(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')} `;
    };

    return (
        <div className="flex flex-col gap-6 items-center w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {/* Step 1: Amount Selection */}
                {step === 'amount' && (
                    <motion.div
                        key="amount"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full"
                    >
                        <div className="relative">
                            {/* Ambient Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-[40px] blur-xl opacity-50" />

                            <Card className="w-full glass-tahoe border-0 shape-squircle relative">
                                <CardBody className="gap-8 p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 shape-squircle bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                                            <Wallet size={28} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white">Add Funds via UPI</h2>
                                            <p className="text-white/40 text-sm font-mono">SELECT_AMOUNT // SECURE</p>
                                        </div>
                                    </div>

                                    {/* Preset Amounts */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Quick Select</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {presetAmounts.map((preset) => (
                                                <Button
                                                    key={preset}
                                                    onClick={() => handlePresetAmount(preset)}
                                                    className={`h-16 font-bold text-lg transition-all btn-squircle ${amount === preset.toString()
                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-105 shadow-lg shadow-green-500/30'
                                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                                        } `}
                                                >
                                                    ₹{preset}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom Amount */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Custom Amount</label>
                                        <Input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            startContent={<span className="text-2xl font-bold text-green-400">₹</span>}
                                            classNames={{
                                                input: "text-2xl font-bold text-white",
                                                inputWrapper: "h-16 bg-white/5 border-2 border-white/20 hover:border-green-500/50 transition-all btn-squircle"
                                            }}
                                            size="lg"
                                        />
                                    </div>

                                    {numAmount > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-col gap-2 p-4 btn-squircle bg-white/5 border border-white/10"
                                        >
                                            <div className="flex justify-between text-sm text-white/60">
                                                <span>Amount to Pay</span>
                                                <span className="font-bold text-white">₹{numAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-red-400/80">
                                                <span>Processing Fee (10%)</span>
                                                <span className="font-bold">-₹{fee.toFixed(2)}</span>
                                            </div>
                                            <div className="h-px bg-white/10 my-1"></div>
                                            <div className="flex justify-between text-lg font-black">
                                                <span className="text-white">You Receive</span>
                                                <span className="text-green-400">₹{netAmount.toFixed(2)}</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    <Button
                                        onClick={handleProceedToConfirm}
                                        disabled={numAmount <= 0}
                                        size="lg"
                                        className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed btn-squircle shadow-lg shadow-green-500/20"
                                        endContent={<ArrowRight size={24} />}
                                    >
                                        Continue to Payment
                                    </Button>
                                </CardBody>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Confirmation */}
                {step === 'confirm' && (
                    <motion.div
                        key="confirm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full"
                    >
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-[40px] blur-xl opacity-50" />
                            <Card className="w-full glass-tahoe border-0 shape-squircle relative">
                                <CardBody className="gap-8 p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 shape-squircle bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <CheckCircle size={28} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white">Confirm Payment Details</h2>
                                            <p className="text-white/40 text-sm font-mono">VERIFY_INFO // PROCEED</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-6 shape-squircle bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
                                            <div className="text-center space-y-2">
                                                <p className="text-white/60 text-sm uppercase tracking-wider">Amount to Pay</p>
                                                <p className="text-5xl font-black text-white">₹{numAmount}</p>
                                                <p className="text-green-400 font-bold text-lg">+ You receive ₹{netAmount.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 p-4 btn-squircle bg-white/5">
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Payment Method</span>
                                                <span className="text-white font-bold">UPI</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Payment ID</span>
                                                <span className="text-white/40 font-mono text-xs">{paymentId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Processing Time</span>
                                                <span className="text-white font-bold">5-10 minutes</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Admin Approval</span>
                                                <span className="text-yellow-400 font-bold">Required (first payment)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => setStep('amount')}
                                            variant="bordered"
                                            className="flex-1 h-14 border-white/20 text-white font-bold btn-squircle"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleProceedToPayment}
                                            size="lg"
                                            className="flex-1 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg btn-squircle shadow-lg shadow-green-500/20"
                                            endContent={<QrCode size={24} />}
                                        >
                                            Show QR Code
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Payment QR with Timer */}
                {step === 'payment' && (
                    <motion.div
                        key="payment"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full"
                    >
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-[40px] blur-xl opacity-50" />
                            <Card className="w-full glass-tahoe border-0 shape-squircle relative">
                                <CardBody className="gap-6 p-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 shape-squircle bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/30">
                                                <QrCode size={28} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-white">Scan & Pay</h2>
                                                <p className="text-white/40 text-sm font-mono">WAITING_FOR_PAYMENT</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <CircularProgress
                                                value={(timeLeft / 300) * 100}
                                                color="warning"
                                                showValueLabel={true}
                                                size="lg"
                                                label={formatTime(timeLeft)}
                                                classNames={{
                                                    svg: "w-16 h-16",
                                                    value: "text-sm font-mono font-bold text-white",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-4 p-4 shape-squircle bg-white/5 border border-white/10 relative overflow-hidden">
                                        <div className="bg-white p-4 shape-squircle shadow-2xl z-10">
                                            <QRCodeSVG value={upiLink} size={200} />
                                        </div>

                                        {/* Scanning animation overlay */}
                                        <motion.div
                                            className="absolute top-0 left-0 w-full h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.8)] z-20"
                                            animate={{ top: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        />

                                        <div className="text-center space-y-2">
                                            <p className="text-xl font-bold text-white">₹{numAmount}</p>
                                            <p className="text-sm text-white/60">
                                                Scan with any UPI App<br />
                                                (GPay, PhonePe, Paytm, FamPay)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            as="a"
                                            href={upiLink}
                                            color="primary"
                                            size="lg"
                                            className="w-full h-14 bg-gradient-to-r from-blue-500 to-cyan-600 font-black text-lg btn-squircle shadow-lg shadow-blue-500/20"
                                        >
                                            Open UPI App
                                        </Button>

                                        {showManualEntry ? (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="space-y-3 pt-4 border-t border-white/10"
                                            >
                                                <div className="flex items-center gap-2 text-yellow-400">
                                                    <AlertCircle size={18} />
                                                    <p className="text-sm font-bold">Payment taking too long?</p>
                                                </div>
                                                <Input
                                                    label="Enter Transaction ID / UTR"
                                                    placeholder="e.g. 321456789012"
                                                    value={manualUtr}
                                                    onChange={(e) => setManualUtr(e.target.value)}
                                                    variant="bordered"
                                                    classNames={{
                                                        inputWrapper: "border-white/20 btn-squircle"
                                                    }}
                                                />
                                                <Button
                                                    onClick={handleManualSubmit}
                                                    isLoading={isSubmittingUtr}
                                                    className="w-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 font-bold btn-squircle"
                                                >
                                                    Submit Manually
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <p className="text-center text-xs text-white/40">
                                                Waiting for payment confirmation...<br />
                                                Manual entry available in {formatTime(timeLeft)}
                                            </p>
                                        )}

                                        <Button
                                            onClick={() => setStep('confirm')}
                                            variant="light"
                                            className="w-full text-white/60"
                                        >
                                            Cancel Transaction
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Payment Status */}
                {step === 'status' && (
                    <motion.div
                        key="status"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full"
                    >
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-[40px] blur-xl opacity-50" />
                            <Card className="w-full glass-tahoe border-0 shape-squircle relative">
                                <CardBody className="gap-8 p-8">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", duration: 0.6 }}
                                            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30"
                                        >
                                            <CheckCircle size={48} className="text-white" />
                                        </motion.div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white mb-2">Request Submitted!</h2>
                                            <p className="text-white/60">We are verifying your payment.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6 shape-squircle bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-4 p-4 btn-squircle bg-yellow-500/10 border border-yellow-500/30">
                                            <Clock className="text-yellow-400" size={24} />
                                            <div className="flex-1">
                                                <p className="font-bold text-white">Pending Verification</p>
                                                <p className="text-sm text-white/60">This usually takes 5-15 minutes.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Amount Paid</span>
                                                <span className="text-white font-bold">₹{numAmount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Will be Credited</span>
                                                <span className="text-green-400 font-bold">₹{netAmount.toFixed(2)}</span>
                                            </div>
                                            {manualUtr && (
                                                <div className="flex justify-between">
                                                    <span className="text-white/60">UTR / Ref</span>
                                                    <span className="text-white/40 font-mono text-xs">{manualUtr}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 btn-squircle bg-blue-500/10 border border-blue-500/30">
                                        <p className="text-sm text-blue-400 text-center">
                                            💡 Your funds will appear in your balance after admin approval.
                                            You'll receive a notification once approved.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleReset}
                                        size="lg"
                                        className="w-full h-14 bg-white/10 hover:bg-white/20 text-white font-bold btn-squircle"
                                    >
                                        Done
                                    </Button>
                                </CardBody>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
