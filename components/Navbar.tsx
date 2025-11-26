"use client";

import AuthModal from "@/components/auth/AuthModal";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useRouter } from "next/navigation";
import LiquidLens from "@/components/ui/LiquidLens";
import CeramicTray from "@/components/ui/CeramicTray";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { ELITE_8_GAMES } from "@/lib/constants";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { LogOut, User, Wallet } from "lucide-react";

const NAV_TABS = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'market', label: 'Market', href: '/marketplace' },
    { id: 'support', label: 'Support', href: '/support' },
];

// Map ELITE_8_GAMES to the format expected by CeramicTray
const COLORED_ICON_SLUGS = new Set(["valorant", "steam", "fortnite"]);

const MARKET_ITEMS = ELITE_8_GAMES.map(game => ({
    key: game.slug,
    label: game.name,
    icon: (
        <Image
            src={game.icon}
            alt={game.name}
            width={32}
            height={32}
            className="object-contain"
            style={COLORED_ICON_SLUGS.has(game.slug) ? undefined : { filter: "brightness(0) saturate(100%) invert(100%)" }}
        />
    ),
    href: `/marketplace?game=${game.slug}`
}));

export default function NavigationBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeHover, setActiveHover] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const router = useRouter();
    const { isAuthenticated, username, avatar, balance, logout } = useUser();
    const { currency, setCurrency, formatPrice } = useCurrency();

    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleLensHover = (id: string | null) => {
        if (id) {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
            setActiveHover(id);
        } else {
            closeTimeoutRef.current = setTimeout(() => {
                setActiveHover(null);
            }, 200);
        }
    };

    const handleTrayEnter = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setActiveHover('market');
    };

    const handleTrayLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setActiveHover(null);
        }, 200);
    };

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const { scrollY } = useScroll();
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
            >
                {/* THE HUD CONTAINER - Smoothly Resizes */}
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className={`pointer-events-auto ${isScrolled ? "w-auto" : "w-full max-w-7xl"
                        }`}
                >
                    <HeroNavbar
                        isMenuOpen={isMobileMenuOpen}
                        onMenuOpenChange={setIsMobileMenuOpen}
                        maxWidth="full"
                        classNames={{
                            base: "bg-transparent",
                            wrapper: "glass-tahoe rounded-full px-6 h-[72px] transition-all duration-300",
                        }}
                    >
                        {/* 1. LEFT: BRAND (Always Visible) */}
                        <NavbarBrand className="gap-3 grow-0 mr-8 cursor-pointer group" onClick={() => router.push('/')}>
                            <div className="relative w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform duration-300">
                                <span className="font-black text-xl italic relative z-10">K</span>
                                <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-transparent opacity-50" />
                            </div>

                            {/* The Text Logo */}
                            <div className="hidden md:flex items-baseline gap-1 overflow-hidden">
                                {/* KXW is ALWAYS visible */}
                                <span className="text-2xl font-black italic tracking-tighter text-white group-hover:text-shadow-glow transition-all whitespace-nowrap">
                                    KXW
                                </span>

                                {/* Slogan collapses when scrolled */}
                                <div className={`flex items-baseline transition-all duration-500 ease-in-out ${isScrolled ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                                    <span className="text-brand-primary font-bold text-lg opacity-50 mx-0.5">
                                        x
                                    </span>
                                    <span className="text-lg font-bold tracking-tight text-white/40 group-hover:text-white/80 transition-colors whitespace-nowrap">
                                        KUZZ
                                    </span>
                                </div>
                            </div>
                        </NavbarBrand>

                        {/* 2. CENTER: NAVIGATION */}
                        <NavbarContent className="hidden md:flex gap-0" justify="center">
                            <div className="relative">
                                <LiquidLens
                                    tabs={NAV_TABS}
                                    activeTabId={activeHover || ""}
                                    onHover={handleLensHover}
                                />
                                <CeramicTray
                                    isOpen={activeHover === 'market'}
                                    items={MARKET_ITEMS}
                                    onMouseEnter={handleTrayEnter}
                                    onMouseLeave={handleTrayLeave}
                                />
                            </div>
                        </NavbarContent>

                        {/* 3. RIGHT: UTILITY CLUSTER */}
                        <NavbarContent justify="end" className="gap-3">
                            {/* Currency Selector */}
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className="text-white/70 hover:text-white min-w-0 px-2 font-mono hidden sm:flex"
                                    >
                                        {currency}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Currency Selection"
                                    onAction={(key) => setCurrency(key as any)}
                                    className="bg-black/90 border border-white/10 rounded-xl"
                                >
                                    <DropdownItem key="USD" className="text-white hover:bg-white/10">USD ($)</DropdownItem>
                                    <DropdownItem key="INR" className="text-white hover:bg-white/10">INR (₹)</DropdownItem>
                                    <DropdownItem key="GBP" className="text-white hover:bg-white/10">GBP (£)</DropdownItem>
                                    <DropdownItem key="EUR" className="text-white hover:bg-white/10">EUR (€)</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            {/* Functional Search Pill */}
                            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-4 py-2 hover:border-white/20 hover:bg-white/10 transition-all cursor-text group min-w-[150px]">
                                <SearchIcon className="text-white/40 group-hover:text-white transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/30 w-full"
                                />
                            </div>

                            {/* User State - Show Avatar if logged in, Connect button if not */}
                            {isAuthenticated ? (
                                <Dropdown placement="bottom-end" className="min-w-[280px]">
                                    <DropdownTrigger>
                                        <Avatar
                                            isBordered
                                            as="button"
                                            className="transition-transform cursor-pointer hover:scale-110 border-brand-primary/50"
                                            size="sm"
                                            src={avatar || undefined}
                                        />
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Profile Actions"
                                        variant="flat"
                                        className="p-0"
                                        classNames={{
                                            base: "glass-deep shape-squircle border border-white/10 overflow-hidden p-2 shadow-tahoe",
                                            list: "gap-1"
                                        }}
                                    >
                                        {/* User Header */}
                                        <DropdownItem
                                            key="profile_header"
                                            className="h-auto gap-2 opacity-100 cursor-default hover:!bg-transparent p-4 rounded-2xl"
                                            textValue="Profile Header"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    size="md"
                                                    src={avatar || undefined}
                                                    className="border-2 border-brand-primary/30"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-bold text-white text-sm">{username}</p>
                                                    <p className="text-xs text-white/50 font-mono">VERIFIED TRADER</p>
                                                </div>
                                            </div>
                                        </DropdownItem>

                                        {/* Balance Display */}
                                        <DropdownItem
                                            key="balance"
                                            className="opacity-100 cursor-default hover:!bg-transparent rounded-2xl bg-white/5 border border-white/5"
                                            textValue="Balance"
                                        >
                                            <div className="flex items-center justify-between p-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                                                        <Wallet size={16} className="text-brand-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Balance</p>
                                                        <p className="font-black text-white font-mono">{formatPrice(balance)}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="bg-brand-primary/20 text-brand-primary text-xs font-bold h-7 min-w-16 hover:bg-brand-primary/30"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push('/profile#balance');
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </DropdownItem>

                                        {/* Divider */}
                                        <DropdownItem
                                            key="divider1"
                                            className="h-px p-0 opacity-100 cursor-default hover:!bg-transparent my-1"
                                            textValue="Divider"
                                        >
                                            <div className="h-px bg-white/10" />
                                        </DropdownItem>

                                        {/* Navigation Items */}
                                        <DropdownItem
                                            key="profile_page"
                                            className="text-white hover:bg-white/10 rounded-2xl data-[hover=true]:bg-white/10"
                                            startContent={<User size={16} className="text-white/60" />}
                                            onClick={() => router.push('/profile')}
                                        >
                                            <span className="font-medium">My Profile</span>
                                        </DropdownItem>

                                        <DropdownItem
                                            key="transactions"
                                            className="text-white hover:bg-white/10 rounded-2xl data-[hover=true]:bg-white/10"
                                            startContent={<Wallet size={16} className="text-white/60" />}
                                            onClick={() => router.push('/profile#transactions')}
                                        >
                                            <span className="font-medium">Transactions</span>
                                        </DropdownItem>

                                        {/* Divider */}
                                        <DropdownItem
                                            key="divider2"
                                            className="h-px p-0 opacity-100 cursor-default hover:!bg-transparent my-1"
                                            textValue="Divider"
                                        >
                                            <div className="h-px bg-white/10" />
                                        </DropdownItem>

                                        {/* Logout */}
                                        <DropdownItem
                                            key="logout"
                                            color="danger"
                                            className="text-red-400 hover:!bg-red-500/10 rounded-2xl data-[hover=true]:bg-red-500/10"
                                            startContent={<LogOut size={16} />}
                                            onClick={logout}
                                        >
                                            <span className="font-bold">Log Out</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            ) : (
                                <Button
                                    radius="full"
                                    className="bg-white text-black font-bold text-xs px-5 h-10 hover:bg-gray-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] hidden sm:flex"
                                    startContent={<UserIcon size={16} />}
                                    onClick={() => setIsAuthOpen(true)}
                                >
                                    Connect
                                </Button>
                            )}

                            <NavbarMenuToggle className="md:hidden text-white/70" />
                        </NavbarContent>

                        {/* 4. MOBILE MENU */}
                        <NavbarMenu className="bg-black/90 backdrop-blur-xl border-t border-white/10 pt-8 gap-6">
                            {NAV_TABS.map((item) => (
                                <NavbarMenuItem key={item.id}>
                                    <a href={item.href} className="text-3xl font-black text-white/90 hover:text-white">
                                        {item.label}
                                    </a>
                                </NavbarMenuItem>
                            ))}
                            <div className="h-px w-full bg-white/10 my-4" />
                            <Button
                                className="w-full bg-white text-black font-bold py-6 rounded-2xl"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsAuthOpen(true);
                                }}
                            >
                                Connect Wallet
                            </Button>
                        </NavbarMenu>
                    </HeroNavbar>
                </motion.div>
            </motion.div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}