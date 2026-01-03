"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Trash2 } from "lucide-react";

/**
 * ConfirmDialog Component
 * 
 * Reusable confirmation dialog for destructive actions.
 */

export interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => Promise<void> | void;
    trigger?: React.ReactNode;
    variant?: "danger" | "primary";
}

export default function ConfirmDialog({
    title,
    message,
    confirmLabel = "Delete",
    onConfirm,
    trigger,
    variant = "danger",
}: ConfirmDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {trigger ? (
                <span onClick={() => setIsOpen(true)}>{trigger}</span>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                    <Trash2 size={16} />
                </Button>
            )}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
                <div className="space-y-4">
                    <p className="text-slate-300">{message}</p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={variant}
                            onClick={handleConfirm}
                            isLoading={isLoading}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
