/*
  Warnings:

  - You are about to drop the column `coords` on the `Step` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "location_idx";

-- AlterTable
ALTER TABLE "Step" DROP COLUMN "coords";
