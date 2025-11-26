"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider, Button, Checkbox, Select, SelectItem, Input, Switch, Chip } from "@heroui/react";
import { Filter, X, ChevronDown, RotateCcw } from "lucide-react";

// Filter configurations based on z.json API spec
export interface FilterConfig {
    pmin?: number;
    pmax?: number;
    title?: string;
    order_by?: string;
    origin?: string[];
    not_origin?: string[];
    nsb?: boolean;
    sb?: boolean;
    // Valorant specific
    valorant_level_min?: number;
    valorant_level_max?: number;
    valorant_smin?: number;
    valorant_smax?: number;
    valorant_knife_min?: number;
    valorant_knife_max?: number;
    vp_min?: number;
    vp_max?: number;
    valorant_region?: string[];
    valorant_rank_type?: string[];
    amin?: number;
    amax?: number;
    // Steam specific
    hours_played?: number;
    game_int?: number[];
    // Fortnite specific
    fn_skins_min?: number;
    fn_skins_max?: number;
    fn_vbucks_min?: number;
    fn_vbucks_max?: number;
    // General
    inv_min?: number;
    inv_max?: number;
}

interface AdvancedFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    selectedGame: string;
    filters: FilterConfig;
    onFiltersChange: (filters: FilterConfig) => void;
    onApply: () => void;
}

// Valorant regions from API
const VALORANT_REGIONS = [
    { value: "eu", label: "Europe" },
    { value: "na", label: "North America" },
    { value: "ap", label: "Asia Pacific" },
    { value: "kr", label: "Korea" },
    { value: "br", label: "Brazil" },
    { value: "latam", label: "Latin America" },
];

// Valorant rank types
const VALORANT_RANK_TYPES = [
    { value: "ranked", label: "Ranked" },
    { value: "ranked_ready", label: "Ranked Ready" },
    { value: "unrated", label: "Unrated" },
];

// Account origins
const ORIGIN_TYPES = [
    { value: "brute", label: "Brute" },
    { value: "fishing", label: "Phishing" },
    { value: "stealer", label: "Stealer" },
    { value: "autoreg", label: "Auto-reg" },
    { value: "personal", label: "Personal" },
    { value: "resale", label: "Resale" },
];

// Order by options
const ORDER_OPTIONS = [
    { value: "price_to_up", label: "Price: Low to High" },
    { value: "price_to_down", label: "Price: High to Low" },
    { value: "pdate_to_down", label: "Newest First" },
    { value: "pdate_to_up", label: "Oldest First" },
];

