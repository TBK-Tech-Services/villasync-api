/*
  Warnings:

  - You are about to alter the column `subTotalAmount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to alter the column `totalPayableAmount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to alter the column `totalTax` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - Added the required column `basePrice` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfNights` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `advancePaid` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `alternatePhone` VARCHAR(20) NULL,
    ADD COLUMN `basePrice` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `customPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `dueAmount` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `extraPersonCharge` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `numberOfNights` INTEGER NOT NULL,
    MODIFY `guestEmail` VARCHAR(100) NULL,
    MODIFY `subTotalAmount` DECIMAL(10, 2) NOT NULL,
    MODIFY `totalPayableAmount` DECIMAL(10, 2) NOT NULL,
    MODIFY `totalTax` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `Villa` ADD COLUMN `ownerId` INTEGER NULL;

-- CreateTable
CREATE TABLE `GeneralSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `businessName` VARCHAR(255) NOT NULL,
    `contactEmail` VARCHAR(255) NOT NULL,
    `phoneNumber` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Villa` ADD CONSTRAINT `Villa_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
