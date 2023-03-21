/*
  Warnings:

  - The values [USER] on the enum `UserTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `finishTIme` on the `DoctorTimeslot` table. All the data in the column will be lost.
  - You are about to drop the column `patienceId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `info` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licenseId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `finishTime` to the `DoctorTimeslot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientUUID` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemType` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProblemTypeEnum" AS ENUM ('MENTAL_HEALTH', 'DEPRESSION', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "UserTypeEnum_new" AS ENUM ('PATIENT', 'DOCTOR');
ALTER TABLE "User" ALTER COLUMN "type" TYPE "UserTypeEnum_new" USING ("type"::text::"UserTypeEnum_new");
ALTER TYPE "UserTypeEnum" RENAME TO "UserTypeEnum_old";
ALTER TYPE "UserTypeEnum_new" RENAME TO "UserTypeEnum";
DROP TYPE "UserTypeEnum_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_patienceId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_doctorId_fkey";

-- AlterTable
ALTER TABLE "DoctorTimeslot" DROP COLUMN "finishTIme",
ADD COLUMN     "finishTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "patienceId",
ADD COLUMN     "patientUUID" TEXT NOT NULL,
ADD COLUMN     "problemType" "ProblemTypeEnum" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "doctorId",
DROP COLUMN "info",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "meetingType" "MeetingTypeEnum" NOT NULL DEFAULT 'ONLINE',
ADD COLUMN     "title" TEXT DEFAULT 'title',
ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "score",
ADD COLUMN     "licenseId" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profilePictureUrl" TEXT,
ADD COLUMN     "uuid" TEXT NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_licenseId_key" ON "User"("licenseId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_patientUUID_fkey" FOREIGN KEY ("patientUUID") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