// Segmented control component
function SegmentedControl({ 
    label, 
    value, 
    onChange,
    options = ["No Matter", "No", "Yes"]
}: { 
    label: string; 
    value: boolean | null; 
    onChange: (v: boolean | null) => void;
    options?: string[];
}) {
    return (
        <div className="bg-black/40 p-1 rounded-xl flex text-xs">
            <div className="px-3 py-2 text-white/40 min-w-[80px]">{label}</div>
            {options.map((opt, i) => {
                const optValue = i === 0 ? null : i === 1 ? false : true;
                const isActive = value === optValue;
                return (
                    <button
                        key={opt}
                        onClick={() => onChange(optValue)}
                        className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                            isActive 
                                ? "bg-white/10 text-white font-medium" 
                                : "text-white/50 hover:text-white/70 hover:bg-white/5"
                        }`}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
}

// Range input component
function RangeInput({
    label,
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
    minPlaceholder = "Min",
    maxPlaceholder = "Max",
}: {
    label: string;
    minValue?: number;
    maxValue?: number;
    onMinChange: (v: number | undefined) => void;
    onMaxChange: (v: number | undefined) => void;
    minPlaceholder?: string;
    maxPlaceholder?: string;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm text-white/60">{label}</label>
            <div className="grid grid-cols-2 gap-3">
                <Input
                    type="number"
                    placeholder={minPlaceholder}
                    value={minValue?.toString() || ""}
                    onChange={(e) => onMinChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    size="sm"
                    variant="bordered"
                    classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/5 border-white/10 hover:border-white/20"
                    }}
                />
                <Input
                    type="number"
                    placeholder={maxPlaceholder}
                    value={maxValue?.toString() || ""}
                    onChange={(e) => onMaxChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    size="sm"
                    variant="bordered"
                    classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/5 border-white/10 hover:border-white/20"
                    }}
                />
            </div>
        </div>
    );
}

export default function AdvancedFilters({
    isOpen,
    onClose,
    selectedGame,
    filters,
    onFiltersChange,
    onApply,
}: AdvancedFiltersProps) {
    const [localFilters, setLocalFilters] = useState<FilterConfig>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const updateFilter = <K extends keyof FilterConfig>(key: K, value: FilterConfig[K]) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        onFiltersChange(localFilters);
        onApply();
        onClose();
    };

    const handleReset = () => {
        setLocalFilters({});
        onFiltersChange({});
    };

    const getGameTitle = () => {
        const titles: Record<string, string> = {
            valorant: "VALORANT",
            steam: "STEAM",
            fortnite: "FORTNITE",
            minecraft: "MINECRAFT",
            "clash-of-clans": "CLASH OF CLANS",
            "epic-games": "EPIC GAMES",
            battlenet: "BATTLE.NET",
            warface: "WARFACE",
        };
        return titles[selectedGame] || "ALL GAMES";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed inset-x-4 top-20 bottom-20 max-w-5xl mx-auto glass-deep rounded-3xl z-[70] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                                    <Filter className="text-brand-primary" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white">Advanced Filters</h2>
                                    <p className="text-white/40 text-sm">{getGameTitle()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={handleReset}
                                    startContent={<RotateCcw size={14} />}
                                    className="text-white/60"
                                >
                                    Reset
                                </Button>
                                <Button isIconOnly variant="light" onClick={onClose}>
                                    <X className="text-white/60" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                
                                {/* Column 1: Global Filters */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-2 border-b border-white/10">
                                        Global Filters
                                    </h4>

                                    {/* Price Range */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Price Range (USD)</span>
                                            <span className="text-brand-primary font-mono">
                                                ${localFilters.pmin || 0} - ${localFilters.pmax || '∞'}
                                            </span>
                                        </div>
                                        <Slider
                                            size="sm"
                                            step={5}
                                            minValue={0}
                                            maxValue={1000}
                                            value={[localFilters.pmin || 0, localFilters.pmax || 1000]}
                                            onChange={(v) => {
                                                const [min, max] = v as number[];
                                                updateFilter('pmin', min);
                                                updateFilter('pmax', max === 1000 ? undefined : max);
                                            }}
                                            className="max-w-full"
                                            color="secondary"
                                        />
                                    </div>

                                    {/* Sort Order */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60">Sort By</label>
                                        <Select
                                            placeholder="Select order"
                                            selectedKeys={localFilters.order_by ? [localFilters.order_by] : []}
                                            onSelectionChange={(keys) => {
                                                const key = Array.from(keys)[0] as string;
                                                updateFilter('order_by', key);
                                            }}
                                            size="sm"
                                            classNames={{
                                                trigger: "bg-white/5 border-white/10",
                                                popoverContent: "bg-black/95 border border-white/10"
                                            }}
                                        >
                                            {ORDER_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>

                                    {/* Account Origin */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60">Account Origin</label>
                                        <div className="flex flex-wrap gap-2">
                                            {ORIGIN_TYPES.map(origin => (
                                                <Chip
                                                    key={origin.value}
                                                    variant={localFilters.origin?.includes(origin.value) ? "solid" : "bordered"}
                                                    color={localFilters.origin?.includes(origin.value) ? "secondary" : "default"}
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        const current = localFilters.origin || [];
                                                        const newOrigins = current.includes(origin.value)
                                                            ? current.filter(o => o !== origin.value)
                                                            : [...current, origin.value];
                                                        updateFilter('origin', newOrigins.length ? newOrigins : undefined);
                                                    }}
                                                >
                                                    {origin.label}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sticky Buy */}
                                    <SegmentedControl
                                        label="Sticky Buy"
                                        value={localFilters.sb === true ? true : localFilters.nsb === true ? false : null}
                                        onChange={(v) => {
                                            if (v === null) {
                                                updateFilter('sb', undefined);
                                                updateFilter('nsb', undefined);
                                            } else if (v === true) {
                                                updateFilter('sb', true);
                                                updateFilter('nsb', undefined);
                                            } else {
                                                updateFilter('sb', undefined);
                                                updateFilter('nsb', true);
                                            }
                                        }}
                                    />
                                </div>

                                {/* Column 2: Game-Specific Filters */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-bold text-brand-primary/80 uppercase tracking-widest pb-2 border-b border-brand-primary/20">
                                        {getGameTitle()} Specifics
                                    </h4>

                                    {/* Valorant Filters */}
                                    {selectedGame === 'valorant' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-sm text-white/60">Region</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {VALORANT_REGIONS.map(region => (
                                                        <Chip
                                                            key={region.value}
                                                            variant={localFilters.valorant_region?.includes(region.value) ? "solid" : "bordered"}
                                                            color={localFilters.valorant_region?.includes(region.value) ? "danger" : "default"}
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                const current = localFilters.valorant_region || [];
                                                                const newRegions = current.includes(region.value)
                                                                    ? current.filter(r => r !== region.value)
                                                                    : [...current, region.value];
                                                                updateFilter('valorant_region', newRegions.length ? newRegions : undefined);
                                                            }}
                                                        >
                                                            {region.label}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm text-white/60">Rank Type</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {VALORANT_RANK_TYPES.map(type => (
                                                        <Chip
                                                            key={type.value}
                                                            variant={localFilters.valorant_rank_type?.includes(type.value) ? "solid" : "bordered"}
                                                            color={localFilters.valorant_rank_type?.includes(type.value) ? "warning" : "default"}
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                const current = localFilters.valorant_rank_type || [];
                                                                const newTypes = current.includes(type.value)
                                                                    ? current.filter(t => t !== type.value)
                                                                    : [...current, type.value];
                                                                updateFilter('valorant_rank_type', newTypes.length ? newTypes : undefined);
                                                            }}
                                                        >
                                                            {type.label}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            </div>

                                            <RangeInput
                                                label="Account Level"
                                                minValue={localFilters.valorant_level_min}
                                                maxValue={localFilters.valorant_level_max}
                                                onMinChange={(v) => updateFilter('valorant_level_min', v)}
                                                onMaxChange={(v) => updateFilter('valorant_level_max', v)}
                                            />

                                            <RangeInput
                                                label="Skins Count"
                                                minValue={localFilters.valorant_smin}
                                                maxValue={localFilters.valorant_smax}
                                                onMinChange={(v) => updateFilter('valorant_smin', v)}
                                                onMaxChange={(v) => updateFilter('valorant_smax', v)}
                                            />

                                            <RangeInput
                                                label="Knives Count"
                                                minValue={localFilters.valorant_knife_min}
                                                maxValue={localFilters.valorant_knife_max}
                                                onMinChange={(v) => updateFilter('valorant_knife_min', v)}
                                                onMaxChange={(v) => updateFilter('valorant_knife_max', v)}
                                            />

                                            <RangeInput
                                                label="Agents Count"
                                                minValue={localFilters.amin}
                                                maxValue={localFilters.amax}
                                                onMinChange={(v) => updateFilter('amin', v)}
                                                onMaxChange={(v) => updateFilter('amax', v)}
                                            />
                                        </>
                                    )}

                                    {/* Steam Filters */}
                                    {selectedGame === 'steam' && (
                                        <>
                                            <RangeInput
                                                label="Hours Played"
                                                minValue={localFilters.hours_played}
                                                maxValue={undefined}
                                                onMinChange={(v) => updateFilter('hours_played', v)}
                                                onMaxChange={() => {}}
                                                minPlaceholder="Min hours"
                                                maxPlaceholder="N/A"
                                            />

                                            <RangeInput
                                                label="Inventory Value ($)"
                                                minValue={localFilters.inv_min}
                                                maxValue={localFilters.inv_max}
                                                onMinChange={(v) => updateFilter('inv_min', v)}
                                                onMaxChange={(v) => updateFilter('inv_max', v)}
                                            />
                                        </>
                                    )}

                                    {/* Fortnite Filters */}
                                    {selectedGame === 'fortnite' && (
                                        <>
                                            <RangeInput
                                                label="Skins Count"
                                                minValue={localFilters.fn_skins_min}
                                                maxValue={localFilters.fn_skins_max}
                                                onMinChange={(v) => updateFilter('fn_skins_min', v)}
                                                onMaxChange={(v) => updateFilter('fn_skins_max', v)}
                                            />

                                            <RangeInput
                                                label="V-Bucks"
                                                minValue={localFilters.fn_vbucks_min}
                                                maxValue={localFilters.fn_vbucks_max}
                                                onMinChange={(v) => updateFilter('fn_vbucks_min', v)}
                                                onMaxChange={(v) => updateFilter('fn_vbucks_max', v)}
                                            />
                                        </>
                                    )}

                                    {/* Generic message for other games */}
                                    {!['valorant', 'steam', 'fortnite'].includes(selectedGame) && (
                                        <p className="text-white/40 text-sm italic">
                                            Game-specific filters coming soon for {getGameTitle()}.
                                        </p>
                                    )}
                                </div>

                                {/* Column 3: Economy & Assets */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-bold text-green-400/80 uppercase tracking-widest pb-2 border-b border-green-400/20">
                                        Economy & Assets
                                    </h4>

                                    {selectedGame === 'valorant' && (
                                        <>
                                            <RangeInput
                                                label="Valorant Points (VP)"
                                                minValue={localFilters.vp_min}
                                                maxValue={localFilters.vp_max}
                                                onMinChange={(v) => updateFilter('vp_min', v)}
                                                onMaxChange={(v) => updateFilter('vp_max', v)}
                                            />
                                        </>
                                    )}

                                    <RangeInput
                                        label="Inventory Value ($)"
                                        minValue={localFilters.inv_min}
                                        maxValue={localFilters.inv_max}
                                        onMinChange={(v) => updateFilter('inv_min', v)}
                                        onMaxChange={(v) => updateFilter('inv_max', v)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-between items-center">
                            <p className="text-white/40 text-sm">
                                {Object.keys(localFilters).filter(k => localFilters[k as keyof FilterConfig] !== undefined).length} filters active
                            </p>
                            <div className="flex gap-3">
                                <Button 
                                    variant="flat" 
                                    className="text-white/60" 
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    className="bg-brand-primary text-black font-bold px-8"
                                    onClick={handleApply}
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
