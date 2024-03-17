/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `OrganizationMembership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `OrganizationMembership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrganizationMembership" DROP CONSTRAINT "OrganizationMembership_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMembership" DROP CONSTRAINT "OrganizationMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceMembership" DROP CONSTRAINT "WorkspaceMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceMembership" DROP CONSTRAINT "WorkspaceMembership_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationMembership" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_clerkId_key" ON "Organization"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_clerkId_key" ON "OrganizationMembership"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMembership" ADD CONSTRAINT "WorkspaceMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMembership" ADD CONSTRAINT "WorkspaceMembership_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
