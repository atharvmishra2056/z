"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
} from "@heroui/react";

const marketItems = [
    { key: "steam", label: "Steam", icon: "🎮" },
    { key: "valorant", label: "Valorant", icon: "🎯" },
    { key: "ea", label: "EA Games", icon: "⚽" },
    { key: "coc", label: "C.O.C", icon: "🏰" },
    { key: "minecraft", label: "Minecraft", icon: "⛏️" },
    { key: "battlenet", label: "Battlenet", icon: "⚔️" },
    { key: "epic", label: "Epic Games", icon: "🎪" },
    { key: "warface", label: "Warface", icon: "🔫" },
];

export default function NavigationBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`sticky ${scrolled ? "top-2" : "top-4"} z-50 mx-4 md:mx-8 transition-all duration-300`}
        >
            <Navbar
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
                maxWidth="full"
                classNames={{
                    base: `glassmorphism-heavy rounded-3xl shadow-glass-lg border-white/10 transition-all duration-300`,
                    wrapper: "px-6 py-2",
                    item: "data-[active=true]:text-white",
                }}
            >
                {/* Logo */}
                <NavbarBrand className="gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-glass overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 text-xs md:text-sm font-black text-white/90">
              LOGO
            </span>
                    </motion.div>
                    <p className="hidden md:block text-xl lg:text-2xl font-black gradient-text">
                        KXW x KuzzBoost
                    </p>
                </NavbarBrand>

                {/* Desktop Menu */}
                <NavbarContent className="hidden lg:flex gap-6" justify="center">
                    <NavbarItem>
                        <Button
                            as="a"
                            href="#home"
                            variant="light"
                            className="text-white/90 hover:text-white font-semibold text-sm"
                        >
                            Home
                        </Button>
                    </NavbarItem>

                    <NavbarItem>
                        <Dropdown
                            classNames={{
                                base: "before:bg-black",
                                content: "glassmorphism-heavy rounded-2xl border border-white/10 p-2 min-w-[280px]",
                            }}
                        >
                            <DropdownTrigger>
                                <Button
                                    variant="light"
                                    className="text-white/90 hover:text-white font-semibold text-sm"
                                    endContent={<span className="text-xs">▾</span>}
                                >
                                    Market
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Market Dropdown"
                                classNames={{
                                    base: "before:bg-black",
                                    content: "glassmorphism-heavy rounded-2xl border border-white/10 p-2 min-w-[280px]",
                                }}
                            >
                                <DropdownItem
                                    key="all"
                                    as="a"
                                    href="/marketplace"
                                    className="text-white font-satoshi hover:bg-white/5 rounded-xl"
                                >
                                    🎮 All Categories
                                </DropdownItem>
                                {["Steam", "Valorant", "EA Games", "C.O.C", "Minecraft", "Battlenet", "Epic Games", "Warface"].map((name) => (
                                    <DropdownItem
                                        key={name}
                                        as="a"
                                        href={`/marketplace?category=${name.toLowerCase()}`}
                                        className="text-white font-satoshi hover:bg-white/5 rounded-xl"
                                    >
                                        {name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>

                    <NavbarItem>
                        <Button
                            as="a"
                            href="#contact"
                            variant="light"
                            className="text-white/90 hover:text-white font-semibold text-sm"
                        >
                            Contact
                        </Button>
                    </NavbarItem>
                </NavbarContent>

                {/* Sign In Button */}
                <NavbarContent justify="end">
                    <NavbarItem className="hidden lg:flex">
                        <Button
                            as="a"
                            href="#signin"
                            className="bg-gradient-to-r from-white to-gray-100 text-black font-bold rounded-full px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Sign In / Sign Up
                        </Button>
                    </NavbarItem>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="lg:hidden text-white"
                    />
                </NavbarContent>

                {/* Mobile Menu */}
                <NavbarMenu
                    classNames={{
                        base: "glassmorphism-heavy border-t border-white/10 pt-6",
                        list: "gap-3",
                    }}
                >
                    <NavbarMenuItem>
                        <Button
                            as="a"
                            href="#home"
                            variant="light"
                            className="w-full justify-start text-white/90 hover:text-white font-semibold"
                            size="lg"
                        >
                            Home
                        </Button>
                    </NavbarMenuItem>

                    <NavbarMenuItem>
                        <div className="space-y-2 w-full">
                            <p className="text-white/60 text-sm font-bold px-4 py-2">Market</p>
                            {marketItems.map((item) => (
                                <Button
                                    key={item.key}
                                    as="a"
                                    href={`#${item.key}`}
                                    variant="light"
                                    className="w-full justify-start text-white/80 hover:text-white font-medium pl-8"
                                    startContent={<span className="text-lg">{item.icon}</span>}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    </NavbarMenuItem>

                    <NavbarMenuItem>
                        <Button
                            as="a"
                            href="#contact"
                            variant="light"
                            className="w-full justify-start text-white/90 hover:text-white font-semibold"
                            size="lg"
                        >
                            Contact
                        </Button>
                    </NavbarMenuItem>

                    <NavbarMenuItem className="mt-4">
                        <Button
                            as="a"
                            href="#signin"
                            className="w-full bg-gradient-to-r from-white to-gray-100 text-black font-bold rounded-full shadow-lg"
                            size="lg"
                        >
                            Sign In / Sign Up
                        </Button>
                    </NavbarMenuItem>
                </NavbarMenu>
            </Navbar>
        </motion.div>
    );
}