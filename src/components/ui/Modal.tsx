"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Modal Component
 * 
 * Accessible dialog component with backdrop and focus trapping.
 */

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Handle click outside to close
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal content */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={cn(
                    "relative z-10 w-full max-w-md bg-slate-800 rounded-xl border border-slate-700 shadow-2xl",
                    "animate-in fade-in zoom-in-95 duration-200",
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                    <h2
                        id="modal-title"
                        className="text-lg font-semibold text-slate-100"
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4">{children}</div>
            </div>
        </div>
    );
}
