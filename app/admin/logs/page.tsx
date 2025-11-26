"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Chip, Spinner } from "@heroui/react";

interface LogEntry {
    id: string;
    admin_uid: string;
    action: string;
    target_user_id: string;
    details: any;
    timestamp: any;
}

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data fetch
    useEffect(() => {
        setTimeout(() => {
            setLogs([
                {
                    id: 'log_1',
                    admin_uid: 'admin_1',
                    action: 'approve_payment',
                    target_user_id: 'user_881',
                    details: { request_id: 'req_123', amount: 500 },
                    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 mins ago
                },
                {
                    id: 'log_2',
                    admin_uid: 'admin_1',
                    action: 'manual_balance_add',
                    target_user_id: 'user_992',
                    details: { amount: 20, reason: 'Bonus' },
                    timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Activity Logs</h2>

            <div className="space-y-4">
                {logs.map((log) => (
                    <Card key={log.id} className="bg-white/5 border border-white/10">
                        <CardBody className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Chip size="sm" color="primary" variant="dot">
                                        {log.action.replace(/_/g, ' ').toUpperCase()}
                                    </Chip>
                                    <span className="text-gray-400 text-sm">by {log.admin_uid}</span>
                                </div>
                                <div className="text-white">
                                    Target User: <span className="font-mono text-brand-primary">{log.target_user_id}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Details: {JSON.stringify(log.details)}
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleString()}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
