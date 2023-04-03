/*
  Warnings:

  - A unique constraint covering the columns `[startTime,finishTime,doctorUUID]` on the table `DoctorTimeslot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientUUID,startTime,finishTime]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requestId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doctorUUID` to the `DoctorTimeslot` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `DoctorTimeslot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'ACCEPTED', 'CHOSEN');

-- AlterEnum
ALTER TYPE "ProblemTypeEnum" ADD VALUE 'OTHER';

-- DropIndex
DROP INDEX "DoctorTimeslot_requestId_key";

-- AlterTable
ALTER TABLE "DoctorTimeslot" ADD COLUMN     "doctorUUID" TEXT NOT NULL,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "status" "RequestStatus" DEFAULT 'OPEN',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "requestId" INTEGER;

-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DoctorTimeslot_startTime_finishTime_doctorUUID_key" ON "DoctorTimeslot"("startTime", "finishTime", "doctorUUID");

-- CreateIndex
CREATE UNIQUE INDEX "Request_patientUUID_startTime_finishTime_key" ON "Request"("patientUUID", "startTime", "finishTime");

-- CreateIndex
CREATE UNIQUE INDEX "Review_requestId_key" ON "Review"("requestId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTimeslot" ADD CONSTRAINT "DoctorTimeslot_doctorUUID_fkey" FOREIGN KEY ("doctorUUID") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
