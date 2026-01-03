import Link from "next/link";
import { Code2 } from "lucide-react";

/**
 * Header Component
 * 
 * Main application header with logo and navigation.
 */

export default function Header() {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            GetNotes
                        </span>
                    </Link>

                    {/* Navigation - can be expanded later */}
                    <nav className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">
                            Developer Note-Taking
                        </span>
                    </nav>
                </div>
            </div>
        </header>
    );
}
