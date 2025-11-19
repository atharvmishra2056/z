"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Image, Button, Chip } from "@heroui/react";
import ElectricBorder from "@/components/ui/ElectricBorder";

const featured = [
    {
        title: "Steam Premium",
        subtitle: "1000+ Games Library",
        price: "$199",
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
        badge: "Popular",
        borderColor: "#8b5cf6",
        gradient: "from-purple-500/30 to-blue-500/30",
    },
    {
        title: "Valorant Radiant",
        subtitle: "All Skins + Battle Pass",
        price: "$149",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
        badge: "Hot",
        borderColor: "#ef4444",
        gradient: "from-red-500/30 to-pink-500/30",
    },
    {
        title: "Epic Games",
        subtitle: "Fortnite OG Skins",
        price: "$299",
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
        badge: "Exclusive",
        borderColor: "#f59e0b",
        gradient: "from-orange-500/30 to-yellow-500/30",
    },
    {
        title: "Battle.net Pro",
        subtitle: "WoW + Overwatch 2",
        price: "$179",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
        badge: "New",
        borderColor: "#06b6d4",
        gradient: "from-cyan-500/30 to-blue-500/30",
    },
];

export default function FeaturedCards() {
    return (
        <section className="w-full py-16">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-12"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text"
                    >
                        Featured Marketplace
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white/60 font-medium"
                    >
                        Explore our premium collection of verified gaming accounts
                    </motion.p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featured.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <ElectricBorder
                                color={item.borderColor}
                                speed={1.5}
                                chaos={0.8}
                                thickness={2}
                                style={{ borderRadius: "1.5rem" }}
                            >
                                <Card className="bg-black/80 backdrop-blur-xl border-none rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)] transition-all h-full">
                                    <CardBody className="p-0">
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden rounded-t-[1.5rem]">
                                            <Image
                                                removeWrapper
                                                alt={item.title}
                                                className="z-0 w-full h-full object-cover"
                                                src={item.image}
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} to-transparent`} />

                                            {/* Badge */}
                                            <div className="absolute top-4 right-4">
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    classNames={{
                                                        base: "bg-black/40 backdrop-blur-xl border border-white/20 rounded-full",
                                                        content: "text-white font-bold text-xs px-2",
                                                    }}
                                                >
                                                    {item.badge}
                                                </Chip>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 space-y-3">
                                            <h3 className="text-2xl font-black text-white">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-white/70 font-medium">
                                                {item.subtitle}
                                            </p>
                                            <div className="flex items-center justify-between pt-2">
                        <span className="text-3xl font-black gradient-text">
                          {item.price}
                        </span>
                                                <Button
                                                    size="sm"
                                                    radius="full"
                                                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                                                >
                                                    View →
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </ElectricBorder>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}