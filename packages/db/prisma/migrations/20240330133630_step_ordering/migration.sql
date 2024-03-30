/*
  Warnings:

  - A unique constraint covering the columns `[formOfDraftStepId,order]` on the table `Step` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formOfPublishedStepId,order]` on the table `Step` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Step" ADD COLUMN     "order" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Step_formOfDraftStepId_order_key" ON "Step"("formOfDraftStepId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Step_formOfPublishedStepId_order_key" ON "Step"("formOfPublishedStepId", "order");
