/**
 * LZT Market API Type Definitions
 * Based on z.json OpenAPI 3.1.0 specification v1.1.72
 * 
 * Category IDs:
 * 1 = Steam, 4 = Warface, 9 = Fortnite, 11 = Battle.net
 * 12 = Epic Games, 13 = Valorant/Riot, 15 = Supercell, 28 = Minecraft
 */

// ============================================
// BASE TYPES
// ============================================

export type EmailType = 'native' | 'autoreg' | 'no' | 'no_market';
export type Currency = 'usd' | 'rub' | 'eur' | 'uah' | 'kzt' | 'byn' | 'gbp';
export type OrderBy = 'price_to_up' | 'price_to_down' | 'pdate_to_down' | 'pdate_to_up';
export type YesNoNoMatter = 'yes' | 'no' | 'nomatter';

export interface LZTSeller {
    user_id: number;
    username: string;
    avatar_date?: number;
    sold_items_count: number;
    active_items_count: number;
    restore_data: string;
    is_banned: number;
    display_style_group_id: number;
    restore_percents: number;
}

export interface LZTFeedback {
    count: number;
    positivePercent: number;
}

export interface LZTSystemInfo {
    visitor_id: number;
    time: number;
}

// ============================================
// BASE ITEM INTERFACE (Common to all games)
// ============================================

export interface LZTBaseItem {
    item_id: number;
    item_state: string;
    category_id: number;
    published_date: number;
    title: string;
    title_en?: string;
    description?: string;
    description_en?: string;
    descriptionPlain?: string;
    descriptionEnPlain?: string;
    price: number;
    update_stat_date?: number;
    refreshed_date?: number;
    edit_date?: number;
    view_count?: number;
    is_sticky?: boolean;
    item_origin?: string;
    extended_guarantee?: number;
    nsb?: boolean; // Not sold before
    allow_ask_discount?: boolean;
    
    // Email info
    email_type?: EmailType;
    email_provider?: string;
    item_domain?: string;
    resale_item_origin?: string;
    
    // Seller info
    seller?: LZTSeller;
    feedback_data?: LZTFeedback;
    
    // Permissions
    canBuyItem?: boolean;
    canViewLoginData?: boolean;
    canViewEmailLoginData?: boolean;
    
    // Pricing (multiple currencies)
    rub_price?: number;
    price_currency?: string;
    
    // Phrases (for display)
    itemOriginPhrase?: string;
    
    // Account activity
    account_last_activity?: number;
    
    // Tags
    tags?: any[];
    
    // Our pricing (added by our service)
    display_price?: number;
    original_price?: number;
    our_margin?: number;
}

// ============================================
// STEAM ITEMS (Category 1)
// ============================================

export interface LZTSteamItem extends LZTBaseItem {
    category_id: 1;
    
    // Steam specific
    steam_level?: number;
    steam_games_count?: number;
    steam_hours?: number;
    steam_friends_count?: number;
    steam_balance?: number;
    steam_inventory_value?: number;
    
    // Bans
    steam_vac_bans?: number;
    steam_game_bans?: number;
    steam_community_ban?: boolean;
    steam_trade_ban?: boolean;
    
    // CS2 specific
    cs2_rank?: number;
    cs2_wingman_rank?: number;
    cs2_premier_rank?: number;
    cs2_wins?: number;
    cs2_prime?: boolean;
    
    // Account info
    steam_register_date?: number;
    steam_mafile?: boolean;
    steam_limit?: boolean;
}

// ============================================
// VALORANT / RIOT ITEMS (Category 13)
// ============================================

export type ValorantRank = number; // 0-25 (Unranked to Radiant)
export type ValorantRegion = 'eu' | 'na' | 'ap' | 'kr' | 'br' | 'latam';
export type ValorantRankType = 'ranked' | 'ranked_ready' | 'unrated';

// Inventory item structure
export interface ValorantInventoryItem {
    uuid: string;
    name: string;
    image?: string;
}

export interface ValorantInventory {
    WeaponSkins: string[];
    Agent: string[];
    Buddy: string[];
}

export interface LZTValorantItem extends LZTBaseItem {
    category_id: 13;
    
    // Riot account info
    riot_item_id?: number;
    riot_id?: string;
    riot_account_verified?: boolean;
    riot_email_verified?: boolean;
    riot_country?: string;
    riot_password_change?: boolean;
    riot_phone_verified?: boolean;
    riot_last_activity?: number;
    riot_username?: string;
    
    // Valorant wallet
    riot_valorant_wallet_vp?: number;  // Valorant Points
    riot_valorant_wallet_rp?: number;  // Radianite Points
    riot_valorant_wallet_fa?: number;  // Free Agents tokens
    
    // Valorant account info
    riot_valorant_level?: number;
    riot_valorant_rank?: ValorantRank;
    riot_valorant_region?: ValorantRegion;
    riot_valorant_skin_count?: number;
    riot_valorant_agent_count?: number;
    riot_valorant_previous_rank?: ValorantRank;
    riot_valorant_last_rank?: ValorantRank;
    riot_valorant_rank_type?: ValorantRankType;
    riot_valorant_inventory_value?: number;
    riot_valorant_knife?: number;  // Number of knives
    
