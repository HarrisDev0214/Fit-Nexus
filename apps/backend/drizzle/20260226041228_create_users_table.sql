CREATE TYPE "public"."sex_enum" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"password_hash" varchar(256) NOT NULL,
	"name" varchar(30) NOT NULL,
	"avatar" text,
	"sex" "sex_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
