"use client";

import InfiniteMarquee from "@/components/ui/InfiniteMarquee";
import { Avatar, Chip } from "@heroui/react";
import { DiscordIcon } from "@/components/icons/DiscordIcon"; // Ensure you have this icon or remove if not

const REVIEWS = [
    {
        id: 1,
        name: "Alex 'Kade' R.",
        role: "Radiant Player",
        content: "Bought a stacked Valorant acc. Instant delivery, no BS. This is the only legit marketplace left.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        tag: "Verified Purchase"
    },
    {
        id: 2,
        name: "SarahJenkins",
        role: "Streamer (25k)",
        content: "Needed a Smurf for my stream marathon. Got it in 2 mins. The support team is cracked.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        tag: "VIP"
    },
    {
        id: 3,
        name: "Ghost_Rider",
        role: "Collector",
        content: "The inventory was exactly as described. Rare skins were all there. 10/10 recommended.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
        tag: "Verified"
    },
    {
        id: 4,
        name: "PixelMage",
        role: "Developer",
        content: "Clean UI, fast transactions. Finally a site that doesn't feel like a scam from 2005.",
        rating: 4,
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c",
        tag: "Verified"
    },
    {
        id: 5,
        name: "NoobMaster69",
        role: "Gamer",
        content: "Cheapest prices I found for a Steam account with these many games. Insane value.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        tag: "Verified"
    },
];

const ReviewCard = ({ review }: { review: typeof REVIEWS[0] }) => (
    <div className="w-[350px] md:w-[450px] shrink-0 p-6 glass-tahoe rounded-3xl border-white/5 hover:border-white/20 hover:bg-white/5 transition-all group">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3 items-center">
                <Avatar src={review.avatar} isBordered className="w-10 h-10" />
                <div>
                    <h4 className="font-bold text-white text-sm">{review.name}</h4>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-bold">{review.role}</p>
                </div>
            </div>
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < review.rating ? "text-brand-primary" : "text-white/10"}`}>★</span>
                ))}
            </div>
        </div>
        
        {/* Content */}
        <p className="text-white/80 text-sm leading-relaxed mb-6">
            "{review.content}"
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-white/10 pt-4">
            <Chip size="sm" variant="flat" classNames={{ base: "bg-white/5", content: "text-white/40 text-[10px] font-bold" }}>
                {review.tag}
            </Chip>
            <DiscordIcon size={16} className="text-white/20 group-hover:text-[#5865F2] transition-colors" />
        </div>
    </div>
);

export default function Testimonials() {
    return (
        <section className="relative py-32 overflow-hidden">
             {/* Section Title */}
             <div className="container mx-auto px-4 mb-16 text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
                    Trusted by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Elite</span>
                </h2>
                <p className="text-white/40 max-w-2xl mx-auto">
                    Join 50,000+ gamers who trust KXW for their digital assets.
                </p>
            </div>

            {/* The Void Stream Container (Tilt Effect) */}
            <div 
                className="relative w-full transform -rotate-3 skew-x-[-3deg] scale-110 py-10"
            >
                {/* Left Fade Mask */}
                <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 z-20 bg-gradient-to-r from-void to-transparent pointer-events-none" />
                
                {/* Right Fade Mask */}
                <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 z-20 bg-gradient-to-l from-void to-transparent pointer-events-none" />

                {/* Top Row - Moving Left */}
                <div className="mb-8 opacity-80 hover:opacity-100 transition-opacity duration-500">
                    <InfiniteMarquee speed={50} direction="left">
                        {REVIEWS.map((review) => (
                            <ReviewCard key={`t-${review.id}`} review={review} />
                        ))}
                    </InfiniteMarquee>
                </div>

                {/* Bottom Row - Moving Right */}
                <div className="opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <InfiniteMarquee speed={40} direction="right">
                        {REVIEWS.map((review) => (
                            <ReviewCard key={`b-${review.id}`} review={review} />
                        ))}
                    </InfiniteMarquee>
                </div>
            </div>
        </section>
    );
}