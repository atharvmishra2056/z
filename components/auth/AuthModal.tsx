"use client";

import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { Mail, Disc, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import EmailAuthForm from "./EmailAuthForm";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login } = useUser();

    const handleLogin = async (provider: string) => {
        if (provider === 'email') {
            setShowEmailForm(true);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        try {
            await login(provider);
            onClose();
        } catch (error: any) {
            setErrorMessage(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSuccess = () => {
        setShowEmailForm(false);
        onClose();
    };

    const handleEmailError = (message: string) => {
        setErrorMessage(message);
    };

    const handleBack = () => {
        setShowEmailForm(false);
        setErrorMessage(null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            classNames={{
                base: "bg-transparent shadow-none",
                wrapper: "z-[9999]",
            }}
            placement="center"
        >
            <ModalContent className="p-0 overflow-visible">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-tahoe rounded-[2rem] p-8 w-full max-w-md mx-auto overflow-hidden relative"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-brand-primary/20 blur-[60px] rounded-full pointer-events-none" />

                    <ModalHeader className="flex flex-col items-center gap-2 pb-8 pt-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2 border border-white/10 shadow-inner">
                            <div className="w-6 h-6 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Identify Yourself
                        </h2>
                        <p className="text-white/40 text-sm font-mono text-center">
                            ACCESS_LEVEL: CLASSIFIED // LOGIN REQUIRED
                        </p>
                    </ModalHeader>

                    <ModalBody className="flex flex-col gap-4 px-2 pb-4">
                        {showEmailForm ? (
                            <>
                                <Button
                                    variant="light"
                                    startContent={<ArrowLeft size={18} />}
                                    onClick={handleBack}
                                    className="self-start text-white/60 hover:text-white"
                                >
                                    Back
                                </Button>
                                <EmailAuthForm
                                    onSuccess={handleEmailSuccess}
                                    onError={handleEmailError}
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    size="lg"
                                    className="bg-[#5865F2] text-white font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-[#5865F2]/20"
                                    startContent={<Disc size={20} />}
                                    isLoading={isLoading}
                                    onClick={() => handleLogin('discord')}
                                    isDisabled
                                >
                                    Continue with Discord
                                </Button>

                                <Button
                                    size="lg"
                                    className="bg-white text-black font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
                                    startContent={
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    }
                                    isLoading={isLoading}
                                    onClick={() => handleLogin('google')}
                                >
                                    Continue with Google
                                </Button>

                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-black/60 px-2 text-white/30 font-mono">Or via encrypted link</span>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    variant="bordered"
                                    className="border-white/10 text-white hover:bg-white/5 font-medium"
                                    startContent={<Mail size={20} />}
                                    onClick={() => handleLogin('email')}
                                >
                                    Continue with Email
                                </Button>
                            </>
                        )}

                        {errorMessage && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                                {errorMessage}
                            </div>
                        )}

                        <p className="text-center text-[10px] text-white/20 mt-4 max-w-xs mx-auto leading-relaxed">
                            By accessing the Tactical Ledger, you agree to our Terms of Service and Privacy Protocol.
                            All actions are logged.
                        </p>
                    </ModalBody>
                </motion.div>
            </ModalContent>
        </Modal>
    );
}
