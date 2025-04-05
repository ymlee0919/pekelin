-- AlterTable
ALTER TABLE "review_link" ADD COLUMN     "client_id" INTEGER;

-- AddForeignKey
ALTER TABLE "review_link" ADD CONSTRAINT "review_link_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("client_id") ON DELETE SET NULL ON UPDATE CASCADE;
