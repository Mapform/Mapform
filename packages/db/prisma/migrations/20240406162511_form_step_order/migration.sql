/*
  Warnings:

  - You are about to drop the column `required` on the `ContentStep` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Step` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Step_formOfDraftStepId_order_key";

-- DropIndex
DROP INDEX "Step_formOfPublishedStepId_order_key";

-- AlterTable
ALTER TABLE "ContentStep" DROP COLUMN "required";

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "stepOrder" TEXT[];

-- AlterTable
ALTER TABLE "Step" DROP COLUMN "order";
