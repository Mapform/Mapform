-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('CONTENT', 'SHORT_TEXT', 'LONG_TEXT');

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "zoom" INTEGER NOT NULL,
    "pitch" INTEGER NOT NULL,
    "bearing" INTEGER NOT NULL,
    "formId" TEXT NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
