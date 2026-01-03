import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/actions/categories";
import { getSubcategoryById } from "@/actions/subcategories";
import { getNotesBySubcategoryId } from "@/actions/notes";
import NotesList from "./NotesList";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import type { Metadata } from "next";

/**
 * Subcategory Page
 *
 * Displays notes within a subcategory.
 */

interface SubcategoryPageProps {
    params: Promise<{ categoryId: string; subcategoryId: string }>;
}

export async function generateMetadata({
    params,
}: SubcategoryPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const result = await getSubcategoryById(resolvedParams.subcategoryId);

    if (!result.success || !result.data) {
        return { title: "Subcategory Not Found" };
    }

    return {
        title: result.data.title,
        description: result.data.description || `Notes in ${result.data.title}`,
    };
}

export const dynamic = "force-dynamic";

export default async function SubcategoryPage({
    params,
}: SubcategoryPageProps) {
    const resolvedParams = await params;
    const [categoryResult, subcategoryResult, notesResult] = await Promise.all([
        getCategoryById(resolvedParams.categoryId),
        getSubcategoryById(resolvedParams.subcategoryId),
        getNotesBySubcategoryId(resolvedParams.subcategoryId),
    ]);

    if (!categoryResult.success || !categoryResult.data) {
        notFound();
    }

    if (!subcategoryResult.success || !subcategoryResult.data) {
        notFound();
    }

    if (!notesResult.success || !notesResult.data) {
        throw new Error(notesResult.error || "Failed to load notes");
    }

    const category = categoryResult.data;
    const subcategory = subcategoryResult.data;
    const notes = notesResult.data;

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    {
                        label: category.title,
                        href: `/category/${resolvedParams.categoryId}`,
                    },
                    { label: subcategory.title },
                ]}
            />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                        {subcategory.title}
                    </h1>
                    {subcategory.description && (
                        <p className="text-slate-400 mt-1">{subcategory.description}</p>
                    )}
                </div>
            </div>

            {/* Notes List - Client Component for interactivity */}
            <Suspense fallback={<PageLoading />}>
                <NotesList
                    initialNotes={notes}
                    categoryId={resolvedParams.categoryId}
                    subcategoryId={resolvedParams.subcategoryId}
                />
            </Suspense>
        </div>
    );
}
