ALTER TABLE "asset_types" ADD COLUMN "asset_category_id" integer;--> statement-breakpoint
ALTER TABLE "asset_types" ADD CONSTRAINT "asset_types_asset_category_id_asset_category_id_fk" FOREIGN KEY ("asset_category_id") REFERENCES "public"."asset_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_types" DROP COLUMN "category_id";