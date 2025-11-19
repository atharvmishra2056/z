// types/market.ts

export interface Seller {
    userid: number;
    username: string;
    avatardate: number;
    solditemscount: number;
    activeitemscount: number;
    isbanned: number;
    displaystylegroupid: number;
    restorepercents: number;
}

export interface MarketItem {
    itemid: number;
    item_id?: number; // LZT uses item_id
    itemstate: string;
    categoryid: number;
    publisheddate: number;
    title: string;
    description: string;
    price: number;
    rubprice?: number;
    pricecurrency: string;
    viewcount: number;
    thumbnail?: string;
    tags?: string[];
    seller: Seller;
    img?: string;
    // Game-specific fields
    steamid?: string;
    steamlevel?: number;
    steamgames?: number;
    valorantrank?: string;
    valorantskins?: number;
    [key: string]: any;
}

export interface MarketItemListResponse {
    items: MarketItem[];
    totalItems: number;
    perPage: number;
    page: number;
    hasNextPage: boolean;
    links?: any;
    meta?: any;
}

export interface MarketFilters {
    pmin?: number;
    pmax?: number;
    order_by?: 'price_to_up' | 'price_to_down' | 'date_to_down' | 'date_to_up';
    title?: string;
    [key: string]: string | number | undefined;
}

export type CategoryType =
    | 'steam'
    | 'valorant'
    | 'epicgames'
    | 'battlenet'
    | 'origin'
    | 'minecraft'
    | 'fortnite'
    | 'warface';

export const CATEGORY_MAP: Record<string, CategoryType> = {
    'Steam': 'steam',
    'Valorant': 'valorant',
    'EA Games': 'origin',
    'C.O.C': 'fortnite',
    'Minecraft': 'minecraft',
    'Battlenet': 'battlenet',
    'Epic Games': 'epicgames',
    'Warface': 'warface',
};