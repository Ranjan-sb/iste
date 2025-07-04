ALTER TABLE "files" ADD COLUMN "r2_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "r2_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "public_url" text;--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN "stored_filename";