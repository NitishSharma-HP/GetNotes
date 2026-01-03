"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { INote } from "@/types";
import { createNote } from "@/actions/notes";
import NoteCard from "@/components/notes/NoteCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { Plus } from "lucide-react";

/**
 * NotesList Component
 *
 * Client component that handles notes display and create functionality.
 */

interface NotesListProps {
    initialNotes: INote[];
    categoryId: string;
    subcategoryId: string;
}

export default function NotesList({
    initialNotes,
    categoryId,
    subcategoryId,
}: NotesListProps) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!noteTitle.trim()) {
            setError("Title is required");
            return;
        }

        startTransition(async () => {
            const result = await createNote(
                {
                    title: noteTitle,
                    content: "",
                    subcategoryId,
                },
                categoryId
            );

            if (result.success && result.data) {
                setShowModal(false);
                setNoteTitle("");
                // Navigate to the new note for editing
                router.push(
                    `/category/${categoryId}/subcategory/${subcategoryId}/note/${result.data._id}`
                );
            } else {
                setError(result.error || "Failed to create note");
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNoteTitle("");
        setError("");
    };

    return (
        <>
            {/* Create button */}
            <div className="flex justify-end mb-6">
                <Button onClick={() => setShowModal(true)}>
                    <Plus size={18} className="mr-1.5" />
                    New Note
                </Button>
            </div>

            {/* Notes grid or empty state */}
            {initialNotes.length === 0 ? (
                <EmptyState
                    type="notes"
                    title="No notes yet"
                    description="Create your first note to start documenting."
                    action={
                        <Button onClick={() => setShowModal(true)}>
                            <Plus size={18} className="mr-1.5" />
                            Create Note
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {initialNotes.map((note) => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            categoryId={categoryId}
                            subcategoryId={subcategoryId}
                        />
                    ))}
                </div>
            )}

            {/* Create Note Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Create Note"
            >
                <form onSubmit={handleCreateNote} className="space-y-4">
                    <Input
                        label="Note Title"
                        placeholder="e.g., useEffect patterns, API error handling"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        autoFocus
                    />

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCloseModal}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isPending}>
                            Create & Edit
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
