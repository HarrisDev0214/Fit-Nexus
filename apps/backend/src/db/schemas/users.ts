import { pgTable, uuid, varchar, pgEnum, timestamp, text } from 'drizzle-orm/pg-core';

export const sexEnum = pgEnum('sex_enum', ['male', 'female']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 256 }).notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  avatar: text('avatar'),
  sex: sexEnum('sex').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date())
});
