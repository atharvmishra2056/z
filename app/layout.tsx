import type { Metadata } from "next";
import { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "KXW x KuzzBoost | Premium Gaming Marketplace",
    description: "The best marketplace for gamers, tech enthusiasts, streamers, and content creators. Find all your account needs here.",
    keywords: ["gaming accounts", "steam", "valorant", "epic games", "marketplace", "gaming", "accounts"],
    authors: [{ name: "KXW x KuzzBoost" }],
    creator: "KXW x KuzzBoost",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://kxwkuzzboost.com",
        title: "KXW x KuzzBoost | Premium Gaming Marketplace",
        description: "The best marketplace for gamers, tech enthusiasts, streamers, and content creators.",
        siteName: "KXW x KuzzBoost",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    return (
        <html lang="en" className="dark">
        <head>
            <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="font-satoshi bg-black antialiased">
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}