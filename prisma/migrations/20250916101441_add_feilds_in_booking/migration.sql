/*
  Warnings:

  - Added the required column `subTotalAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPayableAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTax` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `isGSTIncluded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `subTotalAmount` INTEGER NOT NULL,
    ADD COLUMN `totalPayableAmount` INTEGER NOT NULL,
    ADD COLUMN `totalTax` INTEGER NOT NULL;
