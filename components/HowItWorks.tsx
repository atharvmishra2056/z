"use client";

import { motion } from "framer-motion";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { CartIcon } from "@/components/icons/CartIcon";
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon";

const steps = [
    {
        number: "01",
        title: "Explore",
        description: "Start by exploring our marketplace, about what all we have to offer you. Continue if you like the available accounts.",
        icon: SearchIcon,
        iconColor: "#3b82f6",
        borderColor: "#3b82f6",
    },
    {
        number: "02",
        title: "Sign In / Sign Up",
        description: "Sign In or Sign Up on our website to create / login to your account, to be able to place orders.",
        icon: UserIcon,
        iconColor: "#a855f7",
        borderColor: "#a855f7",
    },
    {
        number: "03",
        title: "Place an Order",
        description: "Quickly Place an order by checking out, paying using the payment methods, and relax.",
        icon: CartIcon,
        iconColor: "#f59e0b",
        borderColor: "#f59e0b",
    },
    {
        number: "04",
        title: "Hand Over",
        description: "You instantly receive the details of the accounts as required. All details will be provided.",
        icon: CheckCircleIcon,
        iconColor: "#22c55e",
        borderColor: "#22c55e",
    },
];

export default function HowItWorks() {
    return (
        <section className="w-full py-20">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-16"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text"
                    >
                        How It Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white/60 font-medium"
                    >
                        Your journey from browsing to owning in 4 simple steps
                    </motion.p>
                </div>

                {/* Steps with Rotating Border */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative"
                        >
                            {/* Rotating Border Container */}
                            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)] transition-shadow duration-500">
                                {/* Rotating Gradient Border */}
                                <div
                                    className="absolute inset-[-2px] animate-spin-slow"
                                    style={{
                                        background: `conic-gradient(from 0deg, transparent 0deg, transparent 340deg, ${step.borderColor} 360deg)`,
                                        animationDuration: '5s',
                                    }}
                                />

                                {/* Inner Card */}
                                <div className="relative bg-black rounded-[2rem] p-8 m-[2px] h-full backdrop-blur-xl">
                                    {/* Subtle inner gradient */}
                                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                                    <div className="relative space-y-6">
                                        {/* Background Number */}
                                        <div className="absolute top-0 right-0 text-7xl font-black text-white/[0.03]">
                                            {step.number}
                                        </div>

                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/[0.08] shadow-lg backdrop-blur-sm"
                                        >
                                            <step.icon fill={step.iconColor} size={32} />
                                        </motion.div>

                                        {/* Content */}
                                        <div className="space-y-3">
                                            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                                <span className="text-white/60 font-bold text-xs">STEP {step.number}</span>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-black text-white">
                                                {step.title}
                                            </h3>

                                            <p className="text-sm text-white/70 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}