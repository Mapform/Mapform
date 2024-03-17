/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,slug]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Form_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Form_workspaceId_slug_key" ON "Form"("workspaceId", "slug");
