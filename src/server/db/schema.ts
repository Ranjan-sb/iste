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
