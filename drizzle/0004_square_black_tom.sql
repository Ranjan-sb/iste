CREATE TABLE "award_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"award_id" integer NOT NULL,
	"applicant_id" text NOT NULL,
	"form_data" jsonb DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "award_evaluations" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"evaluator_id" text NOT NULL,
	"score" integer,
	"comments" text,
	"recommendation" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "awards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"created_by" text NOT NULL,
	"eligibility_level" jsonb DEFAULT '[]',
	"eligibility_states" jsonb DEFAULT '[]',
	"eligibility_branches" jsonb DEFAULT '[]',
	"max_age" integer,
	"special_requirements" jsonb DEFAULT '[]',
	"submission_deadline" timestamp NOT NULL,
	"evaluation_deadline" timestamp,
	"result_deadline" timestamp,
	"custom_fields" jsonb DEFAULT '[]' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "award_applications" ADD CONSTRAINT "award_applications_award_id_awards_id_fk" FOREIGN KEY ("award_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "award_applications" ADD CONSTRAINT "award_applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "award_evaluations" ADD CONSTRAINT "award_evaluations_application_id_award_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."award_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "award_evaluations" ADD CONSTRAINT "award_evaluations_evaluator_id_users_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "awards" ADD CONSTRAINT "awards_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;