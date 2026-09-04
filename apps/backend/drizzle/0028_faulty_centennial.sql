ALTER TABLE "permissions" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "permissions_code_unique_idx" ON "permissions" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_code_unique_idx" ON "roles" USING btree ("code");--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_employee_id_unique" UNIQUE("employee_id");