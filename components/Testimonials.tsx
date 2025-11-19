"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Chip } from "@heroui/react";
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon";

const testimonials = [
    {
        name: "Alex Johnson",
        role: "Pro Gamer",
        username: "@alexgaming",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        rating: 5,
        text: "Best marketplace I've ever used! Got my Valorant account instantly with all the details. Support was amazing!",
        verified: true,
        date: "2 weeks ago",
    },
    {
        name: "Sarah Miller",
        role: "Content Creator",
        username: "@sarahmills",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        rating: 5,
        text: "Absolutely love the service. Clean interface, fast delivery, and genuine accounts. Highly recommended!",
        verified: true,
        date: "1 month ago",
    },
    {
        name: "Mike Chen",
        role: "Streamer",
        username: "@mikestreams",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
        rating: 5,
        text: "Been using KXW for months now. Never had any issues. Professional service and great prices!",
        verified: true,
        date: "3 weeks ago",
    },
];

export default function Testimonials() {
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
                        What Our Users Say
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white/60 font-medium"
                    >
                        Trusted by thousands of gamers worldwide
                    </motion.p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="bg-black/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)] hover:border-white/[0.15] transition-all duration-500 h-full">
                                {/* Subtle inner glow */}
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                                <CardHeader className="justify-between gap-3">
                                    <div className="flex gap-4">
                                        <Avatar
                                            isBordered
                                            radius="full"
                                            size="lg"
                                            src={testimonial.avatar}
                                            classNames={{
                                                base: "border-2 border-white/20 shadow-lg",
                                            }}
                                        />
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-base font-bold leading-none text-white flex items-center gap-2">
                                                {testimonial.name}
                                                {testimonial.verified && (
                                                    <CheckCircleIcon size={14} fill="#22c55e" />
                                                )}
                                            </h4>
                                            <h5 className="text-sm tracking-tight text-white/60">
                                                {testimonial.username}
                                            </h5>
                                        </div>
                                    </div>

                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        classNames={{
                                            base: "bg-white/5 border border-white/10",
                                            content: "text-white/60 font-bold text-xs",
                                        }}
                                    >
                                        {testimonial.role}
                                    </Chip>
                                </CardHeader>

                                <CardBody className="px-6 py-4 gap-4">
                                    {/* Rating */}
                                    <div className="flex gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                                        ))}
                                    </div>

                                    {/* Text */}
                                    <p className="text-white/80 leading-relaxed text-sm">
                                        "{testimonial.text}"
                                    </p>
                                </CardBody>

                                <CardFooter className="gap-3 border-t border-white/[0.08] pt-4">
                                    <p className="text-xs text-white/40 font-medium">
                                        {testimonial.date}
                                    </p>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}