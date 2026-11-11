import mongoose from "mongoose";

type MongooseCache = {
    promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as typeof globalThis & {
    mongooseCache?: MongooseCache
}

const cache: MongooseCache =
    globalForMongoose.mongooseCache ?? (globalForMongoose.mongooseCache = { promise: null })

async function dbConnect(): Promise<void> {

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set");
    }

    if (!cache.promise) {
        cache.promise = mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 8000,
        });
    }

    try {
        await cache.promise;
        console.log("DB connected successfully");
    }
    catch (error) {

        cache.promise = null;

        console.error("DB connection failed", error);

        throw new Error("Database connection failed");

    }

}


export default dbConnect;
