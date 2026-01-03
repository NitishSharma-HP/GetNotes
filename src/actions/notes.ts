"use server";

import dbConnect from "@/lib/mongodb";
import Note, { INoteDocument } from "@/models/Note";
import { revalidatePath } from "next/cache";
import { INote, ActionResponse, NoteFormData } from "@/types";

/**
 * Note Server Actions
 * 
 * All CRUD operations for notes are handled here.
 * Notes belong to subcategories and contain the actual content.
 */

// Helper to serialize MongoDB document to plain object
function serializeNote(doc: INoteDocument): INote {
    return {
        _id: doc._id.toString(),
        title: doc.title,
        content: doc.content,
        subcategoryId: doc.subcategoryId.toString(),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}

/**
 * Get all notes for a subcategory (ordered by updatedAt)
 */
export async function getNotesBySubcategoryId(
    subcategoryId: string
): Promise<ActionResponse<INote[]>> {
    try {
        await dbConnect();
        const notes = await Note.find({ subcategoryId })
            .sort({ updatedAt: -1 }) // Most recently updated first
            .lean();

        return {
            success: true,
            data: notes.map((note) => ({
                _id: note._id.toString(),
                title: note.title,
                content: note.content,
                subcategoryId: note.subcategoryId.toString(),
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            })),
        };
    } catch (error) {
        console.error("Error fetching notes:", error);
        return {
            success: false,
            error: "Failed to fetch notes",
        };
    }
}

/**
 * Get a single note by ID
 */
export async function getNoteById(id: string): Promise<ActionResponse<INote>> {
    try {
        await dbConnect();
        const note = await Note.findById(id);

        if (!note) {
            return {
                success: false,
                error: "Note not found",
            };
        }

        return {
            success: true,
            data: serializeNote(note),
        };
    } catch (error) {
        console.error("Error fetching note:", error);
        return {
            success: false,
            error: "Failed to fetch note",
        };
    }
}

/**
 * Create a new note
 */
export async function createNote(
    data: NoteFormData,
    categoryId: string
): Promise<ActionResponse<INote>> {
    try {
        await dbConnect();
        const note = await Note.create({
            title: data.title,
            content: data.content || "",
            subcategoryId: data.subcategoryId,
        });

        revalidatePath(`/category/${categoryId}/subcategory/${data.subcategoryId}`);

        return {
            success: true,
            data: serializeNote(note),
        };
    } catch (error) {
        console.error("Error creating note:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create note",
        };
    }
}

/**
 * Update a note (used for autosave)
 */
export async function updateNote(
    id: string,
    data: Partial<Omit<NoteFormData, "subcategoryId">>,
    categoryId: string,
    subcategoryId: string
): Promise<ActionResponse<INote>> {
    try {
        await dbConnect();
        const contentPreview = data.content ? (data.content.length > 50 ? data.content.substring(0, 50) + "..." : data.content) : "EMPTY";
        console.log(`[ServerAction] updateNote ${id} | Title: ${data.title} | Content Preview: ${contentPreview}`);

        const note = await Note.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!note) {
            console.warn(`[ServerAction] Note ${id} not found for update`);
            return {
                success: false,
                error: "Note not found",
            };
        }

        console.log(`[ServerAction] Successfully updated note ${id}`);

        // Revalidate the notes list page
        revalidatePath(`/category/${categoryId}/subcategory/${subcategoryId}`);

        return {
            success: true,
            data: serializeNote(note),
        };
    } catch (error) {
        console.error("Error updating note:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update note",
        };
    }
}

/**
 * Delete a note
 */
export async function deleteNote(
    id: string,
    categoryId: string,
    subcategoryId: string
): Promise<ActionResponse> {
    try {
        await dbConnect();
        const result = await Note.findByIdAndDelete(id);

        if (!result) {
            return {
                success: false,
                error: "Note not found",
            };
        }

        revalidatePath(`/category/${categoryId}/subcategory/${subcategoryId}`);

        return { success: true };
    } catch (error) {
        console.error("Error deleting note:", error);
        return {
            success: false,
            error: "Failed to delete note",
        };
    }
}

/**
 * Format note content using Prettier
 */
export async function formatNoteContent(
    content: string
): Promise<ActionResponse<string>> {
    try {
        const prettier = await import("prettier");
        const javaPlugin = await import("prettier-plugin-java");

        const formatted = await prettier.format(content, {
            parser: "markdown",
            plugins: [javaPlugin.default || javaPlugin],
            printWidth: 80,
            proseWrap: "always",
        });

        return {
            success: true,
            data: formatted,
        };
    } catch (error) {
        console.error("Error formatting note content:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to format note",
        };
    }
}
