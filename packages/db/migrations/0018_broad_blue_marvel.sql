ALTER TABLE "teamspace" ADD COLUMN "is_private" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "teamspace" ADD COLUMN "owner_user_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamspace" ADD CONSTRAINT "teamspace_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
