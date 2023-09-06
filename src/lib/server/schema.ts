import { pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core';

export const profileTable = pgTable('profile', {
	id: serial('id').primaryKey(),
	last_name: varchar('last_name', { length: 100 }),
	first_name: varchar('first_name', { length: 100 }),
	email: varchar('email', { length: 100 }),
	user_id: uuid('user_id').notNull()
});
