"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button } from "@heroui/react";

export default function SupportCard() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-2xl mx-auto mt-16"
        >
            <Card className="bg-black/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)] hover:border-white/[0.15] transition-all duration-500">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                <CardHeader className="justify-between gap-4 pb-0">
                    <div className="flex gap-4 items-center">
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Avatar
                                icon={<span className="text-4xl">😊</span>}
                                classNames={{
                                    base: "w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 shadow-lg",
                                }}
                            />
                        </motion.div>

                        <div className="flex flex-col gap-1">
                            <h4 className="text-xl font-black text-white">
                                I am with you in each step
                            </h4>
                            <h5 className="text-sm text-white/60 font-medium">
                                Your personal marketplace assistant
                            </h5>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="px-6 py-4 text-white/80">
                    <p className="leading-relaxed">
                        Alongside you for seamless experience. You can{" "}
                        <span className="font-bold text-white">Contact us</span> down below
                        for assistance at any time.
                    </p>
                </CardBody>

                <CardFooter className="gap-3 pt-0">
                    <Button
                        radius="full"
                        variant="bordered"
                        className="flex-1 border-white/20 text-white hover:bg-white/10 font-semibold transition-all"
                    >
                        View Marketplace
                    </Button>

                    <Button
                        radius="full"
                        className="flex-1 bg-gradient-to-r from-white to-gray-100 text-black font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        View Valorant
                    </Button>
                </CardFooter>
            </Card>
        </motion.section>
    );
}