CREATE TABLE "asset_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"actor_user_id" text,
	"action" text NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"asset_type" text,
	"category_id" integer NOT NULL,
	"department_id" integer,
	"location_id" integer,
	"custodian_id" text,
	"brand" text,
	"model" text,
	"description" text,
	"condition" text,
	"serial_number" text,
	"barcode" text,
	"part_number" text,
	"acquisition_date" date,
	"purchase_date" date,
	"acquisition_cost" numeric(14, 2),
	"supplier" text,
	"reference" text,
	"funding_source" text,
	"warranty_start_date" date,
	"warranty_end_date" date,
	"useful_life" integer,
	"residual_value" numeric(14, 2),
	"depreciation_method" text,
	"image_url" text,
	"asset_tag" text NOT NULL,
	"property_number" text NOT NULL,
	"qr_value" text NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "assets_serial_number_unique" UNIQUE("serial_number"),
	CONSTRAINT "assets_asset_tag_unique" UNIQUE("asset_tag"),
	CONSTRAINT "assets_property_number_unique" UNIQUE("property_number"),
	CONSTRAINT "assets_qr_value_unique" UNIQUE("qr_value")
);
--> statement-breakpoint
ALTER TABLE "asset_history" ADD CONSTRAINT "asset_history_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_history" ADD CONSTRAINT "asset_history_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_custodian_id_user_id_fk" FOREIGN KEY ("custodian_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "asset_history_asset_created_idx" ON "asset_history" USING btree ("asset_id","created_at");--> statement-breakpoint
CREATE INDEX "asset_history_actor_idx" ON "asset_history" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "assets_category_idx" ON "assets" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "assets_department_idx" ON "assets" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "assets_location_idx" ON "assets" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "assets_custodian_idx" ON "assets" USING btree ("custodian_id");--> statement-breakpoint
CREATE INDEX "assets_status_idx" ON "assets" USING btree ("status");