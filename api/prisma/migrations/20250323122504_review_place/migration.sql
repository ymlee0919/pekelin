/*
  Warnings:

  - Added the required column `place` to the `review_link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "review_link" ADD COLUMN     "place" TEXT NOT NULL;
