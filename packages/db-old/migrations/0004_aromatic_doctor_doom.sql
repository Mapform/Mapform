ALTER TABLE "boolean_cell" ADD CONSTRAINT "bool_cell_unq" UNIQUE("cell_id");--> statement-breakpoint
ALTER TABLE "date_cell" ADD CONSTRAINT "date_cell_unq" UNIQUE("cell_id");--> statement-breakpoint
ALTER TABLE "number_cell" ADD CONSTRAINT "number_cell_unq" UNIQUE("cell_id");--> statement-breakpoint
ALTER TABLE "point_cell" ADD CONSTRAINT "point_cell_unq" UNIQUE("cell_id");--> statement-breakpoint
ALTER TABLE "richtext_cell" ADD CONSTRAINT "richtext_cell_unq" UNIQUE("cell_id");