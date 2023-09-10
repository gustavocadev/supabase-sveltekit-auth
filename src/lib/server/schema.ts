import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
	id: uuid('id').primaryKey(),
	first_name: varchar('first_name', { length: 100 }),
	last_name: varchar('last_name', { length: 100 }),
	phone_number: varchar('phone_number', { length: 100 }),
	country_code: varchar('country_code', { length: 10 }),
	avatar_url: text('avatar_url'),
	phone_validate: boolean('phone_validate').default(false),

	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});
