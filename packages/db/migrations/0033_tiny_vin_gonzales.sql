DROP TABLE "stream" CASCADE;--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "active_stream_id" uuid;