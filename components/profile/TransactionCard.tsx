"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Chip } from "@heroui/react";
import { TrendingUp, TrendingDown, ShoppingCart, ArrowRight } from "lucide-react";
import { Transaction } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

interface TransactionCardProps {
    transaction: Transaction;
    index?: number;
}

export default function TransactionCard({ transaction, index = 0 }: TransactionCardProps) {
    const router = useRouter();
    const isDeposit = transaction.type === "deposit";
    const isPurchase = transaction.type === "purchase";

    const icon = isDeposit ? TrendingUp : isPurchase ? ShoppingCart : TrendingDown;
    const Icon = icon;

    const bgColor = isDeposit
        ? "bg-green-500/5 hover:bg-green-500/10"
        : "bg-blue-500/5 hover:bg-blue-500/10";

    const borderColor = isDeposit
        ? "border-green-500/20 hover:border-green-500/30"
        : "border-blue-500/20 hover:border-blue-500/30";

    const amountColor = isDeposit ? "text-green-400" : "text-white";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card
                isPressable
                className={`glass-panel border-0 transition-all cursor-pointer group hover:bg-white/5 ${borderColor} btn-squircle`}
                onClick={() => router.push(`/transactions/${transaction.id}`)}
            >
                <CardBody className="p-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Icon + Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-xl ${isDeposit
                                ? "bg-green-500/20"
                                : "bg-blue-500/20"
                                } flex items-center justify-center flex-shrink-0`}>
                                <Icon
                                    size={20}
                                    className={isDeposit ? "text-green-400" : "text-blue-400"}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm truncate">
                                    {transaction.description}
                                </p>
                                <p className="text-white/40 text-xs font-mono">
                                    {transaction.timestamp.toLocaleDateString()} • {transaction.timestamp.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        {/* Right: Amount + Arrow */}
                        <div className="flex items-center gap-3">
                            <p className={`font-black font-mono text-lg ${amountColor}`}>
                                {isDeposit ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                            </p>
                            <ArrowRight
                                size={16}
                                className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all"
                            />
                        </div>
                    </div>

                    {/* Transaction Type Chip */}
                    <div className="mt-2">
                        <Chip
                            size="sm"
                            className={`${isDeposit
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}
                        >
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Chip>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
}
