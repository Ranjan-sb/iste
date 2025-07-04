import { z } from 'zod';

// Check if we're in build mode
const isBuildTime =
    typeof window === 'undefined' &&
    (process.env.NODE_ENV === undefined ||
        process.env.VERCEL_ENV === undefined ||
        process.env.NEXT_PHASE === 'phase-production-build');

/**
 * Server-side environment variables schema
 * Add all required server env vars here.
 */
const serverSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
    DATABASE_URL: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    // Cloudflare R2 Storage - optional
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_BUCKET_NAME: z.string().optional(),
    R2_PUBLIC_URL: z.string().optional(),
    R2_ENDPOINT: z.string().optional(),
    // Better Auth - optional during build
    BETTER_AUTH_SECRET: z.string().optional(),
    BETTER_AUTH_URL: z.string().optional(),
});

/**
 * Client-side environment variables schema
 * Add all required public env vars here (must start with NEXT_PUBLIC_)
 */
const clientSchema = z.object({
    NEXT_PUBLIC_APP_URL: z.string().optional(),
});

export function getServerEnv() {
    // During build time, skip validation and return process.env directly
    if (isBuildTime) {
        return {
            NODE_ENV:
                (process.env.NODE_ENV as
                    | 'development'
                    | 'test'
                    | 'production') || 'development',
            DATABASE_URL: process.env.DATABASE_URL,
            RESEND_API_KEY: process.env.RESEND_API_KEY,
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
            R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
            R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
            R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
            R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
            R2_ENDPOINT: process.env.R2_ENDPOINT,
            BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        };
    }

    const parsed = serverSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error(
            '❌ Invalid server environment variables:',
            parsed.error.flatten().fieldErrors,
        );

        // Fallback to process.env
        return {
            NODE_ENV:
                (process.env.NODE_ENV as
                    | 'development'
                    | 'test'
                    | 'production') || 'development',
            DATABASE_URL: process.env.DATABASE_URL,
            RESEND_API_KEY: process.env.RESEND_API_KEY,
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
            R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
            R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
            R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
            R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
            R2_ENDPOINT: process.env.R2_ENDPOINT,
            BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        };
    }
    return parsed.data;
}

function getClientEnv() {
    if (typeof window === 'undefined') {
        return {};
    }

    const parsed = clientSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error(
            '❌ Invalid client environment variables:',
            parsed.error.flatten().fieldErrors,
        );
        return {
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        };
    }
    return parsed.data;
}

let envCache: any = null;

export function getEnv() {
    if (envCache) return envCache;

    try {
        envCache = {
            ...getServerEnv(),
            ...getClientEnv(),
        };
        return envCache;
    } catch (error) {
        console.warn(
            '⚠️ Environment validation failed, using process.env directly',
        );
        return {
            NODE_ENV: process.env.NODE_ENV || 'development',
            DATABASE_URL: process.env.DATABASE_URL,
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
            BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
            R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
            R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
            R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
        };
    }
}

// Export the environment variables
export const env = getEnv();

// Usage:
// import { env } from '@/lib/env';
// env.DATABASE_URL, env.NEXT_PUBLIC_APP_URL, etc.
