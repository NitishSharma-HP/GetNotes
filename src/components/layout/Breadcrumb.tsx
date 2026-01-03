import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

/**
 * Breadcrumb Component
 * 
 * Navigation breadcrumbs showing the current location in the hierarchy.
 */

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
            <Link
                href="/"
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
                <Home size={16} />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                    <ChevronRight size={16} className="text-slate-600" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-slate-400 hover:text-slate-200 transition-colors truncate max-w-[150px]"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-200 truncate max-w-[150px] font-medium">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
