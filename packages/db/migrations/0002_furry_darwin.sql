CREATE INDEX IF NOT EXISTS "page_spatial_index" ON "page" USING gist ("center");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "point_spatial_index" ON "point_cell" USING gist ("value");