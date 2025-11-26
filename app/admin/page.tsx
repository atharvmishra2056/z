"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Spinner } from "@heroui/react";
import { db } from "@/lib/firebase";
import { collection, query, where, getCountFromServer, getDocs, orderBy, limit } from "firebase/firestore";

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { title: "Total Users", value: "...", change: "Loading...", color: "text-blue-400" },
        { title: "Pending Payments", value: "...", change: "Loading...", color: "text-yellow-400" },
        { title: "Total Revenue", value: "...", change: "Loading...", color: "text-green-400" },
        { title: "Active Orders", value: "0", change: "Coming Soon", color: "text-purple-400" },
    ]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Total Users
                const usersColl = collection(db, "users");
                const usersSnapshot = await getCountFromServer(usersColl);
                const totalUsers = usersSnapshot.data().count;

                // 2. Pending Payments
                const paymentsColl = collection(db, "payment_requests");
                const pendingQuery = query(paymentsColl, where("status", "==", "pending"));
                const pendingSnapshot = await getCountFromServer(pendingQuery);
                const pendingPayments = pendingSnapshot.data().count;

                // 3. Total Revenue (Approximation from completed deposits)
                // Note: For large datasets, use a dedicated stats document updated via Cloud Functions
                const completedQuery = query(paymentsColl, where("status", "==", "completed"));
                const completedSnapshot = await getDocs(completedQuery);
                let totalRevenue = 0;
                completedSnapshot.forEach(doc => {
                    const data = doc.data();
                    totalRevenue += data.net_amount_usd || 0;
                });

                setStats([
                    { title: "Total Users", value: totalUsers.toString(), change: "Live", color: "text-blue-400" },
                    { title: "Pending Payments", value: pendingPayments.toString(), change: pendingPayments > 0 ? "Action Needed" : "All Clear", color: "text-yellow-400" },
                    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, change: "Lifetime", color: "text-green-400" },
                    { title: "Active Orders", value: "-", change: "Coming Soon", color: "text-purple-400" },
                ]);

                // 4. Recent Activity (Recent Payments)
                const recentPaymentsQuery = query(paymentsColl, orderBy("created_at", "desc"), limit(5));
                const recentPaymentsSnapshot = await getDocs(recentPaymentsQuery);
                const activities = recentPaymentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    type: doc.data().status === 'pending' ? 'New Request' : 'Payment Processed',
                    description: `${doc.data().method.toUpperCase()} payment of ${doc.data().amount}`,
                    time: doc.data().created_at?.toDate() || new Date(),
                    status: doc.data().status
                }));
                setRecentActivity(activities);

            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-gray-400">Real-time system metrics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="bg-white/5 border border-white/10 backdrop-blur-sm">
                        <CardBody className="p-6">
                            <p className="text-sm text-gray-400 mb-2">{stat.title}</p>
                            <div className="flex justify-between items-end">
                                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 ${stat.color}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Section */}
            <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
                <CardBody className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Recent User Registrations</h3>
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-gray-500">No recent activity.</p>
                        ) : (
                            recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                                        <div>
                                            <p className="text-white font-medium">{activity.type}</p>
                                            <p className="text-xs text-gray-500">{activity.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {activity.time.toLocaleTimeString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
