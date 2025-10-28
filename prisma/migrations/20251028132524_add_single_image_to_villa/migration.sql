/*
  Warnings:

  - You are about to drop the `VillaImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `Villa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `VillaImage` DROP FOREIGN KEY `VillaImage_villa_id_fkey`;

-- AlterTable
ALTER TABLE `Villa` ADD COLUMN `imageUrl` VARCHAR(500) NOT NULL;

-- DropTable
DROP TABLE `VillaImage`;
