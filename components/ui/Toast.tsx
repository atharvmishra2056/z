"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

const colors = {
    success: "border-green-500/30 bg-green-500/10",
    error: "border-red-500/30 bg-red-500/10",
    warning: "border-yellow-500/30 bg-yellow-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
};

const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
};

export default function Toast({ id, type, title, message, onClose }: ToastProps) {
    const Icon = icons[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
                "glass-panel border rounded-xl p-4 min-w-[300px] max-w-[400px] shadow-2xl",
                colors[type]
            )}
        >
            <div className="flex items-start gap-3">
                <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconColors[type])} />
                <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{title}</p>
                    {message && (
                        <p className="text-white/60 text-xs mt-1">{message}</p>
                    )}
                </div>
                <button
                    onClick={() => onClose(id)}
                    className="text-white/40 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    );
}

// Toast Container Component
interface ToastContainerProps {
    toasts: Array<{
        id: string;
        type: ToastType;
        title: string;
        message?: string;
    }>;
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={onClose} />
                ))}
            </AnimatePresence>
        </div>
    );
}

// Hook for managing toasts (to be used with ToastContext)
import { useState, useCallback } from "react";

export function useToastState() {
    const [toasts, setToasts] = useState<Array<{
        id: string;
        type: ToastType;
        title: string;
        message?: string;
    }>>([]);

    const addToast = useCallback((toast: Omit<typeof toasts[0], "id">) => {
        const id = `toast-${Date.now()}`;
        setToasts((prev) => [...prev, { ...toast, id }]);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
        
        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback((title: string, message?: string) => {
        return addToast({ type: "success", title, message });
    }, [addToast]);

    const error = useCallback((title: string, message?: string) => {
        return addToast({ type: "error", title, message });
    }, [addToast]);

    const warning = useCallback((title: string, message?: string) => {
        return addToast({ type: "warning", title, message });
    }, [addToast]);

    const info = useCallback((title: string, message?: string) => {
        return addToast({ type: "info", title, message });
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };
}
