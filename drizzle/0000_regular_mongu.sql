-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "users" (
	"uuid1" uuid DEFAULT gen_random_uuid(),
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(72) NOT NULL,
	"jwt" varchar,
	CONSTRAINT "users_uuid1_unique" UNIQUE("uuid1"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jwt_idx" ON "users" USING btree ("jwt");
*/