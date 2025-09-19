-- CreateTable
CREATE TABLE `ExpenseVilla` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expenseId` INTEGER NOT NULL,
    `villaId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExpenseVilla` ADD CONSTRAINT `ExpenseVilla_expenseId_fkey` FOREIGN KEY (`expenseId`) REFERENCES `Expense`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseVilla` ADD CONSTRAINT `ExpenseVilla_villaId_fkey` FOREIGN KEY (`villaId`) REFERENCES `Villa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
