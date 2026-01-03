import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Subcategory Model
 * 
 * Mid-level organization that belongs to a Category.
 * Subcategories contain notes.
 */

export interface ISubcategoryDocument extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    categoryId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const SubcategorySchema = new Schema<ISubcategoryDocument>(
    {
        title: {
            type: String,
            required: [true, "Subcategory title is required"],
            trim: true,
            maxlength: [100, "Subcategory title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category reference is required"],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient category-based queries
SubcategorySchema.index({ categoryId: 1, createdAt: -1 });
SubcategorySchema.index({ title: 1 });

// Prevent model recompilation during development hot reloads
const Subcategory: Model<ISubcategoryDocument> =
    mongoose.models.Subcategory ||
    mongoose.model<ISubcategoryDocument>("Subcategory", SubcategorySchema);

export default Subcategory;
