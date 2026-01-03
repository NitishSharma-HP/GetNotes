"use client";

import Link from "next/link";
import { INote } from "@/types";
import Card, { CardContent } from "@/components/ui/Card";
import { FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { getRelativeTime, truncate } from "@/lib/utils";
import { useState } from "react";
import { deleteNote } from "@/actions/notes";

/**
 * NoteCard Component
 * 
 * Displays a note preview with edit/delete actions.
 */

interface NoteCardProps {
    note: INote;
    categoryId: string;
    subcategoryId: string;
}

export default function NoteCard({
    note,
    categoryId,
    subcategoryId,
}: NoteCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Delete this note? This action cannot be undone.")) {
            return;
        }
        setIsDeleting(true);
        try {
            await deleteNote(note._id, categoryId, subcategoryId);
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    // Get preview text from content
    const preview = note.content
        ? truncate(note.content.replace(/[#*`]/g, "").trim(), 100)
        : "No content yet";

    return (
        <Card variant="interactive" className="group relative">
            <Link
                href={`/category/${categoryId}/subcategory/${subcategoryId}/note/${note._id}`}
                className="block"
            >
                <CardContent className="space-y-2">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                                {note.title}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2 mt-1">
                                {preview}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                        <span className="text-xs text-slate-500">
                            Updated {getRelativeTime(note.updatedAt)}
                        </span>
                    </div>
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
                            <Link
                                href={`/category/${categoryId}/subcategory/${subcategoryId}/note/${note._id}`}
                                onClick={() => setShowMenu(false)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
                            >
                                <Pencil size={14} />
                                Edit
                            </Link>
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
