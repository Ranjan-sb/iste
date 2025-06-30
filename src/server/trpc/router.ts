import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import { db } from '@/server/db';
import { userProfiles, roles } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { getUserSession } from '@/server/auth/server';

export function createContext(opts: { req?: Request }) {
    return {
        req: opts.req,
    };
}
export type Context = ReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
const ProfileInput = z.object({
    fullName: z.string().min(1),
    contact: z.string().optional(),
    roleId: z.number(),
    meta_data: z
        .object({
            email: z.string().email().optional(),
            university: z.string().optional(),
            department: z.string().optional(),
            bio: z.string().optional(),
            skills: z
                .array(
                    z.object({
                        id: z.string(),
                        name: z.string(),
                        category: z.string(),
                        level: z.string().optional(),
                    }),
                )
                .optional(),
            certifications: z
                .array(
                    z.object({
                        id: z.string(),
                        name: z.string(),
                        issuer: z.string(),
                        issueDate: z.string(),
                        expiryDate: z.string().optional(),
                        type: z.string(),
                    }),
                )
                .optional(),
            awards: z
                .array(
                    z.object({
                        id: z.string(),
                        name: z.string(),
                        awardFor: z.string(),
                        issuingOrganization: z.string(),
                        issueDate: z.string(),
                        description: z.string(),
                    }),
                )
                .optional(),
            projects: z
                .array(
                    z.object({
                        id: z.string(),
                        name: z.string(),
                        role: z.string(),
                        collaborators: z.string(),
                        publicationDate: z.string(),
                        abstract: z.string(),
                    }),
                )
                .optional(),
            journals: z
                .array(
                    z.object({
                        id: z.string(),
                        title: z.string(),
                        status: z.string(),
                        publicationDate: z.string(),
                        collaborators: z.string(),
                        file: z.any().optional(),
                    }),
                )
                .optional(),
            patents: z
                .array(
                    z.object({
                        id: z.string(),
                        name: z.string(),
                        patentFor: z.string(),
                        collaborators: z.string(),
                        awardedDate: z.string(),
                        awardingBody: z.string(),
                    }),
                )
                .optional(),
        })
        .optional(),
});

const ProfileUpdateInput = ProfileInput.partial();
export const profileRouter = router({
    getProfile: publicProcedure.query(async ({ ctx }) => {
        const headers = ctx.req ? new Headers(ctx.req.headers) : new Headers();
        const session = await getUserSession(headers);

        if (!session?.user) {
            throw new Error('Unauthorized');
        }

        const [profile] = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.userId, session.user.id));

        return profile || null;
    }),
    updateProfile: publicProcedure
        .input(ProfileUpdateInput)
        .mutation(async ({ input, ctx }) => {
            const headers = ctx.req
                ? new Headers(ctx.req.headers)
                : new Headers();
            const session = await getUserSession(headers);
            if (!session?.user) throw new Error('Unauthorized');

            // Update the user's own profile
            const [updatedProfile] = await db
                .update(userProfiles)
                .set({ ...input, updatedAt: new Date() })
                .where(eq(userProfiles.userId, session.user.id))
                .returning();

            return updatedProfile;
        }),
    createProfile: publicProcedure
        .input(ProfileInput)
        .mutation(async ({ input, ctx }) => {
            const headers = ctx.req
                ? new Headers(ctx.req.headers)
                : new Headers();
            const session = await getUserSession(headers);
            if (!session?.user) throw new Error('Unauthorized');
            const [profile] = await db
                .insert(userProfiles)
                .values({
                    ...input,
                    userId: session.user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();
            return profile;
        }),
    getRoles: publicProcedure.query(async () => {
        return db.select().from(roles);
    }),
});

export const appRouter = router({
    hello: publicProcedure.query(() => 'Hello world'),
    profile: profileRouter,
});
export type AppRouter = typeof appRouter;
