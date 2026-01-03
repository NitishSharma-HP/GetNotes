import Link from "next/link";
import Button from "@/components/ui/Button";
import { FileQuestion, Home } from "lucide-react";

/**
 * 404 Not Found Page
 */
export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md px-4">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                    <FileQuestion className="w-10 h-10 text-slate-500" />
                </div>
                <h1 className="text-4xl font-bold text-slate-100">404</h1>
                <h2 className="text-xl font-medium text-slate-300">Page not found</h2>
                <p className="text-slate-400">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link href="/">
                    <Button className="mx-auto mt-4">
                        <Home size={16} className="mr-2" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
