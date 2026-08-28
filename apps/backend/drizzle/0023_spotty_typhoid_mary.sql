CREATE TABLE "asset_condition" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"status" "asset_status_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(150),
	"updated_by" varchar(150),
	CONSTRAINT "asset_condition_name_unique" UNIQUE("name"),
	CONSTRAINT "asset_condition_code_unique" UNIQUE("code")
);
