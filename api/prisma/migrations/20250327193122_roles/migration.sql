/*
  Warnings:

  - You are about to drop the column `name` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the `SystemModule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_permitions" DROP CONSTRAINT "_permitions_B_fkey";

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "name",
ADD COLUMN     "role" TEXT NOT NULL;

-- DropTable
DROP TABLE "SystemModule";

-- CreateTable
CREATE TABLE "modules" (
    "id" SERIAL NOT NULL,
    "module" TEXT NOT NULL,
    "details" TEXT NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "_permitions" ADD CONSTRAINT "_permitions_B_fkey" FOREIGN KEY ("B") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
