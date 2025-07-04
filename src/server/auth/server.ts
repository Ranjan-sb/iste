import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/server/db';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';
import { sendEmail } from '@/lib/email';
import {
    createVerificationEmail,
    createResetPasswordEmail,
} from '@/lib/email-templates';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true,
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
    trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL!,
        'http://localhost:3000',
        'https://iste-jeevnaa.vercel.app',
        'https://iste-jeevna.vercel.app',
    ],
    plugins: [
        nextCookies(),
        admin({
            defaultRole: 'user',
            impersonationSessionDuration: 60 * 60 * 24,
        }),
    ],
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const { subject, html } = createVerificationEmail(url);
            await sendEmail({ to: user.email, subject, html });
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600,
    },
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
        sendResetPassword: async ({ user, url }) => {
            const { subject, html } = createResetPasswordEmail(url);
            await sendEmail({ to: user.email, subject, html });
        },
        resetPasswordTokenExpiresIn: 3600,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
        cookieOptions: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain:
                process.env.NODE_ENV === 'production'
                    ? '.vercel.app'
                    : undefined,
        },
    },
});

export async function getUserSession(headers?: Headers) {
    return auth.api.getSession({
        headers: headers ?? new Headers(),
    });
}
