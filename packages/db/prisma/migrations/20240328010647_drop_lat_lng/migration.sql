/*
  Warnings:

  - You are about to drop the column `latitude` on the `Step` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Step` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Step" DROP COLUMN "latitude",
DROP COLUMN "longitude";
