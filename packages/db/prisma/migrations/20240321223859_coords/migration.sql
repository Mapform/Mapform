/*
  Warnings:

  - Added the required column `coords` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Step" ADD COLUMN     "coords" geometry(Point, 4326) NOT NULL;

-- CreateIndex
CREATE INDEX "location_idx" ON "Step" USING GIST ("coords");
