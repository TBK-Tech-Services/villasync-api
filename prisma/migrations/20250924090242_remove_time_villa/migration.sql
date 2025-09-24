/*
  Warnings:

  - You are about to drop the column `arivalTime` on the `Villa` table. All the data in the column will be lost.
  - You are about to drop the column `departureTime` on the `Villa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Villa` DROP COLUMN `arivalTime`,
    DROP COLUMN `departureTime`;
