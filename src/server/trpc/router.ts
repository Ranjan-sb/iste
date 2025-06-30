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
    extra: z.record(z.any()).optional(),
});

const ProfileUpdateInput = ProfileInput.partial().extend({ id: z.number() });
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
            await db
                .update(userProfiles)
                .set({ ...input, updatedAt: new Date() })
                .where(eq(userProfiles.id, input.id));
            return { success: true };
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
