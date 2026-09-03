ALTER TABLE "user" DROP CONSTRAINT "user_employee_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_employee_id_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "employee_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE set null ON UPDATE no action;