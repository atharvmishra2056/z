"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Avatar, Chip, Spinner } from "@heroui/react";
import { useMarketAccount } from "@/hooks/useMarket";

interface AccountDetailModalProps {
    itemid: number | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountDetailModal({ itemid, isOpen, onClose }: AccountDetailModalProps) {
    const { item, loading, error } = useMarketAccount(itemid);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="3xl"
            classNames={{
                base: "bg-black/95 backdrop-blur-xl border border-white/[0.08] rounded-[2rem]",
                header: "border-b border-white/10",
                body: "py-6",
                footer: "border-t border-white/10",
            }}
        >
            <ModalContent>
                {loading && (
                    <ModalBody className="flex items-center justify-center min-h-[400px]">
                        <Spinner size="lg" color="white" />
                    </ModalBody>
                )}

                {error && (
                    <ModalBody className="flex items-center justify-center min-h-[400px]">
                        <p className="text-red-400">{error}</p>
                    </ModalBody>
                )}

                {item && (
                    <>
                        <ModalHeader className="flex flex-col gap-3">
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
                        </ModalHeader>

                        <ModalBody className="space-y-6">
                            {/* Description */}
                            <div>
                                <h4 className="text-sm font-bold text-white/60 mb-2">Description</h4>
                                <p className="text-white/90 leading-relaxed">{item.description || 'No description provided'}</p>
                            </div>

                            {/* Stats Grid */}
                            <div>
                                <h4 className="text-sm font-bold text-white/60 mb-3">Account Details</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                            </div>

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                                <div>
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
                                </div>
                            )}
                        </ModalBody>

                        <ModalFooter className="gap-3">
                            <Button
                                radius="full"
                                variant="bordered"
                                className="border-white/20 text-white hover:bg-white/10"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                radius="full"
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg"
                                as="a"
                                href={`https://lzt.market/${item.itemid}/`}
                                target="_blank"
                            >
                                Buy on LZT Market →
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}