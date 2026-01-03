import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryById } from "@/actions/categories";
import { getSubcategoryById } from "@/actions/subcategories";
import { getNoteById } from "@/actions/notes";
import NoteEditor from "@/components/notes/NoteEditor";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

/**
 * Note Editor Page
 *
 * Full-screen note editing experience with autosave.
 */

interface NotePageProps {
    params: Promise<{ categoryId: string; subcategoryId: string; noteId: string }>;
}

export async function generateMetadata({
    params,
}: NotePageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const result = await getNoteById(resolvedParams.noteId);

    if (!result.success || !result.data) {
        return { title: "Note Not Found" };
    }

    return {
        title: `${result.data.title} - Edit`,
        description: result.data.content?.slice(0, 160) || "Edit note",
    };
}

export const dynamic = "force-dynamic";

export default async function NotePage({ params }: NotePageProps) {
    const resolvedParams = await params;
    const [categoryResult, subcategoryResult, noteResult] = await Promise.all([
        getCategoryById(resolvedParams.categoryId),
        getSubcategoryById(resolvedParams.subcategoryId),
        getNoteById(resolvedParams.noteId),
    ]);

    if (!categoryResult.success || !categoryResult.data) {
        notFound();
    }

    if (!subcategoryResult.success || !subcategoryResult.data) {
        notFound();
    }

    if (!noteResult.success || !noteResult.data) {
        notFound();
    }

    const category = categoryResult.data;
    const subcategory = subcategoryResult.data;
    const note = noteResult.data;

    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col space-y-4">
            {/* Header with breadcrumb and back button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/category/${resolvedParams.categoryId}/subcategory/${resolvedParams.subcategoryId}`}
                    >
                        <Button variant="ghost" size="sm">
                            <ArrowLeft size={16} className="mr-1.5" />
                            Back
                        </Button>
                    </Link>
                    <Breadcrumb
                        items={[
                            {
                                label: category.title,
                                href: `/category/${resolvedParams.categoryId}`,
                            },
                            {
                                label: subcategory.title,
                                href: `/category/${resolvedParams.categoryId}/subcategory/${resolvedParams.subcategoryId}`,
                            },
                            { label: note.title },
                        ]}
                    />
                </div>
            </div>

            {/* Editor - takes remaining space */}
            <div className="flex-1 min-h-0">
                <NoteEditor
                    note={note}
                    categoryId={resolvedParams.categoryId}
                    subcategoryId={resolvedParams.subcategoryId}
                />
            </div>
        </div>
    );
}
