/*
  Warnings:

  - The primary key for the `modules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `modules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_permitions" DROP CONSTRAINT "_permitions_B_fkey";

-- AlterTable
ALTER TABLE "modules" DROP CONSTRAINT "modules_pkey",
DROP COLUMN "id",
ADD COLUMN     "module_id" SERIAL NOT NULL,
ADD CONSTRAINT "modules_pkey" PRIMARY KEY ("module_id");

-- AddForeignKey
ALTER TABLE "_permitions" ADD CONSTRAINT "_permitions_B_fkey" FOREIGN KEY ("B") REFERENCES "modules"("module_id") ON DELETE CASCADE ON UPDATE CASCADE;
