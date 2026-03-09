import { pgTable, uuid, varchar, pgEnum, timestamp, text } from 'drizzle-orm/pg-core';

export const sexEnum = pgEnum('sex_enum', ['male', 'female']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 256 }).notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  avatar: text('avatar'),
  sex: sexEnum('sex').notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date())
});
