"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ItemDetailView from "@/components/marketplace/ItemDetailView";
import PurchaseModal from "@/components/marketplace/PurchaseModal";
import AuthModal from "@/components/auth/AuthModal";
import { MarketItem } from "@/types/api-types";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/contexts/ToastContext";

export default function ItemPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [item, setItem] = useState<MarketItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const { isAuthenticated, ownedAssets } = useUser();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`/api/marketplace/${id}`);
                if (!response.ok) throw new Error("Item not found");

                const data = await response.json();
                if (data.success) {
                    setItem(data.item);
                } else {
                    throw new Error(data.error || 'Failed to fetch item');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id]);

    const handlePurchaseClick = () => {
        if (!isAuthenticated) {
            setIsAuthOpen(true);
            return;
        }

        // Check if already owned
        if (item && ownedAssets.some(a => a.item_id === item.item_id)) {
            showToast("You already own this item!", "info");
            return;
        }

        setIsPurchaseOpen(true);
    };

    const handlePurchaseSuccess = () => {
        setIsPurchaseOpen(false);
        showToast("Purchase successful! Check your profile.", "success");
        setTimeout(() => {
            router.push("/profile");
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-void">
            <Navbar />
            <div className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
                <ItemDetailView
                    item={item}
                    loading={loading}
                    error={error}
                    onPurchase={handlePurchaseClick}
                    onRetry={() => window.location.reload()}
                />
            </div>

            {item && (
                <PurchaseModal
                    isOpen={isPurchaseOpen}
                    onClose={() => setIsPurchaseOpen(false)}
                    item={item}
                    onSuccess={handlePurchaseSuccess}
                />
            )}

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
            />
        </main>
    );
}
