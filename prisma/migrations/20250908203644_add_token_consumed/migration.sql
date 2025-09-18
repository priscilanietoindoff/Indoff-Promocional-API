-- AlterTable
ALTER TABLE "public"."Token" ADD COLUMN     "consumed" BOOLEAN NOT NULL DEFAULT false;

-- Allow only one ACTIVE token per (userId, type)
CREATE UNIQUE INDEX IF NOT EXISTS "Token_one_active_per_user_type"
ON "Token" ("userId", "type")
WHERE "consumed" = false;
