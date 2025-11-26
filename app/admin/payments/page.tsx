"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Chip, Spinner } from "@heroui/react";
import { useUser } from '@/contexts/UserContext';
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

// Mock data type
interface PaymentRequest {
    id: string;
    user_id: string;
    amount: number;
    currency: string;
    method: 'upi' | 'crypto';
    status: 'pending' | 'completed' | 'rejected';
    created_at: any;
    net_amount_usd?: number;
    fee?: number;
}

export default function PendingPaymentsPage() {
    const { username } = useUser();
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Fetch real data from Firestore
    useEffect(() => {
        const q = query(
            collection(db, "payment_requests"),
            where("status", "==", "pending"),
            orderBy("created_at", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate() || new Date()
            })) as PaymentRequest[];
            setRequests(fetchedRequests);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching payments:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
        setProcessingId(requestId);
        try {
            const response = await fetch('/api/admin/payments/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    action,
                    adminId: username || 'admin'
                })
            });

            if (!response.ok) throw new Error('Action failed');

            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== requestId));

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process request');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Pending Payments</h2>
                <Chip color="warning" variant="flat">{requests.length} Pending</Chip>
            </div>

            {requests.length === 0 ? (
                <Card className="bg-white/5 border border-white/10">
                    <CardBody className="p-10 text-center text-gray-400">
                        No pending payment requests.
                    </CardBody>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {requests.map((req) => (
                        <Card key={req.id} className="bg-white/5 border border-white/10">
                            <CardBody className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-white text-lg">
                                            {req.method === 'upi' ? '₹' : ''}{req.amount} {req.currency}
                                        </span>
                                        <Chip size="sm" color={req.method === 'upi' ? 'primary' : 'secondary'} variant="flat">
                                            {req.method.toUpperCase()}
                                        </Chip>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        User: <span className="text-white">{req.user_id}</span> •
                                        Net: <span className="text-green-400">${req.net_amount_usd?.toFixed(2)} USD</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        ID: {req.id} • {new Date(req.created_at).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        color="danger"
                                        variant="flat"
                                        onPress={() => handleAction(req.id, 'reject')}
                                        isLoading={processingId === req.id}
                                        isDisabled={!!processingId}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        color="success"
                                        onPress={() => handleAction(req.id, 'approve')}
                                        isLoading={processingId === req.id}
                                        isDisabled={!!processingId}
                                    >
                                        Approve & Add Funds
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
