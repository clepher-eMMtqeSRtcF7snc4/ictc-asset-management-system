CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "departments_code_unique" UNIQUE("code")
);

--> statement-breakpoint
CREATE INDEX "categories_status_idx" ON "categories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "categories_type_idx" ON "categories" USING btree ("type");--> statement-breakpoint
CREATE INDEX "departments_status_idx" ON "departments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "departments_type_idx" ON "departments" USING btree ("type");--> statement-breakpoint
