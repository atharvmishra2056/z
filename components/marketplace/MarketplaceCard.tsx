"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import { Card, CardBody, CardFooter, Avatar, Button, Chip } from "@heroui/react";
import type { MarketItem } from "@/types/market";
import ElectricBorder from "@/components/ui/ElectricBorder";

interface MarketplaceCardProps {
    item: MarketItem;
}

export default function MarketplaceCard({ item }: MarketplaceCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getCategoryColor = (categoryid: number) => {
        const colors: Record<number, string> = {
            1: '#8b5cf6', // Steam - Purple
            2: '#ef4444', // Valorant - Red
            3: '#f59e0b', // Epic - Orange
            4: '#06b6d4', // Battle.net - Cyan
        };
        return colors[categoryid] || '#3b82f6';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <ElectricBorder
                color={getCategoryColor(item.categoryid)}
                speed={1.5}
                chaos={0.6}
                thickness={2}
                style={{ borderRadius: "1.5rem" }}
            >
                <Card className="bg-black/90 backdrop-blur-xl border-none rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)] transition-all h-full">
                    <CardBody className="p-6 gap-4">
                        {/* Header with Seller Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    size="sm"
                                    src={`https://forum.lzt.market/data/avatars/s/${item.seller.userid}/${item.seller.avatardate}.jpg`}
                                    fallback={item.seller.username[0]}
                                    classNames={{
                                        base: "border border-white/20",
                                    }}
                                />
                                <div>
                                    <p className="text-xs font-bold text-white">{item.seller.username}</p>
                                    <p className="text-xs text-white/50">{item.seller.solditemscount} sold</p>
                                </div>
                            </div>

                            {item.itemstate === 'active' && (
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    classNames={{
                                        base: "bg-green-500/20 border border-green-500/30",
                                        content: "text-green-400 font-bold text-xs",
                                    }}
                                >
                                    Active
                                </Chip>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-black text-white line-clamp-2 min-h-[3.5rem]">
                            {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-white/70 line-clamp-3 min-h-[4rem]">
                            {item.description || 'No description available'}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10">
                            {item.steamlevel && (
                                <div className="flex flex-col">
                                    <span className="text-xs text-white/50">Level</span>
                                    <span className="text-sm font-bold text-white">{item.steamlevel}</span>
                                </div>
                            )}
                            {item.steamgames && (
                                <div className="flex flex-col">
                                    <span className="text-xs text-white/50">Games</span>
                                    <span className="text-sm font-bold text-white">{item.steamgames}</span>
                                </div>
                            )}
                            {item.valorantrank && (
                                <div className="flex flex-col">
                                    <span className="text-xs text-white/50">Rank</span>
                                    <span className="text-sm font-bold text-white">{item.valorantrank}</span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-xs text-white/50">Views</span>
                                <span className="text-sm font-bold text-white">{item.viewcount}</span>
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="p-6 pt-0 flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black gradient-text">
                                {formatPrice(item.price)}
                            </span>
                            {item.rubprice && (
                                <span className="text-xs text-white/50">
                                    ₽{item.rubprice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <Link href={`/item/${item.itemid}`} passHref>
                            <Button
                                as="a"
                                size="md"
                                radius="full"
                                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                            >
                                View Details →
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </ElectricBorder>
        </motion.div>
    );
}