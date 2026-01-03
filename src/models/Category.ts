import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Category Model
 * 
 * Top-level organization for notes.
 * Categories contain subcategories which contain notes.
 */

export interface ICategoryDocument extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
    {
        title: {
            type: String,
            required: [true, "Category title is required"],
            trim: true,
            maxlength: [100, "Category title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

// Add index for faster queries
CategorySchema.index({ title: 1 });
CategorySchema.index({ createdAt: -1 });

// Prevent model recompilation during development hot reloads
const Category: Model<ICategoryDocument> =
    mongoose.models.Category ||
    mongoose.model<ICategoryDocument>("Category", CategorySchema);

export default Category;
