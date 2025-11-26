"use client";

import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter, usePathname } from 'next/navigation';
import { Button, Card, CardBody } from "@heroui/react";
import Link from 'next/link';

// Icons (using text for now, replace with Lucide icons later)
const ICONS = {
    dashboard: "📊",
    payments: "💰",
    users: "👥",
    logs: "📜",
    back: "⬅️"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { username, isAuthenticated, email, loading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    // Admin email list - Add your Gmail here
    const ADMIN_EMAILS: string[] = [
        "atharv.kuzzboost@gmail.com"
    ];

    // TODO: Implement proper Firebase admin role system
    // For now, forcing access for authenticated users
    const isAdmin = isAuthenticated; // Temporarily bypassing email check

    // Debug log to see what email we're getting
    React.useEffect(() => {
        if (isAuthenticated) {
            console.log('🔍 Admin Check - User Email:', email);
            console.log('🔍 Admin Check - Expected:', ADMIN_EMAILS);
            console.log('🔍 Admin Check - Match:', ADMIN_EMAILS.includes(email || ''));
        }
    }, [email, isAuthenticated]);

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: ICONS.dashboard },
        { name: 'Pending Payments', path: '/admin/payments', icon: ICONS.payments },
        { name: 'User Management', path: '/admin/users', icon: ICONS.users },
        { name: 'Activity Logs', path: '/admin/logs', icon: ICONS.logs },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl fixed h-full z-50">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-white">
                        Admin Panel
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">v1.5.0 (Beta)</p>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path} className="block">
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/50'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}>
                                    <span>{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <Button
                        as={Link}
                        href="/"
                        variant="flat"
                        className="w-full justify-start gap-3 text-gray-400"
                    >
                        {ICONS.back} Back to Store
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
