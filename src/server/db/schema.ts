import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    integer,
    jsonb,
} from 'drizzle-orm/pg-core';
import { users } from './auth-schema';

export const hello = pgTable('hello', {
    id: serial('id').primaryKey(),
    greeting: text('greeting').notNull(),
});

// Auth schema
export * from './auth-schema';

// User roles table
export const roles = pgTable('roles', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(), // e.g., student, faculty, admin
    description: text('description'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// User profiles table (extensible fields)
export const userProfiles = pgTable('user_profiles', {
    id: serial('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .unique()
        .references(() => users.id, { onDelete: 'cascade' }),
    roleId: integer('role_id')
        .notNull()
        .references(() => roles.id, { onDelete: 'restrict' }),
    // Common fields
    fullName: text('full_name').notNull(),
    contact: text('contact'),
    // Extensible JSON field for role-specific fields
    meta_data: jsonb('meta_data').notNull().default('{}'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Awards table - stores award templates/types created by users
export const awards = pgTable('awards', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    category: text('category').notNull(), // student, faculty, institution
    createdBy: text('created_by')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    // Eligibility criteria
    eligibilityLevel: jsonb('eligibility_level').default('[]'), // ['UG', 'PG', etc.]
    eligibilityStates: jsonb('eligibility_states').default('[]'), // ['Maharashtra', etc.]
    eligibilityBranches: jsonb('eligibility_branches').default('[]'), // ['Civil', etc.]
    maxAge: integer('max_age'),
    specialRequirements: jsonb('special_requirements').default('[]'), // Array of strings

    // Deadlines
    submissionDeadline: timestamp('submission_deadline').notNull(),
    evaluationDeadline: timestamp('evaluation_deadline'),
    resultDeadline: timestamp('result_deadline'),

    // Form configuration
    customFields: jsonb('custom_fields').notNull().default('[]'), // Array of Question objects

    // Status
    isActive: boolean('is_active').notNull().default(true),
    isPublished: boolean('is_published').notNull().default(false),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Award applications table - stores user applications to awards
export const awardApplications = pgTable('award_applications', {
    id: serial('id').primaryKey(),
    awardId: integer('award_id')
        .notNull()
        .references(() => awards.id, { onDelete: 'cascade' }),
    applicantId: text('applicant_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    // Application data
    formData: jsonb('form_data').notNull().default('{}'), // User's form responses
    status: text('status').notNull().default('draft'), // draft, submitted, under_review, accepted, rejected

    // Timestamps
    submittedAt: timestamp('submitted_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Award evaluations table - for tracking evaluation process
export const awardEvaluations = pgTable('award_evaluations', {
    id: serial('id').primaryKey(),
    applicationId: integer('application_id')
        .notNull()
        .references(() => awardApplications.id, { onDelete: 'cascade' }),
    evaluatorId: text('evaluator_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    score: integer('score'), // 0-100
    comments: text('comments'),
    recommendation: text('recommendation'), // accept, reject, revise

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Files table - stores uploaded file metadata
export const files = pgTable('files', {
    id: serial('id').primaryKey(),
    filename: text('filename').notNull(), // Original filename
    storedFilename: text('stored_filename').notNull(), // Unique filename on disk
    mimetype: text('mimetype').notNull(),
    size: integer('size').notNull(), // File size in bytes
    uploadedBy: text('uploaded_by')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    applicationId: integer('application_id').references(
        () => awardApplications.id,
        { onDelete: 'cascade' },
    ),
    fieldId: text('field_id'), // Which form field this file belongs to
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
