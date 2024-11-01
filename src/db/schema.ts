import { pgTable, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
  'users',
  {
    id: uuid('uuid1').defaultRandom().unique(),
    firstName: varchar({ length: 255 }).notNull(),
    lastName: varchar({ length: 255 }),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 72 }).notNull(),
  },
  (table) => {
    return {
      email: uniqueIndex('email_idx').on(table.email),
    };
  },
);
