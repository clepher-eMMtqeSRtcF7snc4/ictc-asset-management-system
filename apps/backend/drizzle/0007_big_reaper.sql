CREATE TYPE "public"."room_floor" AS ENUM('1st floor', '2nd floor', '3rd floor', '4th floor');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "room_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "room_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"code" varchar(30),
	"room_type_id" integer NOT NULL,
	"building_id" integer NOT NULL,
	"floor" "room_floor" NOT NULL,
	"department_id" integer,
	"status" "room_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_room_type_id_room_type_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_type"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;