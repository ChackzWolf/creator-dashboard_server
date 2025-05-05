import dotenv from 'dotenv';
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    MONGO_URI: process.env.MONGO_URI || "Can't access MongoDB URI",

    JWT_SECRET: process.env.JWT_SECRET || "Can't access JWT secret",

    CLIENT_URL: process.env.CLIENT_URL || '',

    REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID || '',
    REDDIT_REDIRECT_URI: process.env.REDDIT_REDIRECT_URI || '',
    REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET || '',
}