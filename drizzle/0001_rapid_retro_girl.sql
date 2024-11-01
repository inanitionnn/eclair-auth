DROP INDEX IF EXISTS "jwt_idx";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "jwt";