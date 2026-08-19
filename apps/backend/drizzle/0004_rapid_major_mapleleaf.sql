CREATE TYPE "public"."location_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "locations_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE INDEX "locations_status_idx" ON "locations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "locations_type_idx" ON "locations" USING btree ("type");