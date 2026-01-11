-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'SEK',
ADD COLUMN     "priceCents" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_priceCents_idx" ON "Product"("priceCents");
