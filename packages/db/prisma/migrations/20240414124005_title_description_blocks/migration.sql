/*
  Warnings:

  - The `title` column on the `Step` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `description` column on the `Step` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Step" DROP COLUMN "title",
ADD COLUMN     "title" JSONB,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB;