    // League of Legends (also on Riot accounts)
    riot_lol_region?: string;
    riot_lol_skin_count?: number;
    riot_lol_champion_count?: number;
    riot_lol_level?: number;
    riot_lol_wallet_blue?: number;
    riot_lol_wallet_orange?: number;
    riot_lol_wallet_mythic?: number;
    riot_lol_wallet_riot?: number;
    riot_lol_rank?: number;
    riot_lol_rank_win_rate?: number;
    
    // Display phrases (for UI)
    valorantRegionPhrase?: string;
    valorantRankTitle?: string;
    valorantRankImgPath?: string;
    valorantPreviousRankTitle?: string;
    valorantLastRankTitle?: string;
    lolRegionPhrase?: string;
    
    // Inventory data
    valorantInventory?: ValorantInventory;
    lolInventory?: {
        Champion: number[];
        Skin: number[];
    };
}

// ============================================
// FORTNITE ITEMS (Category 9)
// ============================================

// Fortnite cosmetic items
export interface FortniteCosmetic {
    id: string;
    title: string;
    rarity: string;
    type: string;
    from_shop: number;
}

export interface FortnitePastSeason {
    numWins: number;
    seasonXp: number;
    purchasedVIP: boolean;
    survivorPrestige: number;
    seasonLevel: number;
    numLowBracket: number;
    bookLevel: number;
    numRoyalRoyales: number;
    seasonNumber: number;
    survivorTier: number;
    numHighBracket: number;
}

export interface FortniteTransaction {
    date: number;
    title: string;
    presentmentTotal: string;
    orderType: string;
}

export interface LZTFortniteItem extends LZTBaseItem {
    category_id: 9;
    
    // Fortnite account info
    fortnite_item_id?: number;
    fortnite_platform?: string;
    fortnite_register_date?: number;
    fortnite_last_activity?: number;
    fortnite_book_level?: number;      // Battle Pass level
    fortnite_lifetime_wins?: number;
    fortnite_level?: number;
    fortnite_season_num?: number;
    fortnite_books_purchased?: number;  // Battle Passes bought
    fortnite_balance?: number;          // V-Bucks
    fortnite_skin_count?: number;
    fortnite_change_email?: boolean;
    fortnite_rl_purchases?: number;     // Rocket League purchases
    fortnite_next_change_email_date?: number;
    fortnite_last_trans_date?: number;
    fortnite_xbox_linkable?: boolean;
    fortnite_psn_linkable?: boolean;
    
    // Shop counts
    fortnite_shop_skins_count?: number;
    fortnite_shop_pickaxes_count?: number;
    fortnite_shop_dances_count?: number;
    fortnite_shop_gliders_count?: number;
    fortnite_pickaxe_count?: number;
    fortnite_dance_count?: number;
    fortnite_glider_count?: number;
    
    // Inventory arrays
    fortniteSkins?: FortniteCosmetic[];
    fortnitePickaxe?: FortniteCosmetic[];
    fortniteDance?: FortniteCosmetic[];
    fortniteGliders?: FortniteCosmetic[];
    fortnitePastSeasons?: FortnitePastSeason[];
    fortniteTransactions?: FortniteTransaction[];
    
    // Shop counts object
    shopCounts?: {
        shopSkinsCount: number;
        shopPickaxesCount: number;
        shopDancesCount: number;
        shopGlidersCount: number;
    };
}

// ============================================
// CLASH OF CLANS ITEMS (Category 15)
// ============================================

export interface LZTClashOfClansItem extends LZTBaseItem {
    category_id: 15;
    
    coc_town_hall_level?: number;
    coc_builder_hall_level?: number;
    coc_trophies?: number;
    coc_war_stars?: number;
    coc_gems?: number;
    coc_heroes_level?: number;
}

// ============================================
// MINECRAFT ITEMS (Category 28)
// ============================================

export interface LZTMinecraftItem extends LZTBaseItem {
    category_id: 28;
    
    minecraft_hypixel_rank?: string;
    minecraft_hypixel_level?: number;
    minecraft_cape?: boolean;
    minecraft_optifine_cape?: boolean;
    minecraft_migrated?: boolean;
}

// ============================================
// BATTLE.NET ITEMS (Category 11)
// ============================================

export interface LZTBattleNetItem extends LZTBaseItem {
    category_id: 11;
    
    battlenet_balance?: number;
    battlenet_games?: string[];
    battlenet_overwatch_rank?: number;
    battlenet_wow_chars?: number;
}

// ============================================
// EPIC GAMES ITEMS (Category 12)
// ============================================

export interface LZTEpicGamesItem extends LZTBaseItem {
    category_id: 12;
    
    epic_games_count?: number;
    epic_balance?: number;
    epic_fortnite_linked?: boolean;
}

// ============================================
// WARFACE ITEMS (Category 4)
// ============================================

