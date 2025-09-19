-- DropForeignKey
ALTER TABLE `BookingExpense` DROP FOREIGN KEY `BookingExpense_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `ExpenseVilla` DROP FOREIGN KEY `ExpenseVilla_expenseId_fkey`;

-- DropIndex
DROP INDEX `BookingExpense_bookingId_fkey` ON `BookingExpense`;

-- DropIndex
DROP INDEX `ExpenseVilla_expenseId_fkey` ON `ExpenseVilla`;

-- AddForeignKey
ALTER TABLE `ExpenseVilla` ADD CONSTRAINT `ExpenseVilla_expenseId_fkey` FOREIGN KEY (`expenseId`) REFERENCES `Expense`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingExpense` ADD CONSTRAINT `BookingExpense_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
