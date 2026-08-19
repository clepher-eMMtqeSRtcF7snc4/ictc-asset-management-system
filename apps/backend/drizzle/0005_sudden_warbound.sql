ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "departments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "follow" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
DROP TABLE "departments" CASCADE;--> statement-breakpoint
DROP TABLE "follow" CASCADE;--> statement-breakpoint
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_department_id_departments_id_fk";
--> statement-breakpoint
DROP INDEX "locations_status_idx";--> statement-breakpoint
DROP INDEX "locations_type_idx";--> statement-breakpoint
DROP INDEX "user_profiles_department_idx";--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "name" SET DATA TYPE varchar(150);--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "code" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "status" SET DATA TYPE "public"."location_status" USING "status"::"public"."location_status";--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "department_id";--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_name_unique" UNIQUE("name");