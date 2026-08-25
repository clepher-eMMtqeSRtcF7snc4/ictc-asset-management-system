DO $$ BEGIN CREATE TYPE "public"."employee_status_new" AS ENUM('active', 'casual', 'contractual', 'deceased', 'end-of-contract', 'inactive', 'job-order', 'on-leave', 'permanent', 'probationary', 'retired', 'suspended', 'temporary', 'terminated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "status" SET DATA TYPE "public"."employee_status_new" USING "status"::text::"public"."employee_status_new";
--> statement-breakpoint
DROP TYPE "public"."employee_status";
--> statement-breakpoint
ALTER TYPE "public"."employee_status_new" RENAME TO "employee_status";
