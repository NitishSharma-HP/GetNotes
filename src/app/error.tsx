"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Global Error Boundary
 *
 * Catches and displays errors at the page level.
 */

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Page error:", error);
    }, [error]);

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md px-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-slate-100">
                    Something went wrong!
                </h2>
                <p className="text-slate-400">
                    An error occurred while loading this page. Please try again.
                </p>
                {error.message && (
                    <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">
                        {error.message}
                    </p>
                )}
                <Button onClick={reset} className="mx-auto">
                    <RefreshCw size={16} className="mr-2" />
                    Try again
                </Button>
            </div>
        </div>
    );
}
