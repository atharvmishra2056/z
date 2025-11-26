import { MarketItem } from "@/types/api-types";

export const MOCK_ITEMS: MarketItem[] = [
    {
        item_id: 101,
        title: "Valorant | Radiant | 350 Skins | RGX Blade | FA",
        price: 450,
        currency: "$",
        category_id: 13, // Valorant
        email_type: "native",
        valorant_rank: 27, // Radiant
        valorant_region: "NA",
        valorant_skin_count: 350,
        valorant_agent_count: 22,
        valorant_vp: 2500,
        // Detail View Extras
        description: "Full Access (FA) Radiant account. Peak rank #450. Includes RGX 11z Pro Blade, Reaver Vandal, Ion Operator. Voice chat enabled. No bans. Original email included.",
        seller: {
            userid: 12345,
            username: "GhostOperator",
            avatardate: 1678900000,
            solditemscount: 42
        },
        publisheddate: 1715430000,
        viewcount: 1250,
        tags: ["Radiant", "Full Access", "Skins"]
    },
    {
        item_id: 102,
        title: "Steam 18 Years | CS2 Prime | 5k Hours | 200 Games",
        price: 120,
        currency: "$",
        category_id: 1, // Steam
        email_type: "native",
        steam_level: 150,
        steam_game_count: 200,
        steam_vac_bans: 0,
        steam_inventory_value: 450,
        description: "18 Year Old Steam Account. CS2 Prime Status enabled. 5,000+ hours on CS:GO/CS2. High trust factor. Includes 200+ other games including GTA V, RDR2, and more.",
        seller: {
            userid: 67890,
            username: "OldGuard",
            avatardate: 1678900000,
            solditemscount: 150
        },
        publisheddate: 1715420000,
        viewcount: 890,
        tags: ["High Level", "Prime", "No Bans"]
    },
    {
        item_id: 103,
        title: "Fortnite | Travis Scott | Black Knight | 200 Skins",
        price: 800,
        currency: "$",
        category_id: 9, // Fortnite
        email_type: "personal",
        fortnite_skin_count: 210,
        fortnite_vbucks: 1200,
        fortnite_bp_level: 350,
        description: "Rare Fortnite account with Travis Scott skin and Black Knight. 200+ total skins. Save the World Founder's Pack included. Linkable to all platforms.",
        seller: {
            userid: 11223,
            username: "RareTrader",
            avatardate: 1678900000,
            solditemscount: 8
        },
        publisheddate: 1715410000,
        viewcount: 3400,
        tags: ["OG", "Rare Skins", "Travis Scott"]
    },
    {
        item_id: 104,
        title: "Cheap Smurf | Ascendant 1 | Reaver Vandal",
        price: 25,
        currency: "$",
        category_id: 13, // Valorant
        email_type: "autoreg",
        valorant_rank: 21, // Ascendant
        valorant_region: "AP",
        valorant_skin_count: 5,
        valorant_agent_count: 10,
        description: "Perfect smurf account. Ascendant 1 current rank. Hand leveled. Contains Reaver Vandal. Name change available.",
        seller: {
            userid: 44556,
            username: "SmurfCentral",
            avatardate: 1678900000,
            solditemscount: 500
        },
        publisheddate: 1715400000,
        viewcount: 120,
        tags: ["Smurf", "Cheap", "Ranked Ready"]
    },
    {
        item_id: 105,
        title: "Clash of Clans TH15 Maxed | 5k Gems",
        price: 150,
        currency: "$",
        category_id: 15, // Clash of Clans
        email_type: "personal",
        clash_town_hall_level: 15,
        clash_trophies: 5200,
        clash_builder_hall_level: 9,
        description: "Town Hall 15 almost fully maxed. 5,000 gems ready to use. Max heroes. Supercell ID linked (will provide full access).",
        seller: {
            userid: 77889,
            username: "ClashKing",
            avatardate: 1678900000,
            solditemscount: 25
        },
        publisheddate: 1715390000,
        viewcount: 450,
        tags: ["Maxed", "High Level", "Gems"]
    },
    {
        item_id: 106,
        title: "Minecraft MVP+ | Hypixel Level 250 | Migrated",
        price: 60,
        currency: "$",
        category_id: 28, // Minecraft
        email_type: "native",
        minecraft_hypixel_rank: "MVP+",
        minecraft_hypixel_level: 250,
        description: "Migrated Microsoft account. MVP+ rank on Hypixel. Level 250+. Optifine cape included. Clean name history.",
        seller: {
            userid: 99001,
            username: "BlockMaster",
            avatardate: 1678900000,
            solditemscount: 60
        },
        publisheddate: 1715380000,
        viewcount: 210,
        tags: ["Hypixel", "MVP+", "Migrated"]
    },
    {
        item_id: 107,
        title: "Battle.net | Overwatch 2 GM | MW3 Vault Edition",
        price: 200,
        currency: "$",
        category_id: 11, // Battle.net
        email_type: "personal",
        battlenet_balance: 50,
        battlenet_games: ["Overwatch 2", "MW3"],
        description: "Grandmaster Overwatch 2 account. Includes MW3 Vault Edition. $50 balance on account. Fake name on account (safe).",
        seller: {
            userid: 22334,
            username: "BlizzardWiz",
            avatardate: 1678900000,
            solditemscount: 12
        },
        publisheddate: 1715370000,
        viewcount: 560,
        tags: ["GM", "MW3", "Balance"]
    },
    {
        item_id: 108,
        title: "Epic Games | 500+ Free Games | GTA V Premium",
        price: 40,
        currency: "$",
        category_id: 12, // Epic Games
        email_type: "personal",
        epic_wallet_balance: 10,
        epic_game_count: 520,
        description: "Stacked Epic Games account with 500+ claimed free games including GTA V Premium, Subnautica, Batman Arkham Collection, and more.",
        seller: {
            userid: 55667,
            username: "FreeGameCollector",
            avatardate: 1678900000,
            solditemscount: 5
        },
        publisheddate: 1715360000,
        viewcount: 1500,
        tags: ["Stacked", "GTA V", "Cheap"]
    }
];

export const getMockItem = (id: number): MarketItem | undefined => {
    return MOCK_ITEMS.find(item => item.item_id === id);
};

export const MOCK_USER = {
    id: "u_123456",
    username: "SpectreOperative",
    email: "operative@tactical.gg",
    avatar: "https://i.pravatar.cc/150?u=SpectreOperative",
    balance: 1250.50,
    currency: "USD",
    isVerified: true,
    trustScore: 98,
    memberSince: "2023-11-15",
    transactions: [
        { id: "tx_1", type: "deposit", amount: 500, date: "2024-05-20", status: "completed", method: "Crypto (USDT)" },
        { id: "tx_2", type: "purchase", amount: -120, date: "2024-05-18", status: "completed", item: "Steam 18 Years | CS2 Prime" },
        { id: "tx_3", type: "deposit", amount: 1000, date: "2024-05-10", status: "completed", method: "Credit Card" },
        { id: "tx_4", type: "purchase", amount: -45, date: "2024-05-05", status: "completed", item: "Valorant Smurf | Ascendant" }
    ],
    assets: [
        MOCK_ITEMS[1], // Steam Account
        MOCK_ITEMS[3]  // Valorant Smurf
    ]
};
