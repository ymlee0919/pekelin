/*
  Warnings:

  - You are about to drop the column `expiry` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `remoteUrl` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_variant_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "expiry",
DROP COLUMN "image",
DROP COLUMN "remoteUrl",
DROP COLUMN "variant_id",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "product_image" TEXT;
