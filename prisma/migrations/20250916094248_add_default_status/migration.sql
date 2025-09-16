/*
  Warnings:

  - You are about to alter the column `bookingStatus` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Booking` MODIFY `bookingStatus` ENUM('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    MODIFY `paymentStatus` ENUM('PAID', 'PENDING') NOT NULL DEFAULT 'PENDING';
