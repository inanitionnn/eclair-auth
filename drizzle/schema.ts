import { pgTable, uniqueIndex, index, unique, uuid, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	uuid1: uuid().defaultRandom(),
	firstName: varchar({ length: 255 }).notNull(),
	lastName: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 72 }).notNull(),
	jwt: varchar(),
}, (table) => {
	return {
		emailIdx: uniqueIndex("email_idx").using("btree", table.email.asc().nullsLast()),
		jwtIdx: index("jwt_idx").using("btree", table.jwt.asc().nullsLast()),
		usersUuid1Unique: unique("users_uuid1_unique").on(table.uuid1),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});
