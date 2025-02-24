-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "best_seller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_new" BOOLEAN NOT NULL DEFAULT false;
