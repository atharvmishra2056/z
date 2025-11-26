"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { ArrowLeft, Calendar, DollarSign, Package, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";

export default function TransactionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { transactions } = useUser();

    const txId = params?.id as string;
    const transaction = transactions.find(t => t.id === txId);

    if (!transaction) {
        return (
            <main className="min-h-screen bg-void">
                <Navbar />
                <div className="container mx-auto px-4 pt-32">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-white/50 mb-4">Transaction not found</p>
                        <Button
                            variant="bordered"
                            className="border-white/20 text-white"
                            onClick={() => router.push("/profile")}
                            startContent={<ArrowLeft size={16} />}
                        >
                            Back to Profile
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    const isDeposit = transaction.type === "deposit";
    const isPurchase = transaction.type === "purchase";

    return (
        <main className="min-h-screen bg-void">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-sm font-mono text-white/40">
                    <button onClick={() => router.push("/profile")} className="hover:text-white/80">
                        PROFILE
                    </button>
                    <span>/</span>
                    <span>TRANSACTIONS</span>
                    <span>/</span>
                    <span className="text-brand-primary">#{transaction.id}</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-2">
                                Transaction Details
                            </h1>
                            <p className="text-white/50 font-mono text-sm">#{transaction.id}</p>
                        </div>
                        <Chip
                            size="lg"
                            className={`${isDeposit
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}
                            startContent={
                                isDeposit ? <TrendingUp size={16} /> : <TrendingDown size={16} />
                            }
                        >
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Chip>
                    </div>

                    {/* Main Info Card */}
                    <Card className="glass-panel border border-white/10">
                        <CardBody className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Amount */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign size={16} className="text-white/40" />
                                        <p className="text-xs text-white/40 uppercase tracking-widest">
                                            Amount
                                        </p>
                                    </div>
                                    <p className={`text-4xl font-black font-mono ${isDeposit ? "text-green-400" : "text-white"
                                        }`}>
                                        {isDeposit ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                                    </p>
                                </div>

                                {/* Date & Time */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-white/40" />
                                        <p className="text-xs text-white/40 uppercase tracking-widest">
                                            Date & Time
                                        </p>
                                    </div>
                                    <p className="text-white/90 font-mono">
                                        {transaction.timestamp.toLocaleDateString()}
                                    </p>
                                    <p className="text-white/60 font-mono text-sm">
                                        {transaction.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet size={16} className="text-white/40" />
                                        <p className="text-xs text-white/40 uppercase tracking-widest">
                                            Description
                                        </p>
                                    </div>
                                    <p className="text-white/90">
                                        {transaction.description}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Item Details (if purchase) */}
                    {isPurchase && transaction.lzt_item_id && (
                        <Card className="glass-panel border border-white/10">
                            <CardBody className="p-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <Package size={20} className="text-brand-primary" />
                                    <h3 className="text-lg font-bold text-white">Purchased Item</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                                            Item ID
                                        </p>
                                        <p className="text-white/80 font-mono">
                                            #{transaction.lzt_item_id}
                                        </p>
                                    </div>

                                    <Button
                                        variant="flat"
                                        className="bg-white/5 text-white hover:bg-white/10"
                                        onClick={() => router.push(`/profile`)}
                                    >
                                        View in My Assets
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            variant="bordered"
                            className="border-white/20 text-white hover:bg-white/5"
                            onClick={() => router.push("/profile")}
                            startContent={<ArrowLeft size={16} />}
                        >
                            Back to Profile
                        </Button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
