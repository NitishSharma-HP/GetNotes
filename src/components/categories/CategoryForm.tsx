"use client";

import { useState } from "react";
import { ICategory, CategoryFormData } from "@/types";
import { createCategory, updateCategory } from "@/actions/categories";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

/**
 * CategoryForm Component
 * 
 * Form for creating or editing a category.
 */

interface CategoryFormProps {
    category?: ICategory;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CategoryForm({
    category,
    onSuccess,
    onCancel,
}: CategoryFormProps) {
    const [formData, setFormData] = useState<CategoryFormData>({
        title: category?.title || "",
        description: category?.description || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const isEditing = !!category;

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
                ? await updateCategory(category._id, formData)
                : await createCategory(formData);

            if (result.success) {
                onSuccess();
            } else {
                setError(result.error || "Something went wrong");
            }
        } catch {
            setError("Failed to save category");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Title"
                placeholder="e.g., JavaScript, Python, DevOps"
                value={formData.title}
                onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                }
                autoFocus
            />

            <Textarea
                label="Description (optional)"
                placeholder="Brief description of this category"
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
                    {isEditing ? "Save Changes" : "Create Category"}
                </Button>
            </div>
        </form>
    );
}
