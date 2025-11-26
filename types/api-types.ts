export interface GameCategory {
    id: number;
    name: string;
    slug: string;
    icon: string; // Path to local icon
    color: string; // Brand color
}

export interface FilterOption {
    label: string;
    value: string | number;
}

// --- API Response Types (Simplified based on z.json) ---

export interface MarketItem {
    item_id: number;
    title: string;
    price: number;
    currency: string;
    category_id: number;

    // Detail View Extras
    description?: string;
    seller?: {
        userid: number;
        username: string;
        avatardate: number;
        solditemscount: number;
    };
    publisheddate?: number;
    viewcount?: number;
    tags?: string[];
    rub_price?: number; // Fixed from rubprice error earlier

    // LZT API Dynamic Pricing Fields (Phase 2.0)
    display_price?: number; // Our marked-up price (2x + margin)
    original_price?: number; // Original LZT price
    our_margin?: number; // Our profit margin ($2 or $5)
    our_markup?: number; // 2x multiplier result

    // Common
    email_type?: 'native' | 'autoreg' | 'no' | 'no_market' | 'personal';
    phone_linked?: boolean; // Inferred or specific param

    // Valorant (ID 13)
    valorant_rank?: number;
    valorant_skin_count?: number;
    valorant_agent_count?: number;
    valorant_vp?: number;
    valorant_rp?: number;
    valorant_region?: string;

    // Steam (ID 1)
    steam_level?: number;
    steam_game_count?: number;
    steam_vac_bans?: number;
    steam_inventory_value?: number;

    // Fortnite (ID 9)
    fortnite_skin_count?: number;
    fortnite_vbucks?: number;
    fortnite_bp_level?: number;

    // Clash of Clans (ID 15)
    clash_town_hall_level?: number;
    clash_builder_hall_level?: number;
    clash_trophies?: number;

    // Minecraft (ID 28)
    minecraft_hypixel_rank?: string;
    minecraft_hypixel_level?: number;

    // Battle.net (ID 11)
    battlenet_balance?: number;
    battlenet_games?: string[]; // Inferred list

    // Epic Games (ID 12)
    epic_wallet_balance?: number;
    epic_game_count?: number;

    // Warface (ID 4)
    warface_rank?: number;
    warface_server?: string;
}

export interface SearchParams {
    // Global
    pmin?: number;
    pmax?: number;
    title?: string;
    origin?: string[];

    // Valorant
    valorant_rank_min?: number;
    valorant_rank_max?: number;
    valorant_skin_count?: number; // min
    valorant_knife_min?: number;
    valorant_knife_max?: number;
    valorant_vp_min?: number;
    valorant_region?: string[];

    // ... other game specific params mapped in Sidebar
}
