import { Suspense } from "react";
import { getCategories } from "@/actions/categories";
import CategoriesGrid from "@/components/categories/CategoriesGrid";
import { PageLoading } from "@/components/ui/LoadingSpinner";

/**
 * Home Page
 *
 * Displays all categories in a grid layout.
 * Server Component that fetches data and passes to client component.
 */

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const result = await getCategories();

    if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to load categories");
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                        Your Categories
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Organize your coding notes by topic
                    </p>
                </div>
            </div>

            {/* Categories Grid - Client Component for interactivity */}
            <Suspense fallback={<PageLoading />}>
                <CategoriesGrid initialCategories={result.data} />
            </Suspense>
        </div>
    );
}
