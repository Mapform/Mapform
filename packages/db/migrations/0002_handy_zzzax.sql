CREATE TABLE IF NOT EXISTS "boolean_cell" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" boolean,
	"cell_id" uuid NOT NULL,
	CONSTRAINT "bool_cell_unq" UNIQUE("cell_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cell" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"row_id" uuid NOT NULL,
	"column_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cell_row_id_column_id_unique" UNIQUE("row_id","column_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "date_cell" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" timestamp with time zone,
	"cell_id" uuid NOT NULL,
	CONSTRAINT "date_cell_unq" UNIQUE("cell_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "number_cell" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" numeric,
	"cell_id" uuid NOT NULL,
	CONSTRAINT "number_cell_unq" UNIQUE("cell_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "string_cell" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text,
	"cell_id" uuid NOT NULL,
	CONSTRAINT "string_cell_unq" UNIQUE("cell_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boolean_cell" ADD CONSTRAINT "boolean_cell_cell_id_cell_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cell"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cell" ADD CONSTRAINT "cell_row_id_row_id_fk" FOREIGN KEY ("row_id") REFERENCES "public"."row"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cell" ADD CONSTRAINT "cell_column_id_column_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."column"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "date_cell" ADD CONSTRAINT "date_cell_cell_id_cell_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cell"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "number_cell" ADD CONSTRAINT "number_cell_cell_id_cell_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cell"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "string_cell" ADD CONSTRAINT "string_cell_cell_id_cell_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cell"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
