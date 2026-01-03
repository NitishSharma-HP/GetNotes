# GetNotes

A production-ready note-taking web application for developers, built with Next.js 15, TypeScript, Tailwind CSS, and MongoDB.

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

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (free M0 tier)
3. Click "Connect" → "Connect your application"
4. Copy the connection string

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/getnotes?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster>` with your actual values.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your repository
4. Add environment variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string
5. Click "Deploy"

### 3. Update MongoDB Network Access

In MongoDB Atlas, go to:
- Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

This allows Vercel's servers to connect to your database.

## Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

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
