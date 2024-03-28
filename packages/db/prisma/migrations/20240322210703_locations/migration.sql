/*
  Warnings:

  - A unique constraint covering the columns `[locationId]` on the table `Step` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Step" ADD COLUMN     "locationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "geom" geometry(Point, 4326) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "location_idx" ON "Location" USING GIST ("geom");

-- CreateIndex
CREATE UNIQUE INDEX "Step_locationId_key" ON "Step"("locationId");

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
