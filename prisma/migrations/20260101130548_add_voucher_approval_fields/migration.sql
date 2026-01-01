-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `voucherApprovalStatus` ENUM('NOT_APPROVED', 'APPROVED') NOT NULL DEFAULT 'NOT_APPROVED',
    ADD COLUMN `voucherApprovedAt` DATETIME(3) NULL,
    ADD COLUMN `voucherApprovedBy` ENUM('PUJA', 'JAIRAJ') NULL,
    ADD COLUMN `voucherSentToAdminsAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `GeneralSetting` ADD COLUMN `admin1Email` VARCHAR(255) NULL,
    ADD COLUMN `admin1Name` VARCHAR(100) NULL,
    ADD COLUMN `admin1Phone` VARCHAR(20) NULL,
    ADD COLUMN `admin2Email` VARCHAR(255) NULL,
    ADD COLUMN `admin2Name` VARCHAR(100) NULL,
    ADD COLUMN `admin2Phone` VARCHAR(20) NULL;
