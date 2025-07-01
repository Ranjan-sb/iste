CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"stored_filename" text NOT NULL,
	"mimetype" text NOT NULL,
	"size" integer NOT NULL,
	"uploaded_by" text NOT NULL,
	"application_id" integer,
	"field_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_application_id_award_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."award_applications"("id") ON DELETE cascade ON UPDATE no action;