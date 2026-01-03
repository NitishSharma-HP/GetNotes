import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/actions/categories";
import { getSubcategoriesByCategoryId } from "@/actions/subcategories";
import SubcategoriesList from "./SubcategoriesList";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import type { Metadata } from "next";

/**
 * Category Page
 *
 * Displays subcategories within a category.
 */

interface CategoryPageProps {
    params: Promise<{ categoryId: string }>;
}

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const result = await getCategoryById(resolvedParams.categoryId);

    if (!result.success || !result.data) {
        return { title: "Category Not Found" };
    }

    return {
        title: result.data.title,
        description: result.data.description || `Notes in ${result.data.title}`,
    };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: CategoryPageProps) {
    const resolvedParams = await params;
    const [categoryResult, subcategoriesResult] = await Promise.all([
        getCategoryById(resolvedParams.categoryId),
        getSubcategoriesByCategoryId(resolvedParams.categoryId),
    ]);

    if (!categoryResult.success || !categoryResult.data) {
        notFound();
    }

    if (!subcategoriesResult.success || !subcategoriesResult.data) {
        throw new Error(subcategoriesResult.error || "Failed to load subcategories");
    }

    const category = categoryResult.data;
    const subcategories = subcategoriesResult.data;

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: category.title }]} />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                        {category.title}
                    </h1>
                    {category.description && (
                        <p className="text-slate-400 mt-1">{category.description}</p>
                    )}
                </div>
            </div>

            {/* Subcategories List - Client Component for interactivity */}
            <Suspense fallback={<PageLoading />}>
                <SubcategoriesList
                    initialSubcategories={subcategories}
                    categoryId={resolvedParams.categoryId}
                />
            </Suspense>
        </div>
    );
}
