"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem, Avatar } from "@heroui/react";

const faqs = [
    {
        question: "How do I purchase an account?",
        answer: "Simple! Sign up, browse accounts, select your preferred one, and checkout via your preferred payment method. You'll receive instant access to account details.",
    },
    {
        question: "Is delivery instant?",
        answer: "Yes, all account details are handed over instantly upon successful payment confirmation. You'll receive an email with complete login credentials and instructions.",
    },
    {
        question: "Can I get support if needed?",
        answer: "Absolutely! Our support team is always available via the Contact page. We typically respond within 1-2 hours and are committed to resolving any issues.",
    },
    {
        question: "Are the accounts safe and verified?",
        answer: "All accounts on our marketplace are thoroughly verified and safe. We guarantee authenticity and provide a 30-day replacement warranty for any issues.",
    },
];

export default function FAQSection() {
    return (
        <section className="w-full py-20">
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
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white/60 font-medium"
                    >
                        Everything you need to know about our service
                    </motion.p>
                </div>

                {/* FAQ Container with Rotating Border */}
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        {/* Rotating Gradient Border */}
                        <div
                            className="absolute inset-[-2px] animate-spin-slow pointer-events-none"
                            style={{
                                background: 'conic-gradient(from 0deg, transparent 0deg, transparent 340deg, #ffffff 360deg)',
                                animationDuration: '5s',
                            }}
                        />

                        {/* Inner Content - NO BLACK BACKGROUND BLOCKING */}
                        <div className="relative bg-black/80 backdrop-blur-xl rounded-[2.5rem] m-[2px] p-8 md:p-12">
                            {/* Subtle inner glow */}
                            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                            <div className="relative flex flex-col lg:flex-row gap-8">
                                {/* Left - Icon */}
                                <div className="flex-shrink-0">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                    >
                                        <Avatar
                                            icon={<span className="text-6xl">💬</span>}
                                            classNames={{
                                                base: "w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 shadow-lg",
                                            }}
                                        />
                                    </motion.div>
                                </div>

                                {/* Right - Accordion */}
                                <div className="flex-1">
                                    <Accordion
                                        variant="splitted"
                                        defaultExpandedKeys={["0"]}
                                        className="gap-4"
                                    >
                                        {faqs.map((faq, index) => (
                                            <AccordionItem
                                                key={index}
                                                aria-label={faq.question}
                                                title={faq.question}
                                                classNames={{
                                                    base: "bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl hover:border-white/[0.15] hover:bg-white/[0.05] transition-all",
                                                    title: "font-bold text-base md:text-lg text-white",
                                                    trigger: "py-5 px-6",
                                                    content: "px-6 pb-6 text-white/70 text-sm md:text-base leading-relaxed",
                                                }}
                                            >
                                                {faq.answer}
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}