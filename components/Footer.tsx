"use client";

import { Button, Input, Link, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { TwitterIcon } from "@/components/icons/TwitterIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import SpotlightButton from "@/components/ui/SpotlightButton";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = {
        marketplace: ["Valorant Accounts", "Steam Bundles", "Rare ID's", "Coaching"],
        support: ["Help Center", "Submit Ticket", "Report Scam", "System Status"],
        legal: ["Terms of Service", "Privacy Policy", "Refund Policy", "Licenses"],
    };

    const socials = [
        { icon: DiscordIcon, name: "Discord", color: "#5865F2" },
        { icon: TwitterIcon, name: "Twitter", color: "#1DA1F2" },
        { icon: InstagramIcon, name: "Instagram", color: "#E4405F" },
    ];

    return (
        <footer className="relative w-full bg-black pt-20 pb-10 overflow-hidden mt-32 border-t border-white/10">
            
            {/* --- THE CYBER DECK BACKGROUND --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* The Laser Horizon (Top Glow) */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-70 box-shadow-glow" />
                
                {/* The Perspective Grid Floor */}
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        maskImage: 'linear-gradient(to bottom, transparent, black 40%)'
                    }}
                />

                {/* Ambient Glows */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px]" />
                <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* --- MAIN ROW: CTA & BRAND --- */}
                <div className="flex flex-col lg:flex-row gap-16 mb-20">
                    
                    {/* Left: Brand Identity */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                                <span className="font-black text-black text-xl">K</span>
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                KXW <span className="text-white/40">x</span> KUZZ
                            </h2>
                        </div>
                        <p className="text-white/60 leading-relaxed">
                            The next-generation marketplace for digital assets. 
                            Built for speed, security, and the community.
                        </p>
                        
                        <div className="flex gap-3 pt-2">
                            {socials.map((social) => (
                                <motion.button
                                    key={social.name}
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-colors"
                                >
                                    <social.icon size={20} fill={social.color} />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Newsletter Card (Glass) */}
                    <div className="lg:w-2/3 flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl glass-tahoe border border-white/10 relative overflow-hidden group">
                        {/* Shine Effect on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                        
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">Stay in the loop</h3>
                            <p className="text-white/50 text-sm">
                                Join 15,000+ members getting daily drop alerts. No spam, just loot.
                            </p>
                        </div>
                        
                        <div className="flex w-full md:w-auto gap-2">
                            <Input 
                                placeholder="email@domain.com" 
                                classNames={{
                                    input: "text-white",
                                    inputWrapper: "bg-black/50 border border-white/10 hover:border-white/30"
                                }}
                                radius="full"
                                className="w-full md:w-64"
                            />
                            <Button className="bg-white text-black font-bold rounded-full px-6">
                                Join
                            </Button>
                        </div>
                    </div>
                </div>

                <Divider className="bg-white/10 mb-16" />

                {/* --- LINKS GRID (Interactive) --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
                    {Object.entries(footerSections).map(([title, links]) => (
                        <div key={title} className="group">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 opacity-50 group-hover:opacity-100 group-hover:text-brand-primary transition-all">
                                {title}
                            </h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link}>
                                        <Link 
                                            href="#" 
                                            className="text-white/60 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block duration-200"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Trust Badge Column */}
                    <div className="space-y-6">
                         <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 opacity-50">
                            Security
                        </h4>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <div>
                                <p className="text-white font-bold text-sm">Protected by</p>
                                <p className="text-white/40 text-xs">SSL Encryption</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM BAR --- */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-white/30">
                    <p>© {currentYear} KXW x KuzzBoost. All rights reserved.</p>
                    
                    {/* Giant subtle watermark behind bottom text */}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[150px] font-black text-white/[0.03] pointer-events-none select-none overflow-hidden leading-none -z-10">
                        KXW
                    </span>

                    <div className="flex gap-8 mt-4 md:mt-0 font-medium">
                        <Link href="#" className="text-white/30 hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="text-white/30 hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}