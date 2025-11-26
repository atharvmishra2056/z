"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";
import { CheckCircle2, ArrowRight, User, Wallet, Copy, Check } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function PurchaseSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { balance, transactions } = useUser();
    const [countdown, setCountdown] = useState(10);
    const [copied, setCopied] = useState(false);
    
    // Get transaction ID from URL
    const txId = searchParams.get('tx');
    const credentialsId = searchParams.get('cred');
    
    // Find the transaction
    const transaction = transactions.find(t => t.id === txId) || {
        id: txId || 'unknown',
        amount: 0,
        type: 'purchase' as const,
        timestamp: new Date(),
        description: 'Purchase completed'
    };

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    router.push("/profile");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);
    
    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-void">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/20 mb-6"
                        >
                            <CheckCircle2 className="text-brand-primary" size={40} />
                        </motion.div>
                        <h1 className="text-4xl font-black text-white mb-2">
                            Purchase Successful!
                        </h1>
                        <p className="text-white/50 font-mono text-sm">
                            Transaction #{transaction.id}
                        </p>
                    </div>

                    {/* Transaction Details Card */}
                    <Card className="glass-panel border border-white/10">
                        <CardBody className="p-8">
                            <div className="space-y-6">
                                {/* Item Info */}
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2">
                                        Item Purchased
                                    </p>
                                    <h3 className="text-xl font-bold text-white">
                                        {transaction.description || 'Gaming Account'}
                                    </h3>
                                    {credentialsId && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <code className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
                                                Credentials ID: {credentialsId}
                                            </code>
                                            <button
                                                onClick={() => handleCopy(credentialsId)}
                                                className="text-white/40 hover:text-white transition-colors"
                                            >
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/10" />

                                {/* Price & Balance */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs text-white/40 uppercase tracking-widest mb-2">
                                            Amount Paid
                                        </p>
                                        <p className="text-2xl font-black text-white font-mono">
                                            ${Math.abs(transaction.amount).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/40 uppercase tracking-widest mb-2">
                                            New Balance
                                        </p>
                                        <p className="text-2xl font-black text-brand-primary font-mono">
                                            ${balance.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Timestamp */}
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2">
                                        Transaction Time
                                    </p>
                                    <p className="text-white/80 font-mono text-sm">
                                        {new Date(transaction.timestamp).toLocaleString()}
                                    </p>
                                </div>

                                {/* Status Chips */}
                                <div className="flex gap-2 flex-wrap">
                                    <Chip
                                        size="sm"
                                        className="bg-green-500/10 text-green-400 border border-green-500/20"
                                        startContent={<CheckCircle2 size={14} />}
                                    >
                                        Instant Delivery
                                    </Chip>
                                    <Chip
                                        size="sm"
                                        className="bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    >
                                        Verified Purchase
                                    </Chip>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Next Steps Card */}
                    <Card className="glass-panel border border-white/10">
                        <CardBody className="p-6">
                            <h4 className="text-sm font-bold text-white mb-4">What's Next?</h4>
                            <ul className="space-y-3 text-sm text-white/70">
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 size={12} className="text-brand-primary" />
                                    </div>
                                    <span>Check your email for account credentials and access instructions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <User size={12} className="text-brand-primary" />
                                    </div>
                                    <span>Visit your profile to view all purchased assets</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Wallet size={12} className="text-brand-primary" />
                                    </div>
                                    <span>Transaction history is available in your profile</span>
                                </li>
                            </ul>
                        </CardBody>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            size="lg"
                            className="flex-1 bg-brand-primary text-black font-bold shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)] hover:scale-105 transition-transform"
                            endContent={<ArrowRight />}
                            onClick={() => router.push("/profile")}
                        >
                            Go to Profile
                        </Button>
                        <Button
                            size="lg"
                            variant="bordered"
                            className="flex-1 border-white/20 text-white hover:bg-white/5"
                            onClick={() => router.push("/marketplace")}
                        >
                            Continue Shopping
                        </Button>
                    </div>

                    {/* Auto-redirect notice */}
                    <p className="text-center text-white/30 text-sm font-mono">
                        Auto-redirecting to profile in {countdown}s...
                    </p>
                </motion.div>
            </div>
        </main>
    );
}

// Wrap in Suspense for useSearchParams
export default function PurchaseSuccessPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-void flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </main>
        }>
            <PurchaseSuccessContent />
        </Suspense>
    );
}
