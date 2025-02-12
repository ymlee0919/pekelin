/*
  Warnings:

  - You are about to drop the `ProductTypes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductTypes" DROP CONSTRAINT "ProductTypes_product_id_fkey";

-- DropTable
DROP TABLE "ProductTypes";

-- CreateTable
CREATE TABLE "product_type" (
    "type_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "remote_url" TEXT NOT NULL,
    "expiry" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "product_type_pkey" PRIMARY KEY ("type_id")
);

-- AddForeignKey
ALTER TABLE "product_type" ADD CONSTRAINT "product_type_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
