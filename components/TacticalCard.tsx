"use client";

import { motion } from "framer-motion";
import { Button, Chip } from "@heroui/react";
import { 
    Eye, ShieldCheck, Trophy, Globe, Coins, Gamepad2, 
    Sword, Clock, Mail, Phone, Sparkles, Crown,
    Crosshair, Users, Palette
} from "lucide-react";
import Link from "next/link";

// Game colors for accents
const GAME_COLORS: Record<string, string> = {
    valorant: "#ff4655",
    steam: "#1b2838",
    fortnite: "#9d4dbb",
    minecraft: "#62b47a",
    "clash-of-clans": "#f5a623",
    "epic-games": "#000000",
    battlenet: "#00aeff",
    warface: "#ff6600",
};

// Valorant rank names
const VALORANT_RANKS: Record<number, string> = {
    0: 'Unranked', 3: 'Iron', 6: 'Bronze', 9: 'Silver',
    12: 'Gold', 15: 'Platinum', 18: 'Diamond',
    21: 'Ascendant', 24: 'Immortal', 25: 'Radiant'
};

const getRankName = (rank?: number): string => {
    if (!rank) return 'Unranked';
    // Find the tier
    for (let i = 25; i >= 0; i -= 3) {
        if (rank >= i) return VALORANT_RANKS[i] || 'Unknown';
    }
    return 'Unranked';
};

// Format time ago
const timeAgo = (timestamp?: number): string => {
    if (!timestamp) return 'Unknown';
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
};

interface TacticalCardProps {
    item: any;
    gameSlug: string;
}

