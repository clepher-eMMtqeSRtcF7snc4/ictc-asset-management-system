ALTER TYPE "public"."location_status" RENAME TO "building_status";--> statement-breakpoint
CREATE TABLE "building" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"code" varchar(30) NOT NULL,
	"status" "building_status" NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "building_name_unique" UNIQUE("name"),
	CONSTRAINT "building_code_unique" UNIQUE("code")
);
--> statement-breakpoint
DROP TABLE "locations" CASCADE;