/**
 * TypeScript interfaces for GetNotes application
 * These types represent the core data structures used throughout the app
 */

// Base interface with common fields
export interface BaseDocument {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Category - top level organization
export interface ICategory extends BaseDocument {
    title: string;
    description?: string;
}

// Subcategory - belongs to a category
export interface ISubcategory extends BaseDocument {
    title: string;
    description?: string;
    categoryId: string;
}

// Note - belongs to a subcategory
export interface INote extends BaseDocument {
    title: string;
    content: string; // Raw markdown/text content
    subcategoryId: string;
}

// Form data types (without _id and timestamps)
export type CategoryFormData = Pick<ICategory, "title" | "description">;
export type SubcategoryFormData = Pick<ISubcategory, "title" | "description" | "categoryId">;
export type NoteFormData = Pick<INote, "title" | "content" | "subcategoryId">;

// Action response type for server actions
export interface ActionResponse<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}
