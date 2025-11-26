"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Mail, Lock, User } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface EmailAuthFormProps {
    onSuccess: () => void;
    onError: (message: string) => void;
}

export default function EmailAuthForm({ onSuccess, onError }: EmailAuthFormProps) {
    const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { loginWithEmail, signupWithEmail, resetPassword } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === 'login') {
                await loginWithEmail(email, password);
                onSuccess();
            } else if (mode === 'signup') {
                if (!username.trim()) {
                    throw new Error("Username is required");
                }
                await signupWithEmail(email, password, username);
                onSuccess();
            } else if (mode === 'reset') {
                await resetPassword(email);
                onError("Password reset email sent! Check your inbox.");
                setMode('login');
            }
        } catch (error: any) {
            onError(error.message || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
                <Input
                    type="text"
                    label="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    startContent={<User size={18} className="text-white/40" />}
                    classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/5 border border-white/10 hover:border-white/20"
                    }}
                    required
                />
            )}

            <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail size={18} className="text-white/40" />}
                labelPlacement="outside"
                classNames={{
                    label: "text-white/60 font-medium",
                    input: "text-white placeholder:text-white/30",
                    inputWrapper: "bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                }}
                required
            />

            {mode !== 'reset' && (
                <Input
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    startContent={<Lock size={18} className="text-white/40" />}
                    classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/5 border border-white/10 hover:border-white/20"
                    }}
                    required
                />
            )}

            <Button
                type="submit"
                size="lg"
                className="w-full bg-white text-black font-bold"
                isLoading={isLoading}
            >
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </Button>

            <div className="flex justify-between text-xs text-white/40">
                {mode === 'login' && (
                    <>
                        <button
                            type="button"
                            onClick={() => setMode('signup')}
                            className="hover:text-white transition-colors"
                        >
                            Create account
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('reset')}
                            className="hover:text-white transition-colors"
                        >
                            Forgot password?
                        </button>
                    </>
                )}
                {mode === 'signup' && (
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="hover:text-white transition-colors"
                    >
                        Already have an account? Sign in
                    </button>
                )}
                {mode === 'reset' && (
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="hover:text-white transition-colors"
                    >
                        Back to sign in
                    </button>
                )}
            </div>
        </form>
    );
}
