"use client";

import { Button, Modal, ModalBody, ModalContent, ModalHeader, Spinner } from "@heroui/react";
import { ShoppingCart, X, AlertCircle, CheckCircle, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MarketItem } from "@/types/api-types";
import { useUser, PurchaseResult } from "@/contexts/UserContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MarketItem;
    onSuccess: () => void;
}

type ModalStep = "confirm" | "processing" | "success" | "error";

export default function PurchaseModal({ isOpen, onClose, item, onSuccess }: PurchaseModalProps) {
    const [step, setStep] = useState<ModalStep>("confirm");
    const [result, setResult] = useState<PurchaseResult | null>(null);
    const { balance, purchaseAsset, isAuthenticated } = useUser();
    const router = useRouter();

    const displayPrice = item.display_price || item.price * 2 + 5;
    const canAfford = balance >= displayPrice;
    const insufficientFunds = balance - displayPrice;
    
    const resetModal = () => {
        setStep("confirm");
        setResult(null);
    };
    
    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handlePurchase = async () => {
        if (!isAuthenticated) {
            router.push('/?auth=required');
            return;
        }
        
        setStep("processing");
        
        try {
            const purchaseResult = await purchaseAsset(item);
            setResult(purchaseResult);
            
            if (purchaseResult.success) {
                setStep("success");
                onSuccess();
            } else {
                setStep("error");
            }
        } catch (error: any) {
            console.error("Purchase failed:", error);
            setResult({ success: false, error: error.message || "Purchase failed" });
            setStep("error");
        }
    };
    
    const handleAddFunds = () => {
        handleClose();
        router.push('/add-funds');
    };
    
    const handleViewAssets = () => {
        handleClose();
        router.push('/profile');
    };

    // Processing Step
    if (step === "processing") {
        return (
            <Modal isOpen={isOpen} onClose={() => {}} hideCloseButton backdrop="blur" size="md"
                classNames={{ base: "bg-transparent shadow-none", wrapper: "z-[9999]" }}>
                <ModalContent className="glass-tahoe rounded-[2rem] p-8">
                    <div className="flex flex-col items-center justify-center py-8">
                        <Spinner size="lg" color="primary" className="mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Processing Purchase</h3>
                        <p className="text-white/50 text-sm text-center">Securing your item... Please wait.</p>
                    </div>
                </ModalContent>
            </Modal>
        );
    }
    
    // Success Step
    if (step === "success") {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} backdrop="blur" size="md"
                classNames={{ base: "bg-transparent shadow-none", wrapper: "z-[9999]" }}>
                <ModalContent className="glass-tahoe rounded-[2rem] p-8">
                    <div className="flex flex-col items-center justify-center py-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 success-pulse"
                        >
                            <CheckCircle className="text-green-400" size={32} />
                        </motion.div>
                        <h3 className="text-xl font-bold text-white mb-2">Purchase Successful!</h3>
                        <p className="text-white/50 text-sm text-center mb-6">
                            Your item has been added to your assets.
                        </p>
                        <div className="flex gap-3 w-full">
                            <Button variant="bordered" className="flex-1 border-white/10 text-white" onClick={handleClose}>
                                Continue Shopping
                            </Button>
                            <Button className="flex-1 bg-brand-primary text-black font-bold" onClick={handleViewAssets}>
                                View My Assets
                            </Button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        );
    }
    
    // Error Step
    if (step === "error") {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} backdrop="blur" size="md"
                classNames={{ base: "bg-transparent shadow-none", wrapper: "z-[9999]" }}>
                <ModalContent className="glass-tahoe rounded-[2rem] p-8">
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                            <X className="text-red-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Purchase Failed</h3>
                        <p className="text-white/50 text-sm text-center mb-2">
                            {result?.error || "Something went wrong. Please try again."}
                        </p>
                        {result?.refunded && (
                            <p className="text-green-400 text-xs mb-4">Your balance has been refunded.</p>
                        )}
                        <div className="flex gap-3 w-full">
                            <Button variant="bordered" className="flex-1 border-white/10 text-white" onClick={handleClose}>
                                Close
                            </Button>
                            <Button className="flex-1 bg-brand-primary text-black font-bold" onClick={resetModal}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        );
    }

    // Default: Confirm Step
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            backdrop="blur"
            size="md"
            classNames={{
                base: "bg-transparent shadow-none",
                wrapper: "z-[9999]",
            }}
            placement="center"
        >
            <ModalContent className="p-0 overflow-visible">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-tahoe rounded-[2rem] p-8 w-full overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                                <ShoppingCart className="text-brand-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white">Confirm Purchase</h2>
                        </div>
                        <Button isIconOnly variant="light" size="sm" onClick={onClose}>
                            <X className="text-white/50" size={20} />
                        </Button>
                    </div>

                    {/* Item Details */}
                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-sm text-white/50 mb-1">Purchasing</p>
                        <p className="text-white font-bold truncate">{item.title}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-2xl text-brand-primary font-black">${displayPrice.toFixed(2)}</p>
                            {item.original_price && (
                                <p className="text-sm text-white/30 line-through">${item.original_price.toFixed(2)}</p>
                            )}
                        </div>
                    </div>

                    {/* Balance Check */}
                    <div className="mb-6 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">Your Balance</span>
                            <span className="text-white font-mono">${balance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">After Purchase</span>
                            <span className={`font-mono font-bold ${canAfford ? 'text-brand-primary' : 'text-red-500'}`}>
                                ${canAfford ? (balance - displayPrice).toFixed(2) : insufficientFunds.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Warning if insufficient */}
                    {!canAfford && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="text-red-500" size={20} />
                            <div>
                                <p className="text-red-500 font-bold text-sm">Insufficient Funds</p>
                                <p className="text-red-400/70 text-xs">You need ${Math.abs(insufficientFunds).toFixed(2)} more to complete this purchase.</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="bordered"
                            className="flex-1 border-white/10 text-white"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        {canAfford ? (
                            <Button
                                className="flex-1 bg-brand-primary text-black font-bold shadow-[0_0_20px_-5px_rgba(124,58,237,0.4)]"
                                onClick={handlePurchase}
                            >
                                Confirm Purchase
                            </Button>
                        ) : (
                            <Button
                                className="flex-1 bg-brand-secondary text-white font-bold"
                                onClick={handleAddFunds}
                                startContent={<Wallet size={18} />}
                            >
                                Add Funds
                            </Button>
                        )}
                    </div>
                </motion.div>
            </ModalContent>
        </Modal>
    );
}
