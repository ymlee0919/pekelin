-- AlterTable
ALTER TABLE "products" ADD COLUMN     "is_set" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "product1_id" INTEGER,
ADD COLUMN     "product2_id" INTEGER;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product1_id_fkey" FOREIGN KEY ("product1_id") REFERENCES "products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product2_id_fkey" FOREIGN KEY ("product2_id") REFERENCES "products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;
