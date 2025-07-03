import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
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

// Helper function to get authenticated session
export const getAuthenticatedSession = async (ctx: Context) => {
    const headers = ctx.req ? new Headers(ctx.req.headers) : new Headers();
    const session = await getUserSession(headers);

    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    return session;
};