export interface LZTWarfaceItem extends LZTBaseItem {
    category_id: 4;
    
    warface_rank?: number;
    warface_server?: string;
    warface_kredits?: number;
}

// ============================================
// UNION TYPE FOR ALL ITEMS
// ============================================

export type LZTItem = 
    | LZTSteamItem 
    | LZTValorantItem 
    | LZTFortniteItem 
    | LZTClashOfClansItem 
    | LZTMinecraftItem 
    | LZTBattleNetItem 
    | LZTEpicGamesItem 
    | LZTWarfaceItem
    | LZTBaseItem;

// ============================================
// API RESPONSE TYPES
// ============================================

export interface LZTItemListResponse {
    items: any[]; // Flexible to handle API variations
    totalItems: number;
    page?: number;
    system_info?: LZTSystemInfo;
}

export interface LZTItemDetailResponse {
    item: LZTItem;
    system_info?: LZTSystemInfo;
}

export interface LZTPurchaseResponse {
    status: 'ok' | 'error';
    item?: {
        item_id: number;
        loginData?: {
            login: string;
            password: string;
            raw: string;
            encodedPassword?: string;
            adviceToChangePassword?: boolean;
        };
    };
    errors?: string[];
    system_info?: LZTSystemInfo;
}

export interface LZTBalanceResponse {
    balance: number;
    hold: number;
    system_info?: LZTSystemInfo;
}

// ============================================
// FILTER TYPES
// ============================================

export interface LZTBaseFilters {
    page?: number;
    pmin?: number;
    pmax?: number;
    title?: string;
    order_by?: OrderBy;
    currency?: Currency;
    tag_id?: number;
    not_tag_id?: number;
    origin?: string;
    not_origin?: string;
    user_id?: number;
    nsb?: boolean;  // Not sold before
    sb?: boolean;   // Sold before
    email_login_data?: boolean;
    email_type?: EmailType[];
}

export interface LZTSteamFilters extends LZTBaseFilters {
    game?: number[];
    hours_played?: Record<number, number>;
    eg?: -1 | 0 | 1;  // Extended guarantee
    vac?: number[];
    no_vac?: boolean;
    rt?: 'yes' | 'no' | 'nomatter';  // Community ban
    trade_ban?: 'yes' | 'no' | 'nomatter';
    mafile?: 'yes' | 'no' | 'nomatter';
    lmin?: number;  // Min level
    lmax?: number;  // Max level
    rmin?: number;  // Min CS2 rank
    rmax?: number;  // Max CS2 rank
    balance_min?: number;
    balance_max?: number;
    gmin?: number;  // Min games
    gmax?: number;  // Max games
}

export interface LZTValorantFilters extends LZTBaseFilters {
    rmin?: number;  // Min rank
    rmax?: number;  // Max rank
    skin_count_min?: number;
    agent_count_min?: number;
    vp_min?: number;
    region?: string[];
    level_min?: number;
}

export interface LZTFortniteFilters extends LZTBaseFilters {
    skin_count_min?: number;
    vbucks_min?: number;
    bp_level_min?: number;
}

// ============================================
// CATEGORY CONSTANTS
// ============================================

export const LZT_CATEGORIES = {
    STEAM: 1,
    WARFACE: 4,
    FORTNITE: 9,
    BATTLENET: 11,
    EPIC_GAMES: 12,
    VALORANT: 13,
    CLASH_OF_CLANS: 15,
    MINECRAFT: 28,
} as const;

export const VALORANT_RANKS: Record<number, string> = {
    0: 'Unranked',
    1: 'Iron 1', 2: 'Iron 2', 3: 'Iron 3',
    4: 'Bronze 1', 5: 'Bronze 2', 6: 'Bronze 3',
    7: 'Silver 1', 8: 'Silver 2', 9: 'Silver 3',
    10: 'Gold 1', 11: 'Gold 2', 12: 'Gold 3',
    13: 'Platinum 1', 14: 'Platinum 2', 15: 'Platinum 3',
    16: 'Diamond 1', 17: 'Diamond 2', 18: 'Diamond 3',
    19: 'Ascendant 1', 20: 'Ascendant 2', 21: 'Ascendant 3',
    22: 'Immortal 1', 23: 'Immortal 2', 24: 'Immortal 3',
    25: 'Radiant',
};

export const CS2_RANKS: Record<number, string> = {
    0: 'Unranked',
    1: 'Silver I', 2: 'Silver II', 3: 'Silver III', 4: 'Silver IV',
    5: 'Silver Elite', 6: 'Silver Elite Master',
    7: 'Gold Nova I', 8: 'Gold Nova II', 9: 'Gold Nova III', 10: 'Gold Nova Master',
    11: 'Master Guardian I', 12: 'Master Guardian II',
    13: 'Master Guardian Elite', 14: 'Distinguished Master Guardian',
    15: 'Legendary Eagle', 16: 'Legendary Eagle Master',
    17: 'Supreme Master First Class', 18: 'Global Elite',
};
