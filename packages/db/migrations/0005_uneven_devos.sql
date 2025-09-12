ALTER TABLE "embedding" ADD COLUMN "content_hash" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_hash_index" ON "embedding" USING btree ("content_hash");