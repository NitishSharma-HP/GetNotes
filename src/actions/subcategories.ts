"use server";

import dbConnect from "@/lib/mongodb";
import Subcategory, { ISubcategoryDocument } from "@/models/Subcategory";
import Note from "@/models/Note";
import { revalidatePath } from "next/cache";
import { ISubcategory, ActionResponse, SubcategoryFormData } from "@/types";

/**
 * Subcategory Server Actions
 * 
 * All CRUD operations for subcategories are handled here.
 * Subcategories belong to categories and contain notes.
 */

// Helper to serialize MongoDB document to plain object
function serializeSubcategory(doc: ISubcategoryDocument): ISubcategory {
    return {
        _id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        categoryId: doc.categoryId.toString(),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}

/**
 * Get all subcategories for a category
 */
export async function getSubcategoriesByCategoryId(
    categoryId: string
): Promise<ActionResponse<ISubcategory[]>> {
    try {
        await dbConnect();
        const subcategories = await Subcategory.find({ categoryId })
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            data: subcategories.map((sub) => ({
                _id: sub._id.toString(),
                title: sub.title,
                description: sub.description,
                categoryId: sub.categoryId.toString(),
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
            })),
        };
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return {
            success: false,
            error: "Failed to fetch subcategories",
        };
    }
}

/**
 * Get a single subcategory by ID
 */
export async function getSubcategoryById(
    id: string
): Promise<ActionResponse<ISubcategory>> {
    try {
        await dbConnect();
        const subcategory = await Subcategory.findById(id);

        if (!subcategory) {
            return {
                success: false,
                error: "Subcategory not found",
            };
        }

        return {
            success: true,
            data: serializeSubcategory(subcategory),
        };
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        return {
            success: false,
            error: "Failed to fetch subcategory",
        };
    }
}

/**
 * Create a new subcategory
 */
export async function createSubcategory(
    data: SubcategoryFormData
): Promise<ActionResponse<ISubcategory>> {
    try {
        await dbConnect();
        const subcategory = await Subcategory.create({
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
        });

        revalidatePath(`/category/${data.categoryId}`);

        return {
            success: true,
            data: serializeSubcategory(subcategory),
        };
    } catch (error) {
        console.error("Error creating subcategory:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create subcategory",
        };
    }
}

/**
 * Update a subcategory
 */
export async function updateSubcategory(
    id: string,
    data: Partial<Omit<SubcategoryFormData, "categoryId">>
): Promise<ActionResponse<ISubcategory>> {
    try {
        await dbConnect();
        const subcategory = await Subcategory.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!subcategory) {
            return {
                success: false,
                error: "Subcategory not found",
            };
        }

        revalidatePath(`/category/${subcategory.categoryId}`);
        revalidatePath(`/category/${subcategory.categoryId}/subcategory/${id}`);

        return {
            success: true,
            data: serializeSubcategory(subcategory),
        };
    } catch (error) {
        console.error("Error updating subcategory:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update subcategory",
        };
    }
}

/**
 * Delete a subcategory and all its notes (cascade delete)
 */
export async function deleteSubcategory(
    id: string,
    categoryId: string
): Promise<ActionResponse> {
    try {
        await dbConnect();

        // Delete all notes in this subcategory
        await Note.deleteMany({ subcategoryId: id });

        // Delete the subcategory
        const result = await Subcategory.findByIdAndDelete(id);

        if (!result) {
            return {
                success: false,
                error: "Subcategory not found",
            };
        }

        revalidatePath(`/category/${categoryId}`);

        return { success: true };
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        return {
            success: false,
            error: "Failed to delete subcategory",
        };
    }
}
