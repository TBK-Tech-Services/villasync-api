/*
  Warnings:

  - You are about to alter the column `name` on the `Amenity` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Villa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - The primary key for the `VillaAmenity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amenityId` on the `VillaAmenity` table. All the data in the column will be lost.
  - You are about to drop the column `villaId` on the `VillaAmenity` table. All the data in the column will be lost.
  - You are about to drop the column `villaId` on the `VillaImage` table. All the data in the column will be lost.
  - You are about to drop the `UserPermission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,category_id]` on the table `Amenity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amenity_id` to the `VillaAmenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `villa_id` to the `VillaAmenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `villa_id` to the `VillaImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UserPermission` DROP FOREIGN KEY `UserPermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `UserPermission` DROP FOREIGN KEY `UserPermission_userId_fkey`;

-- DropForeignKey
ALTER TABLE `VillaAmenity` DROP FOREIGN KEY `VillaAmenity_amenityId_fkey`;

-- DropForeignKey
ALTER TABLE `VillaAmenity` DROP FOREIGN KEY `VillaAmenity_villaId_fkey`;

-- DropForeignKey
ALTER TABLE `VillaImage` DROP FOREIGN KEY `VillaImage_villaId_fkey`;

-- DropIndex
DROP INDEX `VillaAmenity_amenityId_fkey` ON `VillaAmenity`;

-- DropIndex
DROP INDEX `VillaImage_villaId_fkey` ON `VillaImage`;

-- AlterTable
ALTER TABLE `Amenity` ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `Villa` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `location` VARCHAR(500) NOT NULL,
    MODIFY `description` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `VillaAmenity` DROP PRIMARY KEY,
    DROP COLUMN `amenityId`,
    DROP COLUMN `villaId`,
    ADD COLUMN `amenity_id` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `villa_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`villa_id`, `amenity_id`);

-- AlterTable
ALTER TABLE `VillaImage` DROP COLUMN `villaId`,
    ADD COLUMN `villa_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `UserPermission`;

-- CreateTable
CREATE TABLE `AmenityCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `icon` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AmenityCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Amenity_name_category_id_key` ON `Amenity`(`name`, `category_id`);

-- AddForeignKey
ALTER TABLE `Amenity` ADD CONSTRAINT `Amenity_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `AmenityCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VillaAmenity` ADD CONSTRAINT `VillaAmenity_villa_id_fkey` FOREIGN KEY (`villa_id`) REFERENCES `Villa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VillaAmenity` ADD CONSTRAINT `VillaAmenity_amenity_id_fkey` FOREIGN KEY (`amenity_id`) REFERENCES `Amenity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VillaImage` ADD CONSTRAINT `VillaImage_villa_id_fkey` FOREIGN KEY (`villa_id`) REFERENCES `Villa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
