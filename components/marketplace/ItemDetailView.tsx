"use client";

import { MarketItem } from '@/types/market';
import { Spinner, Button, Avatar, Chip, Card } from '@heroui/react';
import RotatingBorder from '../ui/RotatingBorder';
import Aurora from '../ui/Aurora';

interface ItemDetailViewProps {
    item: MarketItem | null;
    loading: boolean;
    error: string | null;
}

const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-black/30 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-6 ${className}`}>
        {children}
    </div>
);

export default function ItemDetailView({ item, loading, error }: ItemDetailViewProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" color="white" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-white/50">Account not found.</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Aurora />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <RotatingBorder>
                            <GlassCard>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-white">{item.title}</h3>
                                        <div className="flex items-center gap-3 mt-3">
                                            <Avatar
                                                size="sm"
                                                src={`https://forum.lzt.market/data/avatars/s/${item.seller.userid}/${item.seller.avatardate}.jpg`}
                                                fallback={item.seller.username[0]}
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-white">{item.seller.username}</p>
                                                <p className="text-xs text-white/50">{item.seller.solditemscount} items sold</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black gradient-text">
                                            ${item.price.toLocaleString()}
                                        </p>
                                        {item.rubprice && (
                                            <p className="text-sm text-white/50">₽{item.rubprice.toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </RotatingBorder>

                        <RotatingBorder>
                            <GlassCard>
                                <h4 className="text-sm font-bold text-white/60 mb-2">Description</h4>
                                <p className="text-white/90 leading-relaxed">{item.description || 'No description provided'}</p>
                            </GlassCard>
                        </RotatingBorder>
                    </div>

                    <div className="space-y-8">
                        <RotatingBorder>
                            <GlassCard>
                                <h4 className="text-sm font-bold text-white/60 mb-3">Account Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {item.steamlevel && (
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <p className="text-xs text-white/50 mb-1">Steam Level</p>
                                            <p className="text-lg font-bold text-white">{item.steamlevel}</p>
                                        </div>
                                    )}
                                    {item.steamgames && (
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <p className="text-xs text-white/50 mb-1">Games</p>
                                            <p className="text-lg font-bold text-white">{item.steamgames}</p>
                                        </div>
                                    )}
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <p className="text-xs text-white/50 mb-1">Views</p>
                                        <p className="text-lg font-bold text-white">{item.viewcount}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <p className="text-xs text-white/50 mb-1">Published</p>
                                        <p className="text-sm font-bold text-white">
                                            {new Date(item.publisheddate * 1000).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </RotatingBorder>

                        {item.tags && item.tags.length > 0 && (
                            <RotatingBorder>
                                <GlassCard>
                                    <h4 className="text-sm font-bold text-white/60 mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                size="sm"
                                                variant="flat"
                                                classNames={{
                                                    base: "bg-white/10 border border-white/20",
                                                    content: "text-white font-medium",
                                                }}
                                            >
                                                {tag}
                                            </Chip>
                                        ))}
                                    </div>
                                </GlassCard>
                            </RotatingBorder>
                        )}

                        <Button
                            radius="full"
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg"
                            as="a"
                            href={`https://lzt.market/${item.itemid}/`}
                            target="_blank"
                        >
                            Buy on LZT Market →
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
