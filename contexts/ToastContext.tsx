"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "success") => {
        const id = Date.now().toString();
        const toast: Toast = { id, type, message };

        setToasts(prev => [...prev, toast]);

        // Auto-remove after 3s
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            className={`glass-panel rounded-xl p-4 min-w-[300px] flex items-center gap-3 ${toast.type === "success" ? "border-green-500/30" :
                                    toast.type === "error" ? "border-red-500/30" :
                                        "border-blue-500/30"
                                }`}
                        >
                            {toast.type === "success" && <Check className="text-green-500" size={20} />}
                            {toast.type === "error" && <X className="text-red-500" size={20} />}
                            {toast.type === "info" && <AlertCircle className="text-blue-500" size={20} />}

                            <p className="text-white text-sm flex-1">{toast.message}</p>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
