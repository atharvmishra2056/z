"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'USD' | 'INR' | 'GBP' | 'EUR';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    rates: Record<Currency, number>;
    formatPrice: (amountInUSD: number) => string;
    convertPrice: (amountInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_RATES: Record<Currency, number> = {
    USD: 1,
    INR: 83.5,
    GBP: 0.79,
    EUR: 0.92
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [rates, setRates] = useState<Record<Currency, number>>(DEFAULT_RATES);

    // Load saved currency preference
    useEffect(() => {
        const saved = localStorage.getItem('kxw-currency');
        if (saved && Object.keys(DEFAULT_RATES).includes(saved)) {
            setCurrency(saved as Currency);
        }
    }, []);

    // Save currency preference
    useEffect(() => {
        localStorage.setItem('kxw-currency', currency);
    }, [currency]);

    // Fetch real-time rates
    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Using a free API (exchangerate-api.com)
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await response.json();

                setRates({
                    USD: 1,
                    INR: data.rates.INR,
                    GBP: data.rates.GBP,
                    EUR: data.rates.EUR
                });
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
                // Fallback to default rates is automatic since we initialized with them
            }
        };

        fetchRates();
        // Refresh every hour
        const interval = setInterval(fetchRates, 1000 * 60 * 60);
        return () => clearInterval(interval);
    }, []);

    const convertPrice = (amountInUSD: number): number => {
        return amountInUSD * rates[currency];
    };

    const formatPrice = (amountInUSD: number): string => {
        const converted = convertPrice(amountInUSD);

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatPrice, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
