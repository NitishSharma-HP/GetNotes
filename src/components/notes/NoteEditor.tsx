"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { updateNote, formatNoteContent } from "@/actions/notes";
import { INote } from "@/types";
import { Save, Check, Loader2, Wand2 } from "lucide-react";

/**
 * NoteEditor Component
 * 
 * CodeMirror-based markdown editor with autosave functionality.
 * Supports code blocks with syntax highlighting.
 */

interface NoteEditorProps {
    note: INote;
    categoryId: string;
    subcategoryId: string;
}

export default function NoteEditor({
    note,
    categoryId,
    subcategoryId,
}: NoteEditorProps) {
    const [title, setTitle] = useState(note.title || "");
    const [content, setContent] = useState(note.content || "");
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
    const [isFormatting, setIsFormatting] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedRef = useRef({ title: note.title || "", content: note.content || "" });

    // Use refs to track current state for the unmount cleanup function
    // This avoids closure bugs where the cleanup captures initial state
    const currentTitleRef = useRef(note.title || "");
    const currentContentRef = useRef(note.content || "");

    // Handling changes synchronously to avoid useEffect race conditions
    const handleTitleChange = (val: string) => {
        setTitle(val);
        currentTitleRef.current = val;
    };

    const handleContentChange = (val: string) => {
        setContent(val);
        currentContentRef.current = val;
    };

    // Autosave logic with debounce
    const debouncedSave = useCallback(
        async (newTitle: string, newContent: string) => {
            // Don't save if nothing changed
            if (
                newTitle === lastSavedRef.current.title &&
                newContent === lastSavedRef.current.content
            ) {
                setSaveStatus("saved");
                return;
            }

            setSaveStatus("saving");
            console.log(`[NoteEditor] Attempting to save note ${note._id}... Content length: ${newContent.length}`);
            try {
                const result = await updateNote(
                    note._id,
                    { title: newTitle, content: newContent },
                    categoryId,
                    subcategoryId
                );

                if (result.success) {
                    console.log(`[NoteEditor] Save successful for note ${note._id}`);
                    lastSavedRef.current = { title: newTitle, content: newContent };
                    setSaveStatus("saved");
                } else {
                    console.error(`[NoteEditor] Save failed for note ${note._id}:`, result.error);
                    setSaveStatus("unsaved");
                }
            } catch (err) {
                console.error(`[NoteEditor] Exception during save for note ${note._id}:`, err);
                setSaveStatus("unsaved");
            }
        },
        [note._id, categoryId, subcategoryId]
    );

    // Schedule autosave when content changes
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Check if there are unsaved changes
        if (
            title !== lastSavedRef.current.title ||
            content !== lastSavedRef.current.content
        ) {
            setSaveStatus("unsaved");
            saveTimeoutRef.current = setTimeout(() => {
                debouncedSave(title, content);
            }, 2000); // 2 second debounce
        }

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [title, content, debouncedSave]);

    // Save on unmount if there are unsaved changes
    useEffect(() => {
        return () => {
            const currentTitle = currentTitleRef.current;
            const currentContent = currentContentRef.current;

            if (
                currentTitle !== lastSavedRef.current.title ||
                currentContent !== lastSavedRef.current.content
            ) {
                console.log(`[NoteEditor] Unmount detected. Saving dirty data for note ${note._id}... Content length: ${currentContent.length}`);
                // Fire and forget save on unmount
                updateNote(
                    note._id,
                    { title: currentTitle, content: currentContent },
                    categoryId,
                    subcategoryId
                ).then(res => {
                    console.log(`[NoteEditor] Unmount save result for ${note._id}:`, res.success ? "Success" : "Failed");
                }).catch(err => {
                    console.error(`[NoteEditor] Unmount save exception for ${note._id}:`, err);
                });
            } else {
                console.log(`[NoteEditor] Unmount detected. No dirty data for note ${note._id}.`);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Manual save handler
    const handleManualSave = () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        debouncedSave(title, content);
    };

    // Format handler
    const handleFormat = async () => {
        if (isFormatting || !content.trim()) return;

        setIsFormatting(true);
        console.log(`[NoteEditor] Formatting content for note ${note._id}...`);

        try {
            const result = await formatNoteContent(content);
            if (result.success && result.data) {
                const formattedContent = result.data;

                // Only update if it actually changed
                if (formattedContent !== content) {
                    handleContentChange(formattedContent);
                    // Trigger immediate save for formatting results
                    debouncedSave(title, formattedContent);
                    console.log(`[NoteEditor] Formatting successful for note ${note._id}`);
                } else {
                    console.log(`[NoteEditor] Content already formatted for note ${note._id}`);
                }
            } else {
                console.error(`[NoteEditor] Formatting failed:`, result.error);
            }
        } catch (err) {
            console.error(`[NoteEditor] Formatting exception:`, err);
        } finally {
            setIsFormatting(false);
        }
    };

    // Custom theme extensions
    const customTheme = EditorView.theme({
        "&": {
            fontSize: "14px",
        },
        ".cm-content": {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: "16px 0",
        },
        ".cm-gutters": {
            backgroundColor: "transparent",
            border: "none",
        },
        ".cm-line": {
            padding: "0 16px",
        },
        "&.cm-focused": {
            outline: "none",
        },
    });

    return (
        <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Note title..."
                    className="flex-1 bg-transparent text-lg font-medium text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                    {/* Format Button */}
                    <button
                        onClick={handleFormat}
                        disabled={isFormatting}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 transition-colors disabled:opacity-50"
                        title="Format Markdown & Code (Java/JS)"
                    >
                        {isFormatting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Wand2 size={16} />
                        )}
                        <span className="text-sm font-medium">Format</span>
                    </button>

                    <div className="h-6 w-px bg-slate-700/50 mx-1" />

                    {/* Save status indicator */}
                    <div className="flex items-center gap-1.5 text-sm">
                        {saveStatus === "saving" && (
                            <>
                                <Loader2 size={14} className="animate-spin text-slate-400" />
                                <span className="text-slate-400">Saving...</span>
                            </>
                        )}
                        {saveStatus === "saved" && (
                            <>
                                <Check size={14} className="text-emerald-500" />
                                <span className="text-slate-400">Saved</span>
                            </>
                        )}
                        {saveStatus === "unsaved" && (
                            <button
                                onClick={handleManualSave}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-amber-400 hover:bg-slate-700 transition-colors"
                            >
                                <Save size={14} />
                                <span>Unsaved</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* CodeMirror Editor */}
            <div className="flex-1 overflow-auto">
                <CodeMirror
                    value={content}
                    onChange={(value) => handleContentChange(value)}
                    extensions={[
                        markdown({ base: markdownLanguage, codeLanguages: languages }),
                        EditorView.lineWrapping,
                        customTheme,
                    ]}
                    theme={oneDark}
                    placeholder="Start writing your note... 

Use markdown for formatting:
# Heading
**bold** *italic*
- list item

Use triple backticks for code blocks:
```javascript
const hello = 'world';
```"
                    className="h-full"
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        highlightActiveLine: true,
                        foldGutter: true,
                        dropCursor: true,
                        allowMultipleSelections: true,
                        indentOnInput: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        autocompletion: true,
                        rectangularSelection: true,
                        crosshairCursor: false,
                        highlightSelectionMatches: true,
                    }}
                />
            </div>
        </div>
    );
}
