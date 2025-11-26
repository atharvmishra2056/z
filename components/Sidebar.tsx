"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider, Button, Checkbox, CheckboxGroup, Select, SelectItem, Input } from "@heroui/react";
import { Filter, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { ELITE_8_GAMES, VALORANT_REGIONS, ORIGIN_TYPES } from "@/lib/constants";

export default function Sidebar() {
    const [isDeepWindowOpen, setIsDeepWindowOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<string>("valorant"); // Default to Valorant for demo

    // Filter States (Simplified for UI demo)
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
    const [rankRange, setRankRange] = useState<number[]>([0, 25]);

    const currentGame = ELITE_8_GAMES.find(g => g.slug === selectedGame);

    return (
        <>
            {/* --- PRIMARY SIDEBAR (Always Visible) --- */}
            <div className="w-80 flex-shrink-0 hidden lg:block">
                <div className="sticky top-32 space-y-6">

                    {/* Game Selector (Visual Header) */}
                    <div className="glass-panel p-4 rounded-2xl">
                        <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Active Operation</h3>
                        <div className="flex flex-wrap gap-2">
                            {ELITE_8_GAMES.map((game) => (
                                <button
                                    key={game.id}
                                    onClick={() => setSelectedGame(game.slug)}
                                    className={`p-2 rounded-xl transition-all border ${selectedGame === game.slug
                                        ? "bg-white/10 border-brand-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                                        : "bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/5"
                                        }`}
                                    title={game.name}
                                >
                                    {/* Placeholder for Icon */}
                                    <div className="w-6 h-6 flex items-center justify-center text-lg">
                                        {/* In real app, use Image or SVG */}
                                        {game.name[0]}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Primary Filters (Quick Access) */}
                    <div className="glass-panel p-6 rounded-[2rem] space-y-8">

                        {/* Price Range */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Price Range</span>
                                <span className="text-brand-primary font-mono">${priceRange[0]} - ${priceRange[1]}</span>
                            </div>
                            <Slider
                                size="sm"
                                step={10}
                                minValue={0}
                                maxValue={5000}
                                value={priceRange}
                                onChange={(v) => setPriceRange(v as number[])}
                                className="max-w-md"
                                color="secondary"
                            />
                        </div>

                        {/* Rank Range (Dynamic based on Game) */}
                        {selectedGame === 'valorant' && (
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Rank Rating</span>
                                    <span className="text-brand-accent font-mono">Iron 1 - Radiant</span>
                                </div>
                                <Slider
                                    size="sm"
                                    step={1}
                                    minValue={0}
                                    maxValue={25}
                                    value={rankRange}
                                    onChange={(v) => setRankRange(v as number[])}
                                    color="danger"
                                />
                            </div>
                        )}

                        {/* DEPLOY DEEP WINDOW BUTTON */}
                        <Button
                            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold tracking-wide group rounded-xl"
                            size="lg"
                            endContent={<ChevronDown className="group-hover:translate-y-1 transition-transform" />}
                            onClick={() => setIsDeepWindowOpen(true)}
                        >
                            Advanced Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- DEEP WINDOW (Modal / Overlay) --- */}
            <AnimatePresence>
                {isDeepWindowOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeepWindowOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                        />

                        {/* The Deep Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="fixed inset-x-4 top-24 bottom-24 max-w-6xl mx-auto glass-deep rounded-[2.5rem] z-[70] overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-8 border-b border-white/10 bg-white/5">
                                <div className="flex items-center gap-4">
                                    <Filter className="text-brand-primary" />
                                    <h2 className="text-2xl font-black italic tracking-tighter">
                                        Advanced Filters <span className="text-white/30">//</span> {currentGame?.name.toUpperCase()}
                                    </h2>
                                </div>
                                <Button isIconOnly variant="light" onClick={() => setIsDeepWindowOpen(false)}>
                                    <X />
                                </Button>
                            </div>

                            {/* Scrollable Content Grid */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                                    {/* COL 1: GLOBAL INTEL */}
                                    <div className="space-y-8">
                                        <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Global Intel</h4>

                                        <div className="space-y-2">
                                            <label className="text-sm text-white/70">Account Origin</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {ORIGIN_TYPES.map(origin => (
                                                    <Checkbox key={origin.value} value={origin.value} size="sm" classNames={{ label: "text-white/60" }}>
                                                        {origin.label}
                                                    </Checkbox>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm text-white/70">Account Health</label>

                                            {/* Segmented Control: Email */}
                                            <div className="bg-black/40 p-1 rounded-lg flex text-xs">
                                                <div className="px-3 py-1.5 text-white/40">Email Linked</div>
                                                <button className="flex-1 py-1.5 rounded bg-white/10 text-white font-medium">No Matter</button>
                                                <button className="flex-1 py-1.5 rounded hover:bg-white/5 text-white/60">No</button>
                                                <button className="flex-1 py-1.5 rounded hover:bg-white/5 text-white/60">Yes</button>
                                            </div>

                                            {/* Segmented Control: Phone */}
                                            <div className="bg-black/40 p-1 rounded-lg flex text-xs">
                                                <div className="px-3 py-1.5 text-white/40">Phone Linked</div>
                                                <button className="flex-1 py-1.5 rounded bg-white/10 text-white font-medium">No Matter</button>
                                                <button className="flex-1 py-1.5 rounded hover:bg-white/5 text-white/60">No</button>
                                                <button className="flex-1 py-1.5 rounded hover:bg-white/5 text-white/60">Yes</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COL 2: GAME SPECIFICS (Dynamic) */}
                                    <div className="space-y-8">
                                        <h4 className="text-sm font-bold text-brand-accent/80 uppercase tracking-widest border-b border-brand-accent/20 pb-2">
                                            {currentGame?.name} Specifics
                                        </h4>

                                        {selectedGame === 'valorant' && (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="text-sm text-white/70">Region</label>
                                                    <Select
                                                        placeholder="Select Region"
                                                        className="max-w-xs"
                                                        classNames={{
                                                            trigger: "bg-white/5 border-white/10",
                                                            popoverContent: "bg-black border border-white/10"
                                                        }}
                                                    >
                                                        {VALORANT_REGIONS.map(r => (
                                                            <SelectItem key={r.value}>
                                                                {r.label}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                </div>

                                                <div className="space-y-4">
                                                    <Checkbox color="danger">Has any knife</Checkbox>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input type="number" label="Knives Min" placeholder="0" variant="bordered" size="sm" />
                                                        <Input type="number" label="Knives Max" placeholder="Any" variant="bordered" size="sm" />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input type="number" label="Skins Min" placeholder="0" variant="bordered" size="sm" />
                                                        <Input type="number" label="Skins Max" placeholder="Any" variant="bordered" size="sm" />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* COL 3: ECONOMY & ASSETS */}
                                    <div className="space-y-8">
                                        <h4 className="text-sm font-bold text-brand-success/80 uppercase tracking-widest border-b border-brand-success/20 pb-2">Economy & Assets</h4>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="number"
                                                    label={selectedGame === 'valorant' ? "Min VP" : "Min Balance"}
                                                    placeholder="0"
                                                    variant="bordered"
                                                    size="sm"
                                                />
                                                <Input
                                                    type="number"
                                                    label={selectedGame === 'valorant' ? "Min RP" : "Max Balance"}
                                                    placeholder="Any"
                                                    variant="bordered"
                                                    size="sm"
                                                />
                                            </div>

                                            <div className="pt-4">
                                                <label className="text-sm text-white/70 mb-2 block">Inventory Value Estimate</label>
                                                <Slider
                                                    size="sm"
                                                    step={10}
                                                    minValue={0}
                                                    maxValue={1000}
                                                    defaultValue={[0, 1000]}
                                                    formatOptions={{ style: "currency", currency: "USD" }}
                                                    className="max-w-md"
                                                    color="success"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-4">
                                <Button variant="flat" className="text-white/60" onClick={() => setIsDeepWindowOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="bg-white text-black font-bold px-8 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    APPLY FILTERS
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
