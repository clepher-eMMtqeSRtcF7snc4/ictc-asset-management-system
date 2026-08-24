ALTER TABLE "employee" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."employee_status";--> statement-breakpoint
CREATE TYPE "public"."employee_status" AS ENUM('active', 'casual', 'contractual', 'deceased', 'end-of-contract', 'inactive', 'on-leave', 'permanent', 'probationary', 'retired', 'suspended', 'temporary', 'terminated');--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."employee_status";--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "status" SET DATA TYPE "public"."employee_status" USING "status"::"public"."employee_status";