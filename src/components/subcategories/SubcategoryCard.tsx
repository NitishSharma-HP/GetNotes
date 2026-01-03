"use client";

import Link from "next/link";
import { ISubcategory } from "@/types";
import Card, { CardContent } from "@/components/ui/Card";
import { Folder, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { getRelativeTime } from "@/lib/utils";
import { useState } from "react";
import { deleteSubcategory } from "@/actions/subcategories";

/**
 * SubcategoryCard Component
 * 
 * Displays a subcategory with edit/delete actions.
 */

interface SubcategoryCardProps {
    subcategory: ISubcategory;
    categoryId: string;
    onEdit: (subcategory: ISubcategory) => void;
}

export default function SubcategoryCard({
    subcategory,
    categoryId,
    onEdit,
}: SubcategoryCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Delete this subcategory? All notes inside will also be deleted.")) {
            return;
        }
        setIsDeleting(true);
        try {
            await deleteSubcategory(subcategory._id, categoryId);
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    return (
        <Card variant="interactive" className="group relative">
            <Link
                href={`/category/${categoryId}/subcategory/${subcategory._id}`}
                className="block"
            >
                <CardContent className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5 text-purple-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-100 group-hover:text-purple-400 transition-colors truncate">
                            {subcategory.title}
                        </h3>
                        {subcategory.description && (
                            <p className="text-sm text-slate-400 truncate">
                                {subcategory.description}
                            </p>
                        )}
                    </div>

                    <span className="text-xs text-slate-500 shrink-0">
                        {getRelativeTime(subcategory.updatedAt)}
                    </span>
                </CardContent>
            </Link>

            {/* Action menu */}
            <div className="absolute top-1/2 -translate-y-1/2 right-14">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <MoreVertical size={16} />
                </button>

                {showMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 top-8 z-20 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    onEdit(subcategory);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                disabled={isDeleting}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            >
                                <Trash2 size={14} />
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}
