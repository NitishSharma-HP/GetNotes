"use server";

import dbConnect from "@/lib/mongodb";
import Category, { ICategoryDocument } from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import Note from "@/models/Note";
import { revalidatePath } from "next/cache";
import { ICategory, ActionResponse, CategoryFormData } from "@/types";

/**
 * Category Server Actions
 * 
 * All CRUD operations for categories are handled here as server actions.
 * These run on the server and can be called directly from client components.
 */

// Helper to serialize MongoDB document to plain object
function serializeCategory(doc: ICategoryDocument): ICategory {
    return {
        _id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<ActionResponse<ICategory[]>> {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

        return {
            success: true,
            data: categories.map((cat) => ({
                _id: cat._id.toString(),
                title: cat.title,
                description: cat.description,
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt,
            })),
        };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return {
            success: false,
            error: "Failed to fetch categories",
        };
    }
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(
    id: string
): Promise<ActionResponse<ICategory>> {
    try {
        await dbConnect();
        const category = await Category.findById(id);

        if (!category) {
            return {
                success: false,
                error: "Category not found",
            };
        }

        return {
            success: true,
            data: serializeCategory(category),
        };
    } catch (error) {
        console.error("Error fetching category:", error);
        return {
            success: false,
            error: "Failed to fetch category",
        };
    }
}

/**
 * Create a new category
 */
export async function createCategory(
    data: CategoryFormData
): Promise<ActionResponse<ICategory>> {
    try {
        await dbConnect();
        const category = await Category.create({
            title: data.title,
            description: data.description,
        });

        revalidatePath("/");

        return {
            success: true,
            data: serializeCategory(category),
        };
    } catch (error) {
        console.error("Error creating category:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create category",
        };
    }
}

/**
 * Update a category
 */
export async function updateCategory(
    id: string,
    data: Partial<CategoryFormData>
): Promise<ActionResponse<ICategory>> {
    try {
        await dbConnect();
        const category = await Category.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!category) {
            return {
                success: false,
                error: "Category not found",
            };
        }

        revalidatePath("/");
        revalidatePath(`/category/${id}`);

        return {
            success: true,
            data: serializeCategory(category),
        };
    } catch (error) {
        console.error("Error updating category:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update category",
        };
    }
}

/**
 * Delete a category and all its subcategories and notes (cascade delete)
 */
export async function deleteCategory(id: string): Promise<ActionResponse> {
    try {
        await dbConnect();

        // Find all subcategories in this category
        const subcategories = await Subcategory.find({ categoryId: id });
        const subcategoryIds = subcategories.map((sub) => sub._id);

        // Delete all notes in those subcategories
        await Note.deleteMany({ subcategoryId: { $in: subcategoryIds } });

        // Delete all subcategories
        await Subcategory.deleteMany({ categoryId: id });

        // Delete the category
        const result = await Category.findByIdAndDelete(id);

        if (!result) {
            return {
                success: false,
                error: "Category not found",
            };
        }

        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error deleting category:", error);
        return {
            success: false,
            error: "Failed to delete category",
        };
    }
}
