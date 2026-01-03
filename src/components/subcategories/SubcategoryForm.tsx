"use client";

import { useState } from "react";
import { ISubcategory, SubcategoryFormData } from "@/types";
import { createSubcategory, updateSubcategory } from "@/actions/subcategories";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

/**
 * SubcategoryForm Component
 * 
 * Form for creating or editing a subcategory.
 */

interface SubcategoryFormProps {
    subcategory?: ISubcategory;
    categoryId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function SubcategoryForm({
    subcategory,
    categoryId,
    onSuccess,
    onCancel,
}: SubcategoryFormProps) {
    const [formData, setFormData] = useState<Omit<SubcategoryFormData, "categoryId">>({
        title: subcategory?.title || "",
        description: subcategory?.description || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const isEditing = !!subcategory;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.title.trim()) {
            setError("Title is required");
            return;
        }

        setIsLoading(true);
        try {
            const result = isEditing
                ? await updateSubcategory(subcategory._id, formData)
                : await createSubcategory({ ...formData, categoryId });

            if (result.success) {
                onSuccess();
            } else {
                setError(result.error || "Something went wrong");
            }
        } catch {
            setError("Failed to save subcategory");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Title"
                placeholder="e.g., React Hooks, Async/Await, Docker"
                value={formData.title}
                onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                }
                autoFocus
            />

            <Textarea
                label="Description (optional)"
                placeholder="Brief description of this subcategory"
                value={formData.description}
                onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
            />

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditing ? "Save Changes" : "Create Subcategory"}
                </Button>
            </div>
        </form>
    );
}
