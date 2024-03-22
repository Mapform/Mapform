/*
  Warnings:

  - You are about to drop the column `name` on the `Step` table. All the data in the column will be lost.
  - Added the required column `type` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Step" DROP COLUMN "name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "StepType" NOT NULL;