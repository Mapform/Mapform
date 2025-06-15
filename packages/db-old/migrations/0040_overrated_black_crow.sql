ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_title_column_id_column_id_fk";
--> statement-breakpoint
ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_description_column_id_column_id_fk";
--> statement-breakpoint
ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_icon_column_id_column_id_fk";
--> statement-breakpoint
ALTER TABLE "point_layer" DROP COLUMN IF EXISTS "title_column_id";--> statement-breakpoint
ALTER TABLE "point_layer" DROP COLUMN IF EXISTS "description_column_id";--> statement-breakpoint
ALTER TABLE "point_layer" DROP COLUMN IF EXISTS "icon_column_id";--> statement-breakpoint
ALTER TABLE "point_layer" DROP COLUMN IF EXISTS "color";