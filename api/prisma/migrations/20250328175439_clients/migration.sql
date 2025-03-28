-- CreateTable
CREATE TABLE "clients" (
    "client_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("client_id")
);
