import dotenv from 'dotenv';
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    MONGO_URI: process.env.MONGO_URI || 'NA',

    JWT_SECRET: process.env.JWT_SECRET || 'Na',

    CLIENT_URL: process.env.CLIENT_URL || '',
}