/*
  Warnings:

  - You are about to drop the column `draftedFormId` on the `Step` table. All the data in the column will be lost.
  - You are about to drop the column `publishedFormId` on the `Step` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Step" DROP CONSTRAINT "Step_draftedFormId_fkey";

-- DropForeignKey
ALTER TABLE "Step" DROP CONSTRAINT "Step_publishedFormId_fkey";

-- AlterTable
ALTER TABLE "Step" DROP COLUMN "draftedFormId",
DROP COLUMN "publishedFormId",
ADD COLUMN     "formOfDraftStepId" TEXT,
ADD COLUMN     "formOfPublishedStepId" TEXT;

-- CreateTable
CREATE TABLE "ContentStep" (
    "id" TEXT NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "stepId" TEXT NOT NULL,

    CONSTRAINT "ContentStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentStep_stepId_key" ON "ContentStep"("stepId");

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_formOfDraftStepId_fkey" FOREIGN KEY ("formOfDraftStepId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_formOfPublishedStepId_fkey" FOREIGN KEY ("formOfPublishedStepId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentStep" ADD CONSTRAINT "ContentStep_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
