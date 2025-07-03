import { router, publicProcedure, createContext } from './lib';
import { profileRouter } from './routers/profile';
import { awardRouter } from './routers/award';
import { applicationRouter } from './routers/application';

export { createContext };
export type Context = ReturnType<typeof createContext>;

export const appRouter = router({
    hello: publicProcedure.query(() => 'Hello world'),
    profile: profileRouter,
    award: awardRouter,
    application: applicationRouter,
});

export type AppRouter = typeof appRouter;
