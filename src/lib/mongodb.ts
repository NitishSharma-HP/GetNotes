import mongoose from "mongoose";

/**
 * MongoDB connection singleton for serverless environment
 * 
 * In serverless environments (like Vercel), we need to cache the database
 * connection to prevent creating new connections on every request.
 * 
 * This uses the global object to persist the connection across hot reloads
 * during development and across function invocations in production.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

// Extend the global type to include our cached connection
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

// Initialize the cached connection object
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB (cached)
 * 
 * Returns the existing connection if available, otherwise creates a new one.
 * The connection is cached in the global object to persist across requests.
 */
async function dbConnect(): Promise<typeof mongoose> {
    // Return cached connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // If no promise exists, create a new connection
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering for faster error detection
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
            console.log("MongoDB connected successfully");
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
