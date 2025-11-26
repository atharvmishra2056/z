"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@heroui/react";
import { UserIcon } from "@/components/icons/UserIcon";
import { CartIcon } from "@/components/icons/CartIcon";
import { ZapIcon } from "@/components/icons/ZapIcon";

const STEPS = [
    {
        id: 1,
        title: "Select Account",
        desc: "Browse our verified inventory of 5000+ premium accounts.",
        icon: <UserIcon size={32} className="text-white" />,
    },
    {
        id: 2,
        title: "Secure Payment",
        desc: "Checkout instantly with our protected escrow system.",
        icon: <CartIcon size={32} className="text-white" />,
    },
    {
        id: 3,
        title: "Instant Delivery",
        desc: "Credentials sent to your email immediately after confirmation.",
        icon: <ZapIcon size={32} className="text-white" />,
    },
];

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 80%", "end 50%"], // Triggers animation as section enters view
    });

    const beamProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
    
    return (
        <section ref={containerRef} className="relative py-32 overflow-hidden">
            
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-primary/5 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                        Process <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Initiated</span>
                    </h2>
                    <p className="text-white/40 text-lg">
                        Three steps to total domination.
                    </p>
                </div>

                {/* --- CIRCUIT DIAGRAM (Desktop) --- */}
                <div className="relative hidden md:flex justify-between items-start gap-8">
                    
                    {/* The Beam Track (Background) */}
                    <div className="absolute top-12 left-0 w-full h-1 bg-white/5 rounded-full overflow-hidden" />

                    {/* The Active Beam (Fills up based on scroll) */}
                    <div className="absolute top-12 left-0 w-full h-1 rounded-full overflow-hidden">
                        <motion.div 
                            style={{ scaleX: beamProgress, transformOrigin: "left" }}
                            className="h-full w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-success shadow-[0_0_10px_#7c3aed]"
                        />
                    </div>

                    {STEPS.map((step, idx) => (
                        <div key={step.id} className="relative flex flex-col items-center text-center flex-1 group">
                            
                            {/* Icon Node */}
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: idx * 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="relative z-10 mb-8"
                            >
                                {/* Glowing Backing */}
                                <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="w-24 h-24 rounded-full glass-tahoe border-white/20 flex items-center justify-center relative overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center font-black text-xs">
                                    0{step.id}
                                </div>
                            </motion.div>

                            <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-white/40 text-sm px-8">{step.desc}</p>
                        </div>
                    ))}
                </div>

                {/* --- MOBILE VERTICAL LIST --- */}
                <div className="md:hidden space-y-12 relative pl-8">
                    {/* Vertical Line */}
                    <div className="absolute left-12 top-0 bottom-0 w-px bg-white/10" />
                    
                    {STEPS.map((step) => (
                        <div key={step.id} className="relative z-10 flex flex-col items-start pl-12">
                            <div className="absolute left-0 top-0 w-24 h-24 -ml-12 rounded-full glass-tahoe border-white/20 flex items-center justify-center shadow-xl">
                                {step.icon}
                                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center font-bold text-[10px]">
                                    {step.id}
                                </div>
                            </div>
                            <div className="mt-24 pt-4">
                                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-white/40 text-sm">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-24 flex justify-center">
                    <Button 
                        size="lg" 
                        radius="full"
                        className="bg-white text-black font-bold px-12 py-8 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
                    >
                        Start Transaction
                    </Button>
                </div>

            </div>
        </section>
    );
}