export const GAME_ASSETS: Record<string, { icon: string; gradient: string }> = {
    valorant: {
        icon: "/icons/valorant.svg",
        gradient: "linear-gradient(135deg, #FF4655 0%, #BD3944 100%)"
    },
    steam: {
        icon: "/icons/steam.svg",
        gradient: "linear-gradient(135deg, #171A21 0%, #1b2838 100%)"
    },
    fortnite: {
        icon: "/icons/fortnite.svg",
        gradient: "linear-gradient(135deg, #F5D000 0%, #E6C200 100%)"
    },
    "clash-of-clans": {
        icon: "/icons/coc.svg",
        gradient: "linear-gradient(135deg, #FFF000 0%, #FFD700 100%)"
    },
    minecraft: {
        icon: "/icons/minecraft.svg",
        gradient: "linear-gradient(135deg, #45A02B 0%, #388E3C 100%)"
    },
    battlenet: {
        icon: "/icons/battlenet.svg",
        gradient: "linear-gradient(135deg, #148EFF 0%, #0074E0 100%)"
    },
    "epic-games": {
        icon: "/icons/epic.svg",
        gradient: "linear-gradient(135deg, #313131 0%, #202020 100%)"
    },
    warface: {
        icon: "/icons/warface.svg",
        gradient: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)"
    }
};

export const getGameAsset = (slug: string) => {
    return GAME_ASSETS[slug] || {
        icon: "",
        gradient: "linear-gradient(135deg, #333 0%, #000 100%)"
    };
};
