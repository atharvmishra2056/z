"use client";

import React from 'react';
import UPIPayment from '@/components/payment/UPIPayment';
import CryptoPayment from '@/components/payment/CryptoPayment';
import Navbar from '@/components/Navbar';
import { Tabs, Tab } from "@heroui/react";

export default function AddFundsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-brand-primary/30">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/20 via-black to-black pointer-events-none" />

            <Navbar />

            <main className="relative pt-32 pb-20 px-4 container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Add Funds
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Top up your wallet securely using UPI or Crypto.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-8">
                    <Tabs aria-label="Payment Options" color="primary" variant="bordered" className="w-full max-w-md">
                        <Tab key="upi" title="UPI (India)">
                            <UPIPayment />
                        </Tab>
                        <Tab key="crypto" title="Crypto (Global)">
                            <CryptoPayment />
                        </Tab>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
