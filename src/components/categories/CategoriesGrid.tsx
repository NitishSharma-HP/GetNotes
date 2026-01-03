"use client";

import { useState } from "react";
import { ICategory } from "@/types";
import CategoryCard from "@/components/categories/CategoryCard";
import CategoryForm from "@/components/categories/CategoryForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { Plus } from "lucide-react";

/**
 * CategoriesGrid Component
 *
 * Client component that handles category display and CRUD UI.
 */

interface CategoriesGridProps {
    initialCategories: ICategory[];
}

export default function CategoriesGrid({
    initialCategories,
}: CategoriesGridProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(
        null
    );

    const handleEdit = (category: ICategory) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    return (
        <>
            {/* Create button */}
            <div className="flex justify-end mb-6">
                <Button onClick={() => setShowModal(true)}>
                    <Plus size={18} className="mr-1.5" />
                    New Category
                </Button>
            </div>

            {/* Categories grid or empty state */}
            {initialCategories.length === 0 ? (
                <EmptyState
                    type="categories"
                    title="No categories yet"
                    description="Create your first category to start organizing your notes."
                    action={
                        <Button onClick={() => setShowModal(true)}>
                            <Plus size={18} className="mr-1.5" />
                            Create Category
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {initialCategories.map((category) => (
                        <CategoryCard
                            key={category._id}
                            category={category}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingCategory ? "Edit Category" : "Create Category"}
            >
                <CategoryForm
                    category={editingCategory || undefined}
                    onSuccess={handleCloseModal}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </>
    );
}
