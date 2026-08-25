ALTER TABLE "department" ADD COLUMN "supervisor_id" integer;--> statement-breakpoint
ALTER TABLE "department" ADD COLUMN "custodian_id" integer;--> statement-breakpoint
ALTER TABLE "department" DROP COLUMN "supervisor";--> statement-breakpoint
ALTER TABLE "department" DROP COLUMN "custodian";