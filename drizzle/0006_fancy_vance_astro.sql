ALTER TABLE "awards" ADD COLUMN "department" text NOT NULL;--> statement-breakpoint
ALTER TABLE "awards" ADD COLUMN "semester_year" text;--> statement-breakpoint
ALTER TABLE "awards" ADD COLUMN "is_member" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "awards" ADD COLUMN "institution_address" text NOT NULL;