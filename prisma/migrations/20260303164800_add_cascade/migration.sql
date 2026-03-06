-- DropForeignKey
ALTER TABLE `MaintenanceSchedule` DROP FOREIGN KEY `MaintenanceSchedule_productId_fkey`;

-- DropForeignKey
ALTER TABLE `MaintenanceTask` DROP FOREIGN KEY `MaintenanceTask_productId_fkey`;

-- DropIndex
DROP INDEX `MaintenanceSchedule_productId_fkey` ON `MaintenanceSchedule`;

-- DropIndex
DROP INDEX `MaintenanceTask_productId_fkey` ON `MaintenanceTask`;

-- AddForeignKey
ALTER TABLE `MaintenanceSchedule` ADD CONSTRAINT `MaintenanceSchedule_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceTask` ADD CONSTRAINT `MaintenanceTask_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
