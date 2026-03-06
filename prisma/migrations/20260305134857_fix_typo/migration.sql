/*
  Warnings:

  - You are about to drop the column `standartUsageHourse` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `standartUsageHourse`,
    ADD COLUMN `standartUsageHours` DOUBLE NOT NULL DEFAULT 1100;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('ADMIN', 'ENGINEER', 'MANAGER') NOT NULL DEFAULT 'MANAGER';
