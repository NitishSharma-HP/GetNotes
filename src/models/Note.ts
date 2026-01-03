import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Note Model
 * 
 * The actual note content that belongs to a Subcategory.
 * Content is stored as raw markdown/text for maximum flexibility.
 */

export interface INoteDocument extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    subcategoryId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INoteDocument>(
    {
        title: {
            type: String,
            required: [true, "Note title is required"],
            trim: true,
            maxlength: [200, "Note title cannot exceed 200 characters"],
        },
        content: {
            type: String,
            default: "",
            // No max length - notes can be as long as needed
        },
        subcategoryId: {
            type: Schema.Types.ObjectId,
            ref: "Subcategory",
            required: [true, "Subcategory reference is required"],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient subcategory-based queries, ordered by update time
NoteSchema.index({ subcategoryId: 1, updatedAt: -1 });
NoteSchema.index({ title: 1 });

// Prevent model recompilation during development hot reloads
const Note: Model<INoteDocument> =
    mongoose.models.Note || mongoose.model<INoteDocument>("Note", NoteSchema);

export default Note;
