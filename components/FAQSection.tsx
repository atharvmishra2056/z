"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { motion } from "framer-motion";

const FAQS = [
    {
        id: "1",
        question: "Is the account delivery instant?",
        answer: "Yes. Our automated system processes your payment and emails your credentials within 60 seconds. You can also access them instantly in your user dashboard."
    },
    {
        id: "2",
        question: "Are these accounts safe from bans?",
        answer: "Absolutely. We only source from verified original owners. Every account goes through a 30-day cool-down period and rigorous background check before listing."
    },
    {
        id: "3",
        question: "What if I lose access to the account?",
        answer: "All purchases include Lifetime Warranty. If an account is recovered by the original owner, we provide a full replacement or refund instantly."
    },
    {
        id: "4",
        question: "Can I change the email and password?",
        answer: "Yes. You receive full access (FA). You can change the email, password, and security questions immediately after purchase."
    }
];

export default function FAQSection() {
    return (
        <section className="relative py-32 pb-48">
            <div className="container mx-auto px-4 max-w-4xl">
                
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white mb-4">
                        System <span className="text-white/30">Knowledge Base</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    <Accordion 
                        variant="splitted"
                        itemClasses={{
                            base: "group mb-4 !bg-transparent !shadow-none px-0",
                            title: "text-white font-bold text-lg",
                            trigger: "glass-tahoe px-6 py-4 rounded-2xl border-white/10 data-[hover=true]:bg-white/5 transition-all",
                            content: "text-white/60 px-6 pb-6 pt-2",
                            indicator: "text-white",
                        }}
                    >
                        {FAQS.map((faq) => (
                            <AccordionItem 
                                key={faq.id} 
                                aria-label={faq.question} 
                                title={faq.question}
                            >
                                {faq.answer}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Support Teaser */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-12 text-center p-8 glass-tahoe rounded-3xl border-white/10"
                >
                    <p className="text-white/50 mb-4">Can't find what you're looking for?</p>
                    <a href="#contact" className="text-brand-primary font-bold hover:text-white transition-colors border-b border-brand-primary/30 hover:border-white pb-1">
                        Connect with Live Support Agent →
                    </a>
                </motion.div>

            </div>
        </section>
    );
}