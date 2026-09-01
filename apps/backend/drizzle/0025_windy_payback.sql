CREATE TYPE "public"."asset_status_enum" AS ENUM('active', 'inactive');--> statement-breakpoint
ALTER TABLE "asset" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "asset" ALTER COLUMN "status" SET DATA TYPE "public"."asset_status_enum" USING "status"::text::"public"."asset_status_enum";--> statement-breakpoint
ALTER TABLE "asset" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
DROP TYPE "public"."asset_status";