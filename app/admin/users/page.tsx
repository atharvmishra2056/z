"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Avatar } from "@heroui/react";
import { useUser } from '@/contexts/UserContext';
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

// Mock user type
interface User {
    id: string;
    username: string;
    email: string;
    balance: number;
    role: string;
    status: 'active' | 'banned';
}

export default function UserManagementPage() {
    const { username } = useUser();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [topupAmount, setTopupAmount] = useState("");
    const [topupReason, setTopupReason] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch real data from Firestore
    useEffect(() => {
        const q = query(collection(db, "users"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                username: doc.data().username || 'Unknown',
                email: doc.data().email || 'No Email',
                balance: doc.data().balance || 0,
                role: doc.data().role || 'user',
                status: doc.data().status || 'active',
                ...doc.data()
            })) as User[];
            setUsers(fetchedUsers);
        }, (error) => {
            console.error("Error fetching users:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleTopupClick = (user: User) => {
        setSelectedUser(user);
        setTopupAmount("");
        setTopupReason("");
        onOpen();
    };

    const handleTopupSubmit = async (onClose: () => void) => {
        if (!selectedUser || !topupAmount) return;

        setLoading(true);
        try {
            const response = await fetch('/api/admin/users/topup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    amount: parseFloat(topupAmount),
                    adminId: username || 'admin',
                    reason: topupReason
                })
            });

            if (!response.ok) throw new Error('Top-up failed');

            // Update local state
            setUsers(prev => prev.map(u =>
                u.id === selectedUser.id
                    ? { ...u, balance: u.balance + parseFloat(topupAmount) }
                    : u
            ));

            onClose();
            alert('Balance updated successfully');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update balance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">User Management</h2>

            <div className="grid gap-4">
                {users.map((user) => (
                    <Card key={user.id} className="bg-white/5 border border-white/10">
                        <CardBody className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <Avatar src={`https://i.pravatar.cc/150?u=${user.username}`} />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{user.username}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {user.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400">{user.email}</div>
                                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">Balance</div>
                                    <div className="text-xl font-bold text-brand-primary">${user.balance.toFixed(2)}</div>
                                </div>

                                <Button
                                    color="primary"
                                    variant="flat"
                                    onPress={() => handleTopupClick(user)}
                                >
                                    Add Funds
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
                <ModalContent className="bg-zinc-900 border border-white/10 text-white">
                    {(onClose) => (
                        <>
                            <ModalHeader>Add Funds to {selectedUser?.username}</ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <Input
                                        label="Amount (USD)"
                                        placeholder="0.00"
                                        type="number"
                                        value={topupAmount}
                                        onChange={(e) => setTopupAmount(e.target.value)}
                                        variant="bordered"
                                    />
                                    <Input
                                        label="Reason / Note"
                                        placeholder="e.g. Manual deposit correction"
                                        value={topupReason}
                                        onChange={(e) => setTopupReason(e.target.value)}
                                        variant="bordered"
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => handleTopupSubmit(onClose)}
                                    isLoading={loading}
                                >
                                    Confirm Top-up
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
