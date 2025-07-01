import { z } from 'zod';
import { db } from '@/server/db';
import { userProfiles, roles } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { router, publicProcedure, getAuthenticatedSession } from '../lib';

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
        const session = await getAuthenticatedSession(ctx);

        const [profile] = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.userId, session.user.id));

        return profile || null;
    }),

    updateProfile: publicProcedure
        .input(ProfileUpdateInput)
        .mutation(async ({ input, ctx }) => {
            const session = await getAuthenticatedSession(ctx);

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
            const session = await getAuthenticatedSession(ctx);

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
