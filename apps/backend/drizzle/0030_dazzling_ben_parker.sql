CREATE TYPE "public"."permission_status" AS ENUM('active', 'inactive');--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "status" "permission_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
CREATE INDEX "role_permissions_roleId_idx" ON "role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX "user_roles_userId_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_roles_roleId_idx" ON "user_roles" USING btree ("role_id");