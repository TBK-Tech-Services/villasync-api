/*
  Warnings:

  - You are about to drop the column `isGSTIncluded` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `isGSTIncluded`,
    ADD COLUMN `bookingSource` VARCHAR(50) NULL,
    ADD COLUMN `gstMode` VARCHAR(20) NOT NULL DEFAULT 'NONE',
    ADD COLUMN `gstOnBasePrice` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `gstOnExtraCharge` BOOLEAN NOT NULL DEFAULT false;
