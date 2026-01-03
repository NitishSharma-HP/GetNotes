# GetNotes

A note-taking web application for developers, built with Next.js 15, TypeScript, Tailwind CSS, and MongoDB.

## Features

- 📁 **Hierarchical Organization**: Categories → Subcategories → Notes
- ✍️ **Developer-Friendly Editor**: CodeMirror-based editor with syntax highlighting
- 💾 **Autosave**: Notes automatically save after 2 seconds of inactivity
- 🎨 **Modern UI**: Sleek dark theme with smooth animations
- ⚡ **Fast**: Server Components, optimized data fetching
- 📱 **Responsive**: Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB Atlas
- **Editor**: CodeMirror 6
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- MongoDB Atlas account (free tier works)

### 1. Clone and Install

```bash
cd GetNotes
npm install
```
## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── category/          # Category routes
│   │   └── [categoryId]/
│   │       ├── page.tsx
│   │       └── subcategory/
│   │           └── [subcategoryId]/
│   │               ├── page.tsx
│   │               └── note/
│   │                   └── [noteId]/
│   │                       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── actions/               # Server Actions (CRUD)
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── categories/
│   ├── subcategories/
│   └── notes/
├── lib/                   # Utilities
├── models/               # Mongoose models
└── types/                # TypeScript types

## Database Schema

### Category
```typescript
{
  _id: ObjectId,
  title: string,
  description?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Subcategory
```typescript
{
  _id: ObjectId,
  title: string,
  description?: string,
  categoryId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Note
```typescript
{
  _id: ObjectId,
  title: string,
  content: string,  // Markdown/plain text
  subcategoryId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## License

MIT
