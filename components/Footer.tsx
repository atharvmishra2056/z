"use client";

import { motion } from "framer-motion";
import { Button, Input, Link, Divider, Avatar } from "@heroui/react";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { TwitterIcon } from "@/components/icons/TwitterIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = {
        marketplace: ["Steam", "Valorant", "EA Games", "Epic Games"],
        company: ["About Us", "Contact", "FAQ", "Support"],
        legal: ["Terms", "Privacy", "Refund Policy"],
    };

    const socials = [
        { icon: DiscordIcon, name: "Discord", color: "#5865F2" },
        { icon: TwitterIcon, name: "Twitter", color: "#1DA1F2" },
        { icon: InstagramIcon, name: "Instagram", color: "#E4405F" },
    ];

    return (
        <footer className="w-full mt-32">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glassmorphism-heavy rounded-t-[3rem] border-t border-white/20 shadow-glass-inset overflow-hidden"
            >
                <div className="container mx-auto px-8 md:px-12 lg:px-16 py-16 max-w-[1400px]">
                    {/* Newsletter */}
                    <div className="glassmorphism rounded-3xl p-8 md:p-10 mb-16 border border-white/20">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h4 className="text-2xl md:text-3xl font-black text-white mb-2">
                                    Stay Updated
                                </h4>
                                <p className="text-white/60">
                                    Subscribe for exclusive deals and new accounts
                                </p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    variant="bordered"
                                    radius="full"
                                    classNames={{
                                        input: "text-white",
                                        inputWrapper:
                                            "glassmorphism border-white/20 hover:border-white/40",
                                    }}
                                    className="w-full md:w-64"
                                />
                                <Button
                                    radius="full"
                                    className="bg-gradient-to-r from-white to-gray-100 text-black font-bold px-8"
                                >
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Footer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                        {/* Brand */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar
                                    icon={<span className="text-sm font-black">LOGO</span>}
                                    classNames={{
                                        base: "w-16 h-16 bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30",
                                    }}
                                />
                                <h3 className="text-3xl font-black gradient-text">
                                    KXW x KuzzBoost
                                </h3>
                            </div>

                            <p className="text-white/60 leading-relaxed max-w-md">
                                The premium marketplace for gamers, tech enthusiasts, and
                                content creators. Trusted by thousands worldwide.
                            </p>

                            <div className="flex gap-3">
                                {socials.map((social) => (
                                    <Button
                                        key={social.name}
                                        isIconOnly
                                        radius="lg"
                                        variant="flat"
                                        className="glassmorphism border border-white/20 hover:border-white/40 transition-all"
                                        aria-label={social.name}
                                    >
                                        <social.icon fill={social.color} size={20} />
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        {Object.entries(footerSections).map(([title, links]) => (
                            <div key={title} className="space-y-4">
                                <h4 className="text-lg font-bold text-white capitalize mb-6">
                                    {title}
                                </h4>
                                <ul className="space-y-3">
                                    {links.map((link) => (
                                        <li key={link}>
                                            <Link
                                                href="#"
                                                className="text-white/60 hover:text-white transition-colors text-sm font-medium"
                                            >
                                                {link}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <Divider className="bg-white/10 mb-8" />

                    {/* Bottom */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
                        <p>© {currentYear} KXW x KuzzBoost. All rights reserved.</p>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>All systems operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}