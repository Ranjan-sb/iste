import { z } from 'zod';
import { db } from '@/server/db';
import { awards, awardApplications, files } from '@/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { router, publicProcedure, getAuthenticatedSession } from '../lib';

// Award Application input schemas
const SubmitApplicationInput = z.object({
    awardId: z.number(),
    formData: z.record(z.any()), // Key-value pairs of form responses
});

export const applicationRouter = router({
    // Submit application
    submitApplication: publicProcedure
        .input(SubmitApplicationInput)
        .mutation(async ({ input, ctx }) => {
            const session = await getAuthenticatedSession(ctx);

            // Check if award exists and is open
            const [award] = await db
                .select()
                .from(awards)
                .where(eq(awards.id, input.awardId));

            if (!award) {
                throw new Error('Award not found');
            }

            if (new Date() > new Date(award.submissionDeadline)) {
                throw new Error('Application deadline has passed');
            }

            // Check if user already has an application for this award
            const [existingApplication] = await db
                .select()
                .from(awardApplications)
                .where(
                    and(
                        eq(awardApplications.awardId, input.awardId),
                        eq(awardApplications.applicantId, session.user.id),
                    ),
                );

            let applicationResult;

            if (existingApplication) {
                // Check if the application is already submitted
                if (existingApplication.status === 'submitted') {
                    throw new Error(
                        'You have already submitted an application for this award. Multiple applications are not allowed.',
                    );
                }

                // Only allow updating if it's still a draft
                const [updatedApplication] = await db
                    .update(awardApplications)
                    .set({
                        formData: input.formData,
                        status: 'submitted',
                        submittedAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(eq(awardApplications.id, existingApplication.id))
                    .returning();

                applicationResult = updatedApplication;
            } else {
                // Create new application
                const [newApplication] = await db
                    .insert(awardApplications)
                    .values({
                        awardId: input.awardId,
                        applicantId: session.user.id,
                        formData: input.formData,
                        status: 'submitted',
                        submittedAt: new Date(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();

                applicationResult = newApplication;
            }

            // Link uploaded files to this application
            if (applicationResult) {
                // Find file IDs in the form data
                const fileIds: number[] = [];
                Object.values(input.formData).forEach((value: any) => {
                    if (
                        value &&
                        typeof value === 'object' &&
                        value.id &&
                        typeof value.id === 'number'
                    ) {
                        fileIds.push(value.id);
                    }
                });

                // Update files to link them to this application
                if (fileIds.length > 0) {
                    for (const fileId of fileIds) {
                        await db
                            .update(files)
                            .set({ applicationId: applicationResult.id })
                            .where(
                                and(
                                    eq(files.id, fileId),
                                    eq(files.uploadedBy, session.user.id),
                                ),
                            );
                    }
                }
            }

            return applicationResult;
        }),

    // Get user's applications
    getMyApplications: publicProcedure.query(async ({ ctx }) => {
        const session = await getAuthenticatedSession(ctx);

        // Get applications with award details
        const applications = await db
            .select({
                id: awardApplications.id,
                awardId: awardApplications.awardId,
                formData: awardApplications.formData,
                status: awardApplications.status,
                submittedAt: awardApplications.submittedAt,
                createdAt: awardApplications.createdAt,
                updatedAt: awardApplications.updatedAt,
                awardName: awards.name,
                awardDescription: awards.description,
                awardCategory: awards.category,
                submissionDeadline: awards.submissionDeadline,
            })
            .from(awardApplications)
            .innerJoin(awards, eq(awardApplications.awardId, awards.id))
            .where(eq(awardApplications.applicantId, session.user.id))
            .orderBy(desc(awardApplications.updatedAt));

        return applications;
    }),

    // Get single application by ID
    getApplication: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input, ctx }) => {
            const session = await getAuthenticatedSession(ctx);

            const [application] = await db
                .select({
                    id: awardApplications.id,
                    awardId: awardApplications.awardId,
                    formData: awardApplications.formData,
                    status: awardApplications.status,
                    submittedAt: awardApplications.submittedAt,
                    createdAt: awardApplications.createdAt,
                    updatedAt: awardApplications.updatedAt,
                    awardName: awards.name,
                    awardDescription: awards.description,
                    awardCategory: awards.category,
                    customFields: awards.customFields,
                    submissionDeadline: awards.submissionDeadline,
                })
                .from(awardApplications)
                .innerJoin(awards, eq(awardApplications.awardId, awards.id))
                .where(
                    and(
                        eq(awardApplications.id, input.id),
                        eq(awardApplications.applicantId, session.user.id),
                    ),
                );

            return application || null;
        }),

    // Save draft application
    saveDraft: publicProcedure
        .input(SubmitApplicationInput)
        .mutation(async ({ input, ctx }) => {
            const session = await getAuthenticatedSession(ctx);

            // Check if award exists
            const [award] = await db
                .select()
                .from(awards)
                .where(eq(awards.id, input.awardId));

            if (!award) {
                throw new Error('Award not found');
            }

            // Check if user already has a draft for this award
            const [existingApplication] = await db
                .select()
                .from(awardApplications)
                .where(
                    and(
                        eq(awardApplications.awardId, input.awardId),
                        eq(awardApplications.applicantId, session.user.id),
                    ),
                );

            let applicationResult;

            if (existingApplication) {
                // Update existing draft
                const [updatedApplication] = await db
                    .update(awardApplications)
                    .set({
                        formData: input.formData,
                        updatedAt: new Date(),
                    })
                    .where(eq(awardApplications.id, existingApplication.id))
                    .returning();

                applicationResult = updatedApplication;
            } else {
                // Create new draft
                const [newApplication] = await db
                    .insert(awardApplications)
                    .values({
                        awardId: input.awardId,
                        applicantId: session.user.id,
                        formData: input.formData,
                        status: 'draft',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();

                applicationResult = newApplication;
            }

            // Link uploaded files to this application (for drafts too)
            if (applicationResult) {
                // Find file IDs in the form data
                const fileIds: number[] = [];
                Object.values(input.formData).forEach((value: any) => {
                    if (
                        value &&
                        typeof value === 'object' &&
                        value.id &&
                        typeof value.id === 'number'
                    ) {
                        fileIds.push(value.id);
                    }
                });

                // Update files to link them to this application
                if (fileIds.length > 0) {
                    for (const fileId of fileIds) {
                        await db
                            .update(files)
                            .set({ applicationId: applicationResult.id })
                            .where(
                                and(
                                    eq(files.id, fileId),
                                    eq(files.uploadedBy, session.user.id),
                                ),
                            );
                    }
                }
            }

            return applicationResult;
        }),

    // Check if user has already applied to an award
    hasUserApplied: publicProcedure
        .input(z.object({ awardId: z.number() }))
        .query(async ({ input, ctx }) => {
            const session = await getAuthenticatedSession(ctx);

            const [existingApplication] = await db
                .select({
                    id: awardApplications.id,
                    status: awardApplications.status,
                    submittedAt: awardApplications.submittedAt,
                })
                .from(awardApplications)
                .where(
                    and(
                        eq(awardApplications.awardId, input.awardId),
                        eq(awardApplications.applicantId, session.user.id),
                    ),
                );

            return {
                hasApplied: !!existingApplication,
                status: existingApplication?.status || null,
                submittedAt: existingApplication?.submittedAt || null,
                applicationId: existingApplication?.id || null,
            };
        }),
});
