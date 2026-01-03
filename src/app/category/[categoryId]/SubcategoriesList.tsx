"use client";

import { useState } from "react";
import { ISubcategory } from "@/types";
import SubcategoryCard from "@/components/subcategories/SubcategoryCard";
import SubcategoryForm from "@/components/subcategories/SubcategoryForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { Plus } from "lucide-react";

/**
 * SubcategoriesList Component
 *
 * Client component that handles subcategory display and CRUD UI.
 */

interface SubcategoriesListProps {
    initialSubcategories: ISubcategory[];
    categoryId: string;
}

export default function SubcategoriesList({
    initialSubcategories,
    categoryId,
}: SubcategoriesListProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingSubcategory, setEditingSubcategory] =
        useState<ISubcategory | null>(null);

    const handleEdit = (subcategory: ISubcategory) => {
        setEditingSubcategory(subcategory);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSubcategory(null);
    };

    return (
        <>
            {/* Create button */}
            <div className="flex justify-end mb-6">
                <Button onClick={() => setShowModal(true)}>
                    <Plus size={18} className="mr-1.5" />
                    New Subcategory
                </Button>
            </div>

            {/* Subcategories list or empty state */}
            {initialSubcategories.length === 0 ? (
                <EmptyState
                    type="subcategories"
                    title="No subcategories yet"
                    description="Create subcategories to organize your notes within this category."
                    action={
                        <Button onClick={() => setShowModal(true)}>
                            <Plus size={18} className="mr-1.5" />
                            Create Subcategory
                        </Button>
                    }
                />
            ) : (
                <div className="space-y-3">
                    {initialSubcategories.map((subcategory) => (
                        <SubcategoryCard
                            key={subcategory._id}
                            subcategory={subcategory}
                            categoryId={categoryId}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingSubcategory ? "Edit Subcategory" : "Create Subcategory"}
            >
                <SubcategoryForm
                    subcategory={editingSubcategory || undefined}
                    categoryId={categoryId}
                    onSuccess={handleCloseModal}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </>
    );
}
