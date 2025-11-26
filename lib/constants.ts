import { GameCategory } from "@/types/api-types";

export const ELITE_8_GAMES: GameCategory[] = [
    {
        id: 13,
        name: "Valorant",
        slug: "valorant",
        icon: "/icons/valorant.svg", // Placeholder
        color: "#FF4655"
    },
    {
        id: 1,
        name: "Steam",
        slug: "steam",
        icon: "/icons/steam.svg",
        color: "#171A21"
    },
    {
        id: 9,
        name: "Fortnite",
        slug: "fortnite",
        icon: "/icons/fortnite.svg",
        color: "#F5D000" // Or Epic Blue
    },
    {
        id: 15,
        name: "Clash of Clans",
        slug: "clash-of-clans",
        icon: "/icons/coc.svg",
        color: "#FFF000"
    },
    {
        id: 28,
        name: "Minecraft",
        slug: "minecraft",
        icon: "/icons/minecraft.svg",
        color: "#45A02B"
    },
    {
        id: 11,
        name: "Battle.net",
        slug: "battlenet",
        icon: "/icons/battlenet.svg",
        color: "#148EFF"
    },
    {
        id: 12,
        name: "Epic Games",
        slug: "epic-games",
        icon: "/icons/epic.svg",
        color: "#313131"
    },
    {
        id: 4,
        name: "Warface",
        slug: "warface",
        icon: "/icons/warface.svg",
        color: "#FF0000"
    }
];

export const VALORANT_REGIONS = [
    { label: "North America", value: "na" },
    { label: "Europe", value: "eu" },
    { label: "Asia Pacific", value: "ap" },
    { label: "Korea", value: "kr" },
    { label: "LATAM", value: "latam" },
    { label: "Brazil", value: "br" }
];

export const ORIGIN_TYPES = [
    { label: "Personal", value: "personal" },
    { label: "Brute", value: "brute" },
    { label: "Fishing", value: "fishing" },
    { label: "Stealer", value: "stealer" },
    { label: "Autoreg", value: "autoreg" },
    { label: "Resale", value: "resale" }
];
