"use client";

import Link from "next/link";
import { ICategory } from "@/types";
import Card, { CardContent } from "@/components/ui/Card";
import { FolderOpen, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { getRelativeTime } from "@/lib/utils";
import { useState } from "react";
import { deleteCategory } from "@/actions/categories";

/**
 * CategoryCard Component
 * 
 * Displays a category with edit/delete actions.
 */

interface CategoryCardProps {
    category: ICategory;
    onEdit: (category: ICategory) => void;
}

export default function CategoryCard({ category, onEdit }: CategoryCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Delete this category? All subcategories and notes inside will also be deleted.")) {
            return;
        }
        setIsDeleting(true);
        try {
            await deleteCategory(category._id);
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    return (
        <Card variant="interactive" className="group relative">
            <Link href={`/category/${category._id}`} className="block">
                <CardContent className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                            <FolderOpen className="w-6 h-6 text-indigo-400" />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {category.title}
                        </h3>
                        {category.description && (
                            <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                                {category.description}
                            </p>
                        )}
                    </div>

                    <p className="text-xs text-slate-500">
                        Updated {getRelativeTime(category.updatedAt)}
                    </p>
                </CardContent>
            </Link>

            {/* Action menu */}
            <div className="absolute top-3 right-3">
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
                                    onEdit(category);
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
