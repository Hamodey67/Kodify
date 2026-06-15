DROP INDEX IF EXISTS `products_barcode_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `products_sku_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `products_barcode_unique` ON `products` (`barcode`) WHERE is_active = 1;--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`) WHERE is_active = 1;