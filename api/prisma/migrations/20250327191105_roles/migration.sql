-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "roleId" INTEGER;

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "SystemModule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT NOT NULL,

    CONSTRAINT "SystemModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_permitions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_permitions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_permitions_B_index" ON "_permitions"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_permitions" ADD CONSTRAINT "_permitions_A_fkey" FOREIGN KEY ("A") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_permitions" ADD CONSTRAINT "_permitions_B_fkey" FOREIGN KEY ("B") REFERENCES "SystemModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
