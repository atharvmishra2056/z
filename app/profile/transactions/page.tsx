"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { ArrowLeft, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";

interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'purchase';
    amount: number;
    status: 'pending' | 'completed' | 'rejected';
    method?: string;
    created_at: Timestamp;
    description?: string;
}

export default function TransactionsPage() {
    const { isAuthenticated, uid, username } = useUser();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !uid) return;

        // Listen to payment_requests for deposits
        const paymentsQuery = query(
            collection(db, "payment_requests"),
            where("user_id", "==", uid),
            orderBy("created_at", "desc")
        );

        const unsubscribe = onSnapshot(paymentsQuery, (snapshot) => {
            const txns: Transaction[] = snapshot.docs.map(doc => ({
                id: doc.id,
                type: 'deposit',
                amount: doc.data().net_amount_usd || doc.data().amount || 0,
                status: doc.data().status,
                method: doc.data().method,
                created_at: doc.data().created_at,
                description: `${doc.data().method?.toUpperCase()} Deposit`
            }));
            setTransactions(txns);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated, uid]);

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'completed':
                return <Chip color="success" variant="flat" startContent={<CheckCircle size={16} />}>Completed</Chip>;
            case 'pending':
                return <Chip color="warning" variant="flat" startContent={<Clock size={16} />}>Pending</Chip>;
            case 'rejected':
                return <Chip color="danger" variant="flat" startContent={<XCircle size={16} />}>Rejected</Chip>;
            default:
                return <Chip variant="flat">{status}</Chip>;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'deposit':
                return <ArrowDownRight className="text-green-400" size={20} />;
            case 'withdrawal':
                return <ArrowUpRight className="text-red-400" size={20} />;
            case 'purchase':
                return <ArrowUpRight className="text-blue-400" size={20} />;
            default:
                return null;
        }
    };

    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            return timestamp.toDate().toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Please sign in to view transactions</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Transaction History
                        </h1>
                        <p className="text-white/40 mt-2 font-mono">PAYMENT_LOG // SECURED</p>
                    </div>
                    <Button
                        as={Link}
                        href="/profile"
                        variant="bordered"
                        className="border-white/20 text-white"
                        startContent={<ArrowLeft size={20} />}
                    >
                        Back to Profile
                    </Button>
                </div>

                {/* Transactions List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                        <p className="text-white/40 mt-4">Loading transactions...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <Card className="bg-white/5 border border-white/10">
                        <CardBody className="p-12 text-center">
                            <div className="space-y-4">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                                    <Clock size={40} className="text-white/40" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">No Transactions Yet</h3>
                                    <p className="text-white/40 mt-2">Your transaction history will appear here</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((txn, index) => (
                            <motion.div
                                key={txn.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                    <CardBody className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                    {getTypeIcon(txn.type)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-lg">
                                                        {txn.description || `${txn.type} Transaction`}
                                                    </p>
                                                    <p className="text-white/40 text-sm font-mono">
                                                        {formatDate(txn.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className={`text-xl font-black ${txn.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                                                        }`}>
                                                        {txn.type === 'deposit' ? '+' : '-'}${txn.amount.toFixed(2)}
                                                    </p>
                                                    <p className="text-white/40 text-xs uppercase">{txn.method}</p>
                                                </div>
                                                {getStatusChip(txn.status)}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
