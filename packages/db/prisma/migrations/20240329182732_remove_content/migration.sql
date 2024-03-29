/*
  Warnings:

  - You are about to drop the `ContentStep` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContentStep" DROP CONSTRAINT "ContentStep_stepId_fkey";

-- DropTable
DROP TABLE "ContentStep";
