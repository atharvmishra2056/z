import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "KXW x KuzzBoost | Spatial Marketplace",
    description: "The premium marketplace for gamers.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className='dark'>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}