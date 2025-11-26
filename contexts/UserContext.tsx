"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MarketItem } from "@/types/api-types";
import { auth, db } from "@/lib/firebase";
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onIdTokenChanged,
    User as FirebaseUser
} from "firebase/auth";
import {
    doc,
    onSnapshot,
    setDoc,
    getDoc,
    serverTimestamp,
    collection,
    query,
    orderBy,
    limit,
    getDocs
} from "firebase/firestore";

export interface Transaction {
    id: string;
    type: "purchase" | "deposit" | "withdrawal" | "refund";
    amount: number;
    description: string;
    timestamp: Date;
    status?: "pending" | "completed" | "failed";
    item_id?: number;
    lzt_item_id?: number;
}

export interface PurchaseResult {
    success: boolean;
    transactionId?: string;
    credentialsId?: string;
    error?: string;
    refunded?: boolean;
}

interface UserState {
    isAuthenticated: boolean;
    username: string | null;
    email: string | null;
    avatar: string | null;
    balance: number;
    currency: string;
    isVerified: boolean;
    trustScore: number;
    memberSince: string;
    ownedAssets: MarketItem[];
    transactions: Transaction[];
    uid?: string;
}

interface UserContextType extends UserState {
    login: (provider: string) => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    signupWithEmail: (email: string, password: string, username: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => void;
    purchaseAsset: (item: MarketItem) => Promise<PurchaseResult>;
    refreshTransactions: () => Promise<void>;
    getAuthToken: () => Promise<string | null>;
    loading: boolean;
    isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const INITIAL_USER_STATE: UserState = {
    isAuthenticated: false,
    username: null,
    email: null,
    avatar: null,
    balance: 0,
    currency: "USD",
    isVerified: false,
    trustScore: 0,
    memberSince: new Date().toISOString().split('T')[0],
    ownedAssets: [],
    transactions: []
};

const ADMIN_EMAILS = ['atharv.kuzzboost@gmail.com'];

export function UserProvider({ children }: { children: ReactNode }) {
    const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const setAuthCookie = (token?: string) => {
            if (typeof document === 'undefined') return;
            const secureFlag = window.location.protocol === 'https:' ? '; secure' : '';
            if (token) {
                document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; sameSite=Lax${secureFlag}`;
            } else {
                document.cookie = `firebase-auth-token=; path=/; max-age=0; sameSite=Lax${secureFlag}`;
            }
        };

        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const userRef = doc(db, "users", firebaseUser.uid);
                const token = await firebaseUser.getIdToken();
                setAuthCookie(token);

                // Real-time listener for user data
                const unsubDoc = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        // Check admin status
                        const adminStatus = ADMIN_EMAILS.includes(firebaseUser.email || '') || 
                                          data.role === 'admin';
                        setIsAdmin(adminStatus);
                        
                        setUserState({
                            isAuthenticated: true,
                            uid: firebaseUser.uid,
                            username: data.username || firebaseUser.displayName || "Anonymous",
                            email: firebaseUser.email,
                            avatar: firebaseUser.photoURL,
                            balance: data.balance || 0,
                            currency: data.currency || "USD",
                            isVerified: data.isVerified || false,
                            trustScore: data.trustScore || 0,
                            memberSince: data.created_at?.toDate?.()?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                            ownedAssets: data.ownedAssets || [],
                            transactions: []
                        });
                        
                        // Fetch transactions in background
                        fetchUserTransactions(firebaseUser.uid);
                    } else {
                        // Create new user doc if it doesn't exist
                        const newUser = {
                            username: firebaseUser.displayName || "Anonymous",
                            email: firebaseUser.email,
                            balance: 0,
                            currency: "USD",
                            isVerified: false,
                            trustScore: 0,
                            created_at: serverTimestamp(),
                            ownedAssets: []
                        };
                        await setDoc(userRef, newUser);
                    }
                    setLoading(false);
                });

                return () => unsubDoc();
            } else {
                // User is signed out
                setAuthCookie();
                setUserState(INITIAL_USER_STATE);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);
    
    // Fetch user transactions from Firestore
    const fetchUserTransactions = async (userId: string) => {
        try {
            const txQuery = query(
                collection(db, 'balance_transactions'),
                orderBy('created_at', 'desc'),
                limit(50)
            );
            
            const snapshot = await getDocs(txQuery);
            const transactions: Transaction[] = [];
            
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.user_id === userId) {
                    transactions.push({
                        id: doc.id,
                        type: data.type,
                        amount: data.amount,
                        description: data.description || '',
                        timestamp: data.created_at?.toDate() || new Date(),
                        status: data.status,
                        lzt_item_id: data.lzt_item_id,
                    });
                }
            });
            
            setUserState(prev => ({ ...prev, transactions }));
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };
    
    const refreshTransactions = async () => {
        if (userState.uid) {
            await fetchUserTransactions(userState.uid);
        }
    };
    
    const getAuthToken = async (): Promise<string | null> => {
        try {
            const user = auth.currentUser;
            if (user) {
                return await user.getIdToken();
            }
            return null;
        } catch {
            return null;
        }
    };

    const login = async (provider: string) => {
        try {
            if (provider === 'google') {
                const googleProvider = new GoogleAuthProvider();
                await signInWithPopup(auth, googleProvider);
            } else if (provider === 'discord' || provider === 'email') {
                // These will be handled by separate methods
                throw new Error(`Please use the specific method for ${provider} authentication`);
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            throw new Error(error.message || "Authentication failed");
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error("Email login failed:", error);
            if (error.code === 'auth/user-not-found') {
                throw new Error("No account found with this email");
            } else if (error.code === 'auth/wrong-password') {
                throw new Error("Incorrect password");
            } else if (error.code === 'auth/invalid-email') {
                throw new Error("Invalid email address");
            }
            throw new Error(error.message || "Login failed");
        }
    };

    const signupWithEmail = async (email: string, password: string, username: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Create user document with custom username
            const userRef = doc(db, "users", userCredential.user.uid);
            await setDoc(userRef, {
                username: username,
                email: email,
                balance: 0,
                currency: "USD",
                isVerified: false,
                trustScore: 0,
                created_at: serverTimestamp(),
                ownedAssets: []
            });
        } catch (error: any) {
            console.error("Signup failed:", error);
            if (error.code === 'auth/email-already-in-use') {
                throw new Error("An account with this email already exists");
            } else if (error.code === 'auth/weak-password') {
                throw new Error("Password should be at least 6 characters");
            } else if (error.code === 'auth/invalid-email') {
                throw new Error("Invalid email address");
            }
            throw new Error(error.message || "Signup failed");
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            console.error("Password reset failed:", error);
            if (error.code === 'auth/user-not-found') {
                throw new Error("No account found with this email");
            } else if (error.code === 'auth/invalid-email') {
                throw new Error("Invalid email address");
            }
            throw new Error(error.message || "Password reset failed");
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const purchaseAsset = async (item: MarketItem): Promise<PurchaseResult> => {
        try {
            // Check if user is authenticated
            if (!userState.isAuthenticated || !userState.uid) {
                return { success: false, error: 'Please login to purchase' };
            }
            
            // Check balance
            const displayPrice = item.display_price || item.price * 2 + 5;
            if (userState.balance < displayPrice) {
                return { 
                    success: false, 
                    error: `Insufficient balance. You need $${displayPrice.toFixed(2)} but have $${userState.balance.toFixed(2)}` 
                };
            }
            
            // Get auth token
            const token = await getAuthToken();
            if (!token) {
                return { success: false, error: 'Authentication error' };
            }
            
            // Call purchase API
            const response = await fetch('/api/purchase', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: item.item_id,
                    originalPrice: item.original_price || item.price,
                    displayPrice: displayPrice,
                    itemTitle: item.title,
                }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Refresh transactions
                await refreshTransactions();
                return {
                    success: true,
                    transactionId: result.transactionId,
                    credentialsId: result.credentialsId,
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'Purchase failed',
                    refunded: result.refunded,
                };
            }
        } catch (error: any) {
            console.error('Purchase error:', error);
            return { success: false, error: error.message || 'Network error' };
        }
    };

    const value: UserContextType = {
        ...userState,
        login,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        logout,
        purchaseAsset,
        refreshTransactions,
        getAuthToken,
        loading,
        isAdmin
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
