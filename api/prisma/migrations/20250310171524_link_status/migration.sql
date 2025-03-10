-- CreateEnum
CREATE TYPE "Status" AS ENUM ('READY', 'SENT', 'DONE');

-- AlterTable
ALTER TABLE "review_link" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'READY';
