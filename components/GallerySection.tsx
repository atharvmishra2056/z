"use client";

import { motion } from "framer-motion";
import { Card, CardFooter, Image, Button } from "@heroui/react";

const galleryItems = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
        title: "Steam Collection",
        subtitle: "1000+ Premium Games",
        className: "col-span-2 row-span-2",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
        title: "Valorant Premium",
        subtitle: "Radiant Ready",
        className: "col-span-1 row-span-1",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
        title: "Epic Games",
        subtitle: "Exclusive Skins",
        className: "col-span-1 row-span-1",
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
        title: "Battle.net Pro",
        subtitle: "Max Level Accounts",
        className: "col-span-2 row-span-1",
    },
];

export default function GallerySection() {
    return (
        <section className="w-full py-12">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-3">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black gradient-text"
                    >
                        Premium Accounts Gallery
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg text-white/60 font-medium"
                    >
                        Explore our curated collection of verified gaming accounts
                    </motion.p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:gap-6 h-[600px] md:h-[700px]">
                    {galleryItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={item.className}
                        >
                            <Card
                                isFooterBlurred
                                className="w-full h-full border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)] hover:scale-[1.02] hover:border-white/[0.15] transition-all duration-500"
                            >
                                <Image
                                    removeWrapper
                                    alt={item.title}
                                    className="z-0 w-full h-full object-cover"
                                    src={item.image}
                                />

                                {/* Enhanced blurred footer */}
                                <CardFooter className="absolute bottom-0 z-10 justify-between w-full bg-black/40 backdrop-blur-2xl border-t border-white/[0.08] rounded-b-[2rem] py-4 px-5">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm md:text-base font-black text-white">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-white/70 font-medium">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                    <Button
                                        className="text-xs font-bold text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                                        color="default"
                                        radius="full"
                                        size="sm"
                                        variant="flat"
                                    >
                                        View
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}