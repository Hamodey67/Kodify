CREATE TABLE `price_overrides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer NOT NULL,
	`item_name` text NOT NULL,
	`original_price` real NOT NULL,
	`new_price` real NOT NULL,
	`reason` text,
	`authorized_by` text NOT NULL,
	`timestamp` text NOT NULL
);
