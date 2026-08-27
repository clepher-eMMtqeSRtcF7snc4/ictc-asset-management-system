CREATE TYPE "public"."asset_category_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "asset_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"status" "asset_category_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
