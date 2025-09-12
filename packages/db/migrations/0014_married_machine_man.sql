ALTER TABLE "blob" ADD COLUMN "order" integer;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "project_order_unique" ON "blob" USING btree ("project_id","order");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "row_order_unique" ON "blob" USING btree ("row_id","order");