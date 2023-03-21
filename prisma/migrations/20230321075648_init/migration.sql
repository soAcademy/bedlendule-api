/*
  Warnings:

  - The values [OTHER] on the enum `ProblemTypeEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProblemTypeEnum_new" AS ENUM ('MENTAL_HEALTH', 'DEPRESSION', 'PANIC_DISORDER', 'SCHIZOPHRENIA', 'POST_TRAUMATIC_STRESS_DISORDER', 'BIPOLAR', 'DEMENTIA', 'PHOBIAS');
ALTER TABLE "Request" ALTER COLUMN "problemType" TYPE "ProblemTypeEnum_new" USING ("problemType"::text::"ProblemTypeEnum_new");
ALTER TYPE "ProblemTypeEnum" RENAME TO "ProblemTypeEnum_old";
ALTER TYPE "ProblemTypeEnum_new" RENAME TO "ProblemTypeEnum";
DROP TYPE "ProblemTypeEnum_old";
COMMIT;
