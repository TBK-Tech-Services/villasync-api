-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_villaId_fkey`;

-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_villaId_fkey`;

-- DropIndex
DROP INDEX `Booking_villaId_fkey` ON `Booking`;

-- DropIndex
DROP INDEX `Expense_villaId_fkey` ON `Expense`;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_villaId_fkey` FOREIGN KEY (`villaId`) REFERENCES `Villa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_villaId_fkey` FOREIGN KEY (`villaId`) REFERENCES `Villa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
