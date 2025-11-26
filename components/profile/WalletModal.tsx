import { Modal, ModalBody, ModalContent, ModalHeader, Tabs, Tab } from "@heroui/react";
import { Wallet, X } from "lucide-react";
import { motion } from "framer-motion";
import UPIPaymentFlow from "@/components/payment/UPIPaymentFlow";
import CryptoPayment from "@/components/payment/CryptoPayment";

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            size="3xl"
            classNames={{
                base: "bg-transparent shadow-none",
                wrapper: "z-[9999]",
            }}
            placement="center"
        >
            <ModalContent className="p-0 overflow-visible">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="relative"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-purple-500/20 rounded-[40px] blur-2xl opacity-50" />
                    <div className="glass-tahoe shape-squircle overflow-hidden relative">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-white/10 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                    <Wallet size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Add Funds</h2>
                                    <p className="text-white/40 text-sm font-mono">SECURE_GATEWAY // ENCRYPTED</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="text-white/50" />
                            </button>
                        </div>

                        <ModalBody className="p-8">
                            <Tabs
                                aria-label="Payment Options"
                                color="primary"
                                variant="bordered"
                                classNames={{
                                    tabList: "w-full bg-white/5 p-1 btn-squircle border border-white/10",
                                    cursor: "btn-squircle",
                                    tab: "h-10",
                                    tabContent: "font-bold"
                                }}
                            >
                                <Tab key="upi" title="UPI (India)">
                                    <div className="pt-6">
                                        <UPIPaymentFlow />
                                    </div>
                                </Tab>
                                <Tab key="crypto" title="Crypto (Global)">
                                    <div className="pt-6">
                                        <CryptoPayment />
                                    </div>
                                </Tab>
                            </Tabs>
                        </ModalBody>
                    </div>
                </motion.div>
            </ModalContent>
        </Modal>
    );
}
