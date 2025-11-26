"use client";

import { HeroUIProvider } from "@heroui/react";
import { UserProvider } from "@/contexts/UserContext";
import { MarketProvider } from "@/contexts/MarketContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ToastProvider>
                <UserProvider>
                    <CurrencyProvider>
                        <MarketProvider>
                            {children}
                        </MarketProvider>
                    </CurrencyProvider>
                </UserProvider>
            </ToastProvider>
        </HeroUIProvider>
    );
}