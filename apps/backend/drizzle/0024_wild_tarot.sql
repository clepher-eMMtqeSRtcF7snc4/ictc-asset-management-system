CREATE TYPE "public"."asset_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."supplier_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "asset" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_name" varchar(150) NOT NULL,
	"brand" varchar(150) NOT NULL,
	"model" varchar(150) NOT NULL,
	"serial_number" varchar(150) NOT NULL,
	"property_number" varchar(150) NOT NULL,
	"qr_code" varchar(255) NOT NULL,
	"description" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"asset_photo" text,
	"category_id" integer NOT NULL,
	"asset_type_id" integer NOT NULL,
	"condition_id" integer NOT NULL,
	"acquisition_date" timestamp NOT NULL,
	"acquisition_cost" numeric(12, 2) NOT NULL,
	"supplier_id" integer,
	"purchase_order_number" varchar(150),
	"warranty" varchar(255),
	"supporting_docs" text,
	"department_id" integer NOT NULL,
	"custodian_id" integer NOT NULL,
	"building_id" integer,
	"room_id" integer,
	"status" "asset_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text,
	CONSTRAINT "asset_serial_number_unique" UNIQUE("serial_number"),
	CONSTRAINT "asset_property_number_unique" UNIQUE("property_number"),
	CONSTRAINT "asset_qr_code_unique" UNIQUE("qr_code")
);
--> statement-breakpoint
CREATE TABLE "supplier" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"business_registration_no" text,
	"phil_geps_no" text,
	"tin" text,
	"vat" boolean DEFAULT false NOT NULL,
	"description" text,
	"status" "supplier_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "supplier_name_unique" UNIQUE("name"),
	CONSTRAINT "supplier_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_category_id_asset_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."asset_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_asset_type_id_asset_types_id_fk" FOREIGN KEY ("asset_type_id") REFERENCES "public"."asset_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_condition_id_asset_condition_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."asset_condition"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_supplier_id_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_custodian_id_employee_id_fk" FOREIGN KEY ("custodian_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier" ADD CONSTRAINT "supplier_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier" ADD CONSTRAINT "supplier_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;