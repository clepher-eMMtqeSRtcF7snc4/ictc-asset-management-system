CREATE TYPE "public"."asset_type_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "asset_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"code" varchar(50) NOT NULL,
	"category_id" integer NOT NULL,
	"description" text,
	"depreciable" boolean NOT NULL,
	"default_useful_life" integer,
	"status" "asset_type_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(255),
	"updated_by" varchar(255),
	CONSTRAINT "asset_types_code_unique" UNIQUE("code")
);
