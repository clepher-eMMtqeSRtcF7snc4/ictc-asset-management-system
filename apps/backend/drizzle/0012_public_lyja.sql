CREATE TYPE "public"."designation_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."position_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "designation" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"status" "designation_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "designation_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "position" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"status" "position_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "position_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "employee" ADD COLUMN "position_id" integer;--> statement-breakpoint
ALTER TABLE "employee" ADD COLUMN "designation_id" integer;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_designation_id_designation_id_fk" FOREIGN KEY ("designation_id") REFERENCES "public"."designation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "employee" DROP COLUMN "designation";