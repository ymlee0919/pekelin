-- CreateTable
CREATE TABLE "review_link" (
    "link_id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "review_link_pkey" PRIMARY KEY ("link_id")
);

-- CreateTable
CREATE TABLE "review" (
    "review_id" SERIAL NOT NULL,
    "linkId" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "wellRead" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_linkId_key" ON "review"("linkId");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "review_link"("link_id") ON DELETE RESTRICT ON UPDATE CASCADE;
