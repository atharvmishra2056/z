"use client";

import { Button, Chip, Spinner } from "@heroui/react";
import { 
    ShieldCheck, Zap, Clock, User, Trophy, Globe, Box, Wallet,
    Crown, Mail, Phone, Calendar, Sword, Palette, Users,
    Gamepad2, Coins, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

// Game colors
const GAME_COLORS: Record<string, string> = {
    valorant: "#ff4655",
    steam: "#1b2838",
    fortnite: "#9d4dbb",
    minecraft: "#62b47a",
    "clash-of-clans": "#f5a623",
    "epic-games": "#0078f2",
    battlenet: "#00aeff",
};

// Valorant rank names
const VALORANT_RANKS: Record<number, string> = {
    0: 'Unranked', 1: 'Iron 1', 2: 'Iron 2', 3: 'Iron 3',
    4: 'Bronze 1', 5: 'Bronze 2', 6: 'Bronze 3',
    7: 'Silver 1', 8: 'Silver 2', 9: 'Silver 3',
    10: 'Gold 1', 11: 'Gold 2', 12: 'Gold 3',
    13: 'Platinum 1', 14: 'Platinum 2', 15: 'Platinum 3',
    16: 'Diamond 1', 17: 'Diamond 2', 18: 'Diamond 3',
    19: 'Ascendant 1', 20: 'Ascendant 2', 21: 'Ascendant 3',
    22: 'Immortal 1', 23: 'Immortal 2', 24: 'Immortal 3',
    25: 'Radiant'
};

interface ItemDetailViewProps {
    item: any | null;
    loading: boolean;
    error: string | null;
    onPurchase?: () => void;
    onRetry?: () => void;
}

// Format timestamp to date
const formatDate = (timestamp?: number): string => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export default function ItemDetailView({ item, loading, error, onPurchase, onRetry }: ItemDetailViewProps) {
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                <Spinner size="lg" color="white" />
                <p className="text-white/50 font-mono text-sm animate-pulse">LOADING ASSET DATA...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 gap-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="font-mono font-bold">ERROR: {error}</p>
                </div>
                <Button onClick={onRetry} variant="flat" className="bg-white/10 text-white">
                    RETRY
                </Button>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-white/50 font-mono">
                ITEM NOT FOUND
            </div>
        );
    }

    // Determine game type
    const categoryId = item.category_id;
    const isValorant = categoryId === 13;
    const isSteam = categoryId === 1;
    const isFortnite = categoryId === 9;
    
    const getSlug = (id: number) => {
        const slugMap: Record<number, string> = {
            1: "steam", 4: "warface", 9: "fortnite", 11: "battlenet",
            12: "epic-games", 13: "valorant", 15: "clash-of-clans", 28: "minecraft"
        };
        return slugMap[id] || "valorant";
    };

    const gameSlug = getSlug(categoryId);
    const accentColor = GAME_COLORS[gameSlug] || "#22c55e";
    
    // Use English title/description if available
    const displayTitle = item.title_en || item.title || 'Game Account';
    const displayDesc = item.descriptionEnPlain || item.description_en || item.descriptionPlain || item.description || '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto mt-8"
        >
            {/* Breadcrumb / Header */}
            <div className="mb-8 flex items-center gap-2 text-sm font-mono text-white/40">
                <span>MARKET</span>
                <span>/</span>
                <span className="uppercase text-white/60">{gameSlug}</span>
                <span>/</span>
                <span className="text-brand-primary">ASSET_{item.item_id}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: VISUAL INTEL (Images) */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 group">
                        {/* Main Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('/placeholders/${gameSlug}.jpg')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Overlay UI */}
                        <div className="absolute top-4 left-4">
                            <Chip size="sm" className="bg-brand-primary/20 border border-brand-primary/50 text-brand-primary font-mono">
                                LIVE PREVIEW
                            </Chip>
                        </div>

                        {/* Scanning Effect */}
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/50 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-scan pointer-events-none" />
                    </div>

                    {/* Thumbnails (Placeholders) */}
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-video bg-white/5 rounded-xl border border-white/10 hover:border-white/30 cursor-pointer transition-colors" />
                        ))}
                    </div>
                </div>

                {/* RIGHT: ASSET DATA (Dossier) */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Header Block */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/10" style={{ borderColor: `${accentColor}20` }}>
                        <h1 className="text-2xl font-black text-white mb-2 leading-tight">
                            {displayTitle}
                        </h1>
                        <div className="flex items-end justify-between mt-6">
                            <div>
                                <p className="text-white/40 text-xs font-mono mb-1">PRICE</p>
                                <p className="text-4xl font-mono font-bold tracking-tighter" style={{ color: accentColor }}>
                                    ${(item.display_price || item.price || 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Chip size="sm" variant="flat" className="bg-green-500/10 text-green-400 font-bold">
                                    <CheckCircle size={12} className="mr-1" /> INSTANT
                                </Chip>
                                {item.riot_email_verified && (
                                    <Chip size="sm" variant="flat" className="bg-blue-500/10 text-blue-400">
                                        <Mail size={12} className="mr-1" /> EMAIL
                                    </Chip>
                                )}
                                {item.riot_phone_verified && (
                                    <Chip size="sm" variant="flat" className="bg-purple-500/10 text-purple-400">
                                        <Phone size={12} className="mr-1" /> PHONE
                                    </Chip>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Module */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            size="lg"
                            className="flex-1 sm:flex-none bg-brand-primary text-black font-black px-8 shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)] hover:scale-105 transition-transform"
                            startContent={<Zap fill="currentColor" />}
                            onClick={onPurchase}
                        >
                            Purchase Asset
                        </Button>
                        <Button
                            size="lg"
                            variant="bordered"
                            className="border-white/20 text-white font-bold hover:bg-white/5"
                        >
                            CONTACT SELLER
                        </Button>
                    </div>

                    {/* Seller Intel */}
                    {item.seller && (
                        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-blue-500 flex items-center justify-center text-black font-bold text-xl">
                                {item.seller.username[0]}
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-bold">{item.seller.username}</p>
                                <div className="flex items-center gap-2 text-xs text-white/50">
                                    <ShieldCheck size={12} className="text-brand-primary" />
                                    <span>TRUSTED SELLER</span>
                                    <span>•</span>
                                    <span>{item.seller.solditemscount} Sales</span>
                                </div>
                            </div>
                            <Button size="sm" variant="light" className="text-white/60">
                                View Profile
                            </Button>
                        </div>
                    )}

                    {/* Game-Specific Stats Grid */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest pl-1" style={{ color: accentColor }}>
                            {gameSlug.toUpperCase()} Details
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Valorant Stats */}
                            {isValorant && (
                                <>
                                    <StatBox 
                                        label="Rank" 
                                        value={item.valorantRankTitle || VALORANT_RANKS[item.riot_valorant_rank] || 'Unranked'} 
                                        icon={<Crown size={14} />} 
                                        color="#ff4655"
                                    />
                                    <StatBox 
                                        label="Region" 
                                        value={item.valorantRegionPhrase || item.riot_valorant_region?.toUpperCase() || 'N/A'} 
                                        icon={<Globe size={14} />} 
                                    />
                                    <StatBox 
                                        label="Level" 
                                        value={item.riot_valorant_level?.toString() || '?'} 
                                        icon={<Trophy size={14} />} 
                                    />
                                    <StatBox 
                                        label="Skins" 
                                        value={item.riot_valorant_skin_count?.toString() || '0'} 
                                        icon={<Palette size={14} />} 
                                        color="#9d4dbb"
                                    />
                                    <StatBox 
                                        label="Agents" 
                                        value={item.riot_valorant_agent_count?.toString() || '0'} 
                                        icon={<Users size={14} />} 
                                        color="#22c55e"
                                    />
                                    <StatBox 
                                        label="Knives" 
                                        value={item.riot_valorant_knife?.toString() || '0'} 
                                        icon={<Sword size={14} />} 
                                        color="#f59e0b"
                                    />
                                    <StatBox 
                                        label="VP Balance" 
                                        value={item.riot_valorant_wallet_vp?.toString() || '0'} 
                                        icon={<Coins size={14} />} 
                                        color="#3b82f6"
                                    />
                                    <StatBox 
                                        label="Inventory Value" 
                                        value={`~$${item.riot_valorant_inventory_value || 0}`} 
                                        icon={<Wallet size={14} />} 
                                    />
                                </>
                            )}
                            
                            {/* Fortnite Stats */}
                            {isFortnite && (
                                <>
                                    <StatBox 
                                        label="Level" 
                                        value={item.fortnite_level?.toString() || '?'} 
                                        icon={<Trophy size={14} />} 
                                        color="#9d4dbb"
                                    />
                                    <StatBox 
                                        label="V-Bucks" 
                                        value={item.fortnite_balance?.toString() || '0'} 
                                        icon={<Coins size={14} />} 
                                        color="#f59e0b"
                                    />
                                    <StatBox 
                                        label="Skins" 
                                        value={item.fortnite_skin_count?.toString() || '0'} 
                                        icon={<Palette size={14} />} 
                                    />
                                    <StatBox 
                                        label="Wins" 
                                        value={item.fortnite_lifetime_wins?.toString() || '0'} 
                                        icon={<Crown size={14} />} 
                                        color="#22c55e"
                                    />
                                    <StatBox 
                                        label="Battle Passes" 
                                        value={item.fortnite_books_purchased?.toString() || '0'} 
                                        icon={<ShieldCheck size={14} />} 
                                    />
                                    <StatBox 
                                        label="Platform" 
                                        value={item.fortnite_platform || 'Unknown'} 
                                        icon={<Gamepad2 size={14} />} 
                                    />
                                </>
                            )}
                            
                            {/* Steam Stats */}
                            {isSteam && (
                                <>
                                    <StatBox 
                                        label="Level" 
                                        value={item.steam_level?.toString() || '?'} 
                                        icon={<Trophy size={14} />} 
                                        color="#1b2838"
                                    />
                                    <StatBox 
                                        label="Games" 
                                        value={item.steam_games_count?.toString() || '0'} 
                                        icon={<Gamepad2 size={14} />} 
                                    />
                                    <StatBox 
                                        label="Hours" 
                                        value={item.steam_hours?.toString() || '0'} 
                                        icon={<Clock size={14} />} 
                                    />
                                    <StatBox 
                                        label="Balance" 
                                        value={`$${item.steam_balance || 0}`} 
                                        icon={<Wallet size={14} />} 
                                        color="#22c55e"
                                    />
                                </>
                            )}
                            
                            {/* Fallback for other games */}
                            {!isValorant && !isFortnite && !isSteam && (
                                <>
                                    <StatBox label="Category" value={gameSlug.toUpperCase()} icon={<Gamepad2 size={14} />} />
                                    <StatBox label="Type" value={item.email_type || 'Standard'} icon={<ShieldCheck size={14} />} />
                                    <StatBox label="Last Activity" value={formatDate(item.account_last_activity)} icon={<Clock size={14} />} />
                                    <StatBox label="Views" value={item.view_count?.toString() || '0'} icon={<User size={14} />} />
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Account Information */}
                    <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-3">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Reliable Information</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-white/40" />
                                <span className="text-white/60">Last Activity:</span>
                                <span className="text-white">{formatDate(item.account_last_activity || item.riot_last_activity)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.riot_email_verified || item.email_type === 'native' ? (
                                    <CheckCircle size={14} className="text-green-400" />
                                ) : (
                                    <XCircle size={14} className="text-red-400" />
                                )}
                                <span className="text-white/60">Email:</span>
                                <span className="text-white">{item.riot_email_verified ? 'Verified' : item.email_type || 'Not linked'}</span>
                            </div>
                            {item.riot_country && (
                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-white/40" />
                                    <span className="text-white/60">Country:</span>
                                    <span className="text-white">{item.riot_country}</span>
                                </div>
                            )}
                            {item.email_provider && (
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-white/40" />
                                    <span className="text-white/60">Email Provider:</span>
                                    <span className="text-white">{item.email_provider}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/5">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Description</h3>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                            {displayDesc || "No additional information provided for this account."}
                        </p>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}

function StatBox({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color?: string }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors">
            <div style={{ color: color || 'rgba(255,255,255,0.4)' }}>{icon}</div>
            <div>
                <p className="text-[10px] text-white/40 uppercase font-mono">{label}</p>
                <p className="text-sm font-bold font-mono truncate" style={{ color: color || 'white' }}>{value}</p>
            </div>
        </div>
    );
}