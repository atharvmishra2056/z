"use client";

import Navbar from "@/components/Navbar";
import { useUser } from "@/contexts/UserContext";
import { Button, Chip, Avatar, Progress, Spinner } from "@heroui/react";
import { ShieldCheck, Wallet, Clock, Settings, LogOut, CreditCard, ArrowUpRight, ArrowDownLeft, History } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import TacticalCard from "@/components/TacticalCard";
import WalletModal from "@/components/profile/WalletModal";
import { motion } from "framer-motion";
import TransactionCard from "@/components/profile/TransactionCard";
import { useCurrency } from "@/contexts/CurrencyContext";

// Helper for slug (reused)
const getSlug = (id: number) => {
    if (id === 13) return "valorant";
    if (id === 1) return "steam";
    if (id === 9) return "fortnite";
    if (id === 15) return "clash-of-clans";
    if (id === 28) return "minecraft";
    return "valorant";
};

export default function ProfilePage() {
    const { username, email, avatar, balance, trustScore, ownedAssets, transactions, loading } = useUser();
    const { formatPrice } = useCurrency();
    const [activeTab, setActiveTab] = useState<'assets' | 'transactions'>('assets');
    const [isWalletOpen, setIsWalletOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-void flex items-center justify-center">
                <Spinner size="lg" color="white" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-void pb-20">
            <div className="fixed top-6 z-50 w-full flex justify-center pointer-events-none">
                <div className="pointer-events-auto w-full">
                    <Navbar />
                </div>
            </div>

            <div className="container mx-auto px-4 pt-32 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: IDENTITY (Sticky) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Identity Card */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-purple-500/20 rounded-[40px] blur-xl opacity-50" />
                            <div className="glass-tahoe shape-squircle p-8 text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="relative mb-6">
                                        <Avatar
                                            src={avatar || undefined}
                                            className="w-32 h-32 text-large border-4 border-white/10 shadow-2xl"
                                        />
                                        <div className="absolute bottom-0 right-0 bg-brand-primary text-black p-1.5 rounded-full border-4 border-black">
                                            <ShieldCheck size={20} />
                                        </div>
                                    </div>

                                    <h1 className="text-2xl font-black text-white mb-1">{username}</h1>
                                    <p className="text-white/40 font-mono text-sm mb-6">{email}</p>

                                    <div className="w-full bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
                                        <div className="flex justify-between text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">
                                            <span>Trust Score</span>
                                            <span className="text-brand-primary">{trustScore}/100</span>
                                        </div>
                                        <Progress
                                            aria-label="Trust Score"
                                            value={trustScore}
                                            classNames={{
                                                indicator: "bg-gradient-to-r from-brand-primary to-brand-secondary",
                                                track: "bg-white/10"
                                            }}
                                            size="sm"
                                        />
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        <Button variant="flat" className="flex-1 bg-white/5 text-white hover:bg-white/10">
                                            <Settings size={18} />
                                        </Button>
                                        <Button variant="flat" className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20">
                                            <LogOut size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Module */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-[40px] blur-xl opacity-50" />
                            <div className="glass-panel shape-squircle p-8 relative overflow-hidden shadow-tahoe">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-xl text-white">
                                            <Wallet size={20} />
                                        </div>
                                        <span className="font-bold text-white/60 text-sm uppercase tracking-wider">Balance</span>
                                    </div>
                                    <Chip size="sm" variant="flat" className="bg-brand-primary/10 text-brand-primary font-mono">
                                        LIVE
                                    </Chip>
                                </div>

                                <div className="mb-8">
                                    <span className="text-5xl font-black text-white tracking-tighter">
                                        {formatPrice(balance)}
                                    </span>
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        <Button
                                            onClick={() => setIsWalletOpen(true)}
                                            size="lg"
                                            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold hover:scale-[1.02] transition-transform btn-squircle shadow-lg shadow-brand-primary/20"
                                            startContent={<Wallet size={20} />}
                                        >
                                            Add Funds
                                        </Button>
                                        <Button
                                            as={Link}
                                            href="/profile/transactions"
                                            size="lg"
                                            variant="bordered"
                                            className="border-white/20 text-white font-bold hover:bg-white/5 btn-squircle"
                                            startContent={<History size={20} />}
                                        >
                                            Transactions
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: VAULT */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Tabs */}
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            <TabButton
                                active={activeTab === 'assets'}
                                onClick={() => setActiveTab('assets')}
                                label="Asset Vault"
                                count={ownedAssets.length}
                            />
                            <TabButton
                                active={activeTab === 'transactions'}
                                onClick={() => setActiveTab('transactions')}
                                label="Transaction Log"
                                count={transactions.length}
                            />
                        </div>

                        {/* Content Area */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-[500px]"
                        >
                            {activeTab === 'assets' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {ownedAssets.map(item => (
                                        <TacticalCard
                                            key={item.item_id}
                                            item={item}
                                            gameSlug={getSlug(item.category_id)}
                                        />
                                    ))}
                                    {ownedAssets.length === 0 && (
                                        <div className="col-span-full glass-panel rounded-3xl p-12 text-center border border-white/5">
                                            <p className="text-white/40 font-mono">No assets acquired yet.</p>
                                            <Button
                                                as="a"
                                                href="/marketplace"
                                                className="mt-4 bg-white/10 text-white"
                                            >
                                                Browse Market
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.map((tx, idx) => (
                                        <TransactionCard
                                            key={tx.id}
                                            transaction={tx as any}
                                            index={idx}
                                        />
                                    ))}
                                    {transactions.length === 0 && (
                                        <div className="glass-panel rounded-3xl p-12 text-center border border-white/5">
                                            <p className="text-white/40 font-mono">No transactions yet</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
        </main>
    );
}

function TabButton({ active, onClick, label, count }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${active
                ? "bg-white text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
        >
            {label}
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? "bg-black/10 text-black" : "bg-white/10 text-white"}`}>
                {count}
            </span>
        </button>
    );
}
