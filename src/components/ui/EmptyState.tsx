import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { FileText, FolderOpen, Inbox } from "lucide-react";

/**
 * EmptyState Component
 * 
 * Placeholder shown when there's no content to display.
 */

export interface EmptyStateProps {
    type?: "categories" | "subcategories" | "notes" | "generic";
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export default function EmptyState({
    type = "generic",
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    const icons = {
        categories: FolderOpen,
        subcategories: FolderOpen,
        notes: FileText,
        generic: Inbox,
    };

    const Icon = icons[type];

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-16 px-4 text-center",
                className
            )}
        >
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">{title}</h3>
            {description && (
                <p className="text-slate-400 max-w-sm mb-6">{description}</p>
            )}
            {action}
        </div>
    );
}
