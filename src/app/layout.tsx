import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

/**
 * Root Layout
 *
 * The main layout component that wraps all pages.
 * Includes the header and global styles.
 */

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        default: "GetNotes - Developer Note-Taking",
        template: "%s | GetNotes",
    },
    description:
        "A powerful note-taking application designed for developers. Organize your coding notes with categories, subcategories, and markdown support.",
    keywords: [
        "notes",
        "developer",
        "coding",
        "markdown",
        "code snippets",
        "programming",
    ],
    authors: [{ name: "GetNotes" }],
    openGraph: {
        title: "GetNotes - Developer Note-Taking",
        description:
            "A powerful note-taking application designed for developers.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="min-h-screen">
                <Header />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </main>
            </body>
        </html>
    );
}
