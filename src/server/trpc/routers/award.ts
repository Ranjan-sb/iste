import { z } from 'zod';
import { db } from '@/server/db';
import { awards, awardApplications } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getUserSession } from '@/server/auth/server';
import { router, publicProcedure, getAuthenticatedSession } from '../lib';

// Award input schemas
const CreateAwardInput = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(['student', 'faculty', 'institution']),
    eligibilityLevel: z.array(z.string()).default([]),
    eligibilityStates: z.array(z.string()).default([]),
    eligibilityBranches: z.array(z.string()).default([]),
    maxAge: z.number().optional(),
    specialRequirements: z.array(z.string()).default([]),
    submissionDeadline: z.string().transform((str) => new Date(str)),
    evaluationDeadline: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
    resultDeadline: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
    customFields: z.array(z.any()).default([]), // Question objects from form builder
});

const UpdateAwardInput = CreateAwardInput.partial().extend({
    id: z.number(),
});

export const awardRouter = router({
    // Create new award
    createAward: publicProcedure
        .input(CreateAwardInput)
        .mutation(async ({ input, ctx }) => {
            const session = await getAuthenticatedSession(ctx);

            const [award] = await db
                .insert(awards)
                .values({
                    ...input,
                    createdBy: session.user.id,
                    eligibilityLevel: input.eligibilityLevel,
                    eligibilityStates: input.eligibilityStates,
                    eligibilityBranches: input.eligibilityBranches,
                    specialRequirements: input.specialRequirements,
                    customFields: input.customFields,
                    isPublished: true, // Auto-publish awards when created
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();

            return award;
        }),

    // Get all awards (published ones for public, all for creators/admins)
    getAwards: publicProcedure
        .input(
            z
                .object({
                    includeUnpublished: z.boolean().default(false),
                })
                .optional(),
        )
        .query(async ({ input, ctx }) => {
            const headers = ctx.req
                ? new Headers(ctx.req.headers)
                : new Headers();
            const session = await getUserSession(headers);

            // If not authenticated or not requesting unpublished, only show published awards
            if (!session?.user || !input?.includeUnpublished) {
                return await db
                    .select()
                    .from(awards)
                    .where(eq(awards.isPublished, true))
                    .orderBy(desc(awards.createdAt));
            }

            return await db
                .select()
                .from(awards)
                .orderBy(desc(awards.createdAt));
        }),

    // Get single award by ID
    getAward: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const [award] = await db
                .select()
                .from(awards)
                .where(eq(awards.id, input.id));

            return award || null;
        }),

    // Update award (only by creator)
    updateAward: publicProcedure
        .input(UpdateAwardInput)
        .mutation(async ({ input, ctx }) => {
            const session = await getAuthenticatedSession(ctx);

            const { id, ...updateData } = input;

            // Check if user owns this award
            const [existingAward] = await db
                .select()
                .from(awards)
                .where(eq(awards.id, id));

            if (!existingAward || existingAward.createdBy !== session.user.id) {
                throw new Error(
                    'Unauthorized: You can only edit your own awards',
                );
            }

            const [updatedAward] = await db
                .update(awards)
                .set({
                    ...updateData,
                    updatedAt: new Date(),
                })
                .where(eq(awards.id, id))
                .returning();

            return updatedAward;
        }),

    // Publish award (make it available for applications)
    publishAward: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const session = await getAuthenticatedSession(ctx);

            // Check if user owns this award
            const [existingAward] = await db
                .select()
                .from(awards)
                .where(eq(awards.id, input.id));

            if (!existingAward || existingAward.createdBy !== session.user.id) {
                throw new Error(
                    'Unauthorized: You can only publish your own awards',
                );
            }

            const [publishedAward] = await db
                .update(awards)
                .set({
                    isPublished: true,
                    updatedAt: new Date(),
                })
                .where(eq(awards.id, input.id))
                .returning();

            return publishedAward;
        }),

    // Get user's created awards
    getMyAwards: publicProcedure.query(async ({ ctx }) => {
        const session = await getAuthenticatedSession(ctx);

        return await db
            .select()
            .from(awards)
            .where(eq(awards.createdBy, session.user.id))
            .orderBy(desc(awards.createdAt));
    }),

    // Delete award (only by creator, only if no applications)
    deleteAward: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const session = await getAuthenticatedSession(ctx);

            // Check if user owns this award
            const [existingAward] = await db
                .select()
                .from(awards)
                .where(eq(awards.id, input.id));

            if (!existingAward || existingAward.createdBy !== session.user.id) {
                throw new Error(
                    'Unauthorized: You can only delete your own awards',
                );
            }

            // Check if there are any applications
            const applications = await db
                .select()
                .from(awardApplications)
                .where(eq(awardApplications.awardId, input.id));

            if (applications.length > 0) {
                throw new Error(
                    'Cannot delete award with existing applications',
                );
            }

            await db.delete(awards).where(eq(awards.id, input.id));

            return { success: true };
        }),
});
