/*
  Warnings:

  - You are about to drop the column `client_name` on the `review_link` table. All the data in the column will be lost.
  - You are about to drop the column `place` on the `review_link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "review_link" DROP COLUMN "client_name",
DROP COLUMN "place";