export default function TacticalCard({ item, gameSlug }: TacticalCardProps) {
    const accentColor = GAME_COLORS[gameSlug] || "#22c55e";
    const categoryId = item.category_id;

    // Determine game type from category_id
    const isValorant = categoryId === 13;
    const isSteam = categoryId === 1;
    const isFortnite = categoryId === 9;
    const isMinecraft = categoryId === 28;
    const isSupercell = categoryId === 15;
    const isEpic = categoryId === 12;
    const isBattlenet = categoryId === 11;

    // Use English title if available
    const displayTitle = item.title_en || item.title || 'Game Account';

    // Get appropriate stats based on game
    const getGameStats = () => {
        if (isValorant) {
            return {
                stat1: { 
                    icon: <Crown size={12} />, 
                    label: item.valorantRankTitle || getRankName(item.riot_valorant_rank),
                    color: "text-red-400"
                },
                stat2: { 
                    icon: <Globe size={12} />, 
                    label: item.valorantRegionPhrase || item.riot_valorant_region?.toUpperCase() || 'N/A',
                    color: "text-blue-400"
                },
                stat3: { 
                    icon: <Palette size={12} />, 
                    label: `${item.riot_valorant_skin_count || 0} Skins`,
                    color: "text-purple-400"
                },
                stat4: { 
                    icon: <Users size={12} />, 
                    label: `${item.riot_valorant_agent_count || 0} Agents`,
                    color: "text-green-400"
                },
                extra: item.riot_valorant_knife ? `${item.riot_valorant_knife} Knives` : null,
                currency: item.riot_valorant_wallet_vp ? `${item.riot_valorant_wallet_vp} VP` : null,
                level: item.riot_valorant_level ? `Lvl ${item.riot_valorant_level}` : null,
            };
        }
        
        if (isFortnite) {
            return {
                stat1: { 
                    icon: <Crown size={12} />, 
                    label: `Lvl ${item.fortnite_level || '?'}`,
                    color: "text-purple-400"
                },
                stat2: { 
                    icon: <Coins size={12} />, 
                    label: `${item.fortnite_balance || 0} V-Bucks`,
                    color: "text-yellow-400"
                },
                stat3: { 
                    icon: <Palette size={12} />, 
                    label: `${item.fortnite_skin_count || 0} Skins`,
                    color: "text-pink-400"
                },
                stat4: { 
                    icon: <Trophy size={12} />, 
                    label: `${item.fortnite_lifetime_wins || 0} Wins`,
                    color: "text-green-400"
                },
                extra: item.fortnite_books_purchased ? `${item.fortnite_books_purchased} BP` : null,
                currency: null,
                level: null,
            };
        }
        
        if (isSteam) {
            return {
                stat1: { 
                    icon: <Crown size={12} />, 
                    label: `Lvl ${item.steam_level || '?'}`,
                    color: "text-blue-400"
                },
                stat2: { 
                    icon: <Gamepad2 size={12} />, 
                    label: `${item.steam_games_count || 0} Games`,
                    color: "text-cyan-400"
                },
                stat3: { 
                    icon: <Clock size={12} />, 
                    label: `${item.steam_hours || 0}h Played`,
                    color: "text-orange-400"
                },
                stat4: { 
                    icon: <Coins size={12} />, 
                    label: `$${item.steam_balance || 0}`,
                    color: "text-green-400"
                },
                extra: item.cs2_prime ? 'CS2 Prime' : null,
                currency: null,
                level: null,
            };
        }

        // Default for other games
        return {
            stat1: { icon: <Trophy size={12} />, label: 'Account', color: "text-white/60" },
            stat2: { icon: <Globe size={12} />, label: 'Available', color: "text-white/60" },
            stat3: { icon: <ShieldCheck size={12} />, label: 'Verified', color: "text-green-400" },
            stat4: { icon: <Clock size={12} />, label: timeAgo(item.account_last_activity), color: "text-white/40" },
            extra: null,
            currency: null,
            level: null,
        };
    };

    const stats = getGameStats();

    // Badges
    const hasEmail = item.email_type === 'native' || item.riot_email_verified;
    const hasPhone = item.riot_phone_verified;
    const isNew = item.published_date && (Date.now() / 1000 - item.published_date) < 86400;

    return (
        <Link href={`/item/${item.item_id}`} className="block">
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative bg-black/40 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)]"
                style={{ '--accent': accentColor } as any}
            >
                {/* Header with game color accent */}
                <div 
                    className="h-1 w-full"
                    style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
                />

                {/* Main Content */}
                <div className="p-4 space-y-3">
                    {/* Top Row: Price + Badges */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <span 
                                className="text-xl font-black font-mono"
                                style={{ color: accentColor }}
                            >
                                ${(item.display_price || item.price || 0).toFixed(2)}
                            </span>
                            {item.original_price && item.original_price !== item.display_price && (
                                <span className="text-xs text-white/30 line-through">
                                    ${item.original_price.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-1">
                            {isNew && (
                                <Chip size="sm" className="bg-green-500/20 text-green-400 text-[10px] h-5">
                                    NEW
                                </Chip>
                            )}
                            {item.is_sticky && (
                                <Chip size="sm" className="bg-yellow-500/20 text-yellow-400 text-[10px] h-5">
                                    <Sparkles size={10} />
                                </Chip>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 
                        className="text-white font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]" 
                        title={displayTitle}
                    >
                        {displayTitle}
                    </h3>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className={`bg-white/5 rounded-lg px-2 py-1.5 flex items-center gap-2 ${stats.stat1.color}`}>
                            {stats.stat1.icon}
                            <span className="text-[11px] font-medium truncate">{stats.stat1.label}</span>
                        </div>
                        <div className={`bg-white/5 rounded-lg px-2 py-1.5 flex items-center gap-2 ${stats.stat2.color}`}>
                            {stats.stat2.icon}
                            <span className="text-[11px] font-medium truncate">{stats.stat2.label}</span>
                        </div>
                        <div className={`bg-white/5 rounded-lg px-2 py-1.5 flex items-center gap-2 ${stats.stat3.color}`}>
                            {stats.stat3.icon}
                            <span className="text-[11px] font-medium truncate">{stats.stat3.label}</span>
                        </div>
                        <div className={`bg-white/5 rounded-lg px-2 py-1.5 flex items-center gap-2 ${stats.stat4.color}`}>
                            {stats.stat4.icon}
                            <span className="text-[11px] font-medium truncate">{stats.stat4.label}</span>
                        </div>
                    </div>

                    {/* Extra Info Row */}
                    {(stats.extra || stats.currency || stats.level || hasEmail || hasPhone) && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {stats.level && (
                                <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded">
                                    {stats.level}
                                </span>
                            )}
                            {stats.currency && (
                                <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                                    {stats.currency}
                                </span>
                            )}
                            {stats.extra && (
                                <span className="text-[10px] text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
                                    {stats.extra}
                                </span>
                            )}
                            {hasEmail && (
                                <span className="text-[10px] text-green-400 flex items-center gap-1">
                                    <Mail size={10} /> Email
                                </span>
                            )}
                            {hasPhone && (
                                <span className="text-[10px] text-blue-400 flex items-center gap-1">
                                    <Phone size={10} /> Phone
                                </span>
                            )}
                        </div>
                    )}

                    {/* Bottom: Activity + View Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                            <Clock size={10} />
                            {timeAgo(item.account_last_activity || item.refreshed_date)}
                        </span>
                        <Button
                            size="sm"
                            className="h-7 px-3 text-[11px] font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10"
                            startContent={<Eye size={12} />}
                        >
                            VIEW
                        </Button>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
