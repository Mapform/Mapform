ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_title_column_id_column_id_fk";
--> statement-breakpoint
ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_description_column_id_column_id_fk";
--> statement-breakpoint
ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_icon_column_id_column_id_fk";
--> statement-breakpoint
ALTER TABLE "layer" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."layer_type";--> statement-breakpoint
CREATE TYPE "public"."layer_type" AS ENUM('point', 'line', 'polygon');--> statement-breakpoint
ALTER TABLE "layer" ALTER COLUMN "type" SET DATA TYPE "public"."layer_type" USING "type"::"public"."layer_type";--> statement-breakpoint
ALTER TABLE "point_layer" DROP COLUMN "title_column_id";--> statement-breakpoint
ALTER TABLE "point_layer" DROP COLUMN "description_column_id";--> statement-breakpoint
ALTER TABLE "point_layer" DROP COLUMN "icon_column_id";--> statement-breakpoint
ALTER TABLE "point_layer" DROP COLUMN "color";