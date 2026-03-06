CREATE TABLE `maintenance_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`scheduled_date` timestamp NOT NULL,
	`reminder_date` timestamp,
	`status` enum('Planlandı','Hatırlatıldı','Tamamlandı','İptal Edildi') DEFAULT 'Planlandı',
	`notification_sent` int DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maintenance_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monthly_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`year` int NOT NULL,
	`month` int NOT NULL,
	`total_tickets` int DEFAULT 0,
	`completed_tickets` int DEFAULT 0,
	`total_revenue` decimal(12,2) DEFAULT '0',
	`service_revenue` decimal(12,2) DEFAULT '0',
	`software_revenue` decimal(12,2) DEFAULT '0',
	`total_expenses` decimal(12,2) DEFAULT '0',
	`net_profit` decimal(12,2) DEFAULT '0',
	`report_url` varchar(500),
	`generated_at` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `monthly_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `work_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticket_id` int NOT NULL,
	`customer_id` int NOT NULL,
	`work_order_no` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`estimated_hours` decimal(5,2),
	`actual_hours` decimal(5,2),
	`hourly_rate` decimal(10,2),
	`total_cost` decimal(10,2),
	`status` enum('Planlandı','Devam Ediyor','Tamamlandı','İptal Edildi') DEFAULT 'Planlandı',
	`notes` text,
	`completed_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `work_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `work_orders_work_order_no_unique` UNIQUE(`work_order_no`)
);
--> statement-breakpoint
CREATE TABLE `yearly_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`year` int NOT NULL,
	`total_tickets` int DEFAULT 0,
	`completed_tickets` int DEFAULT 0,
	`total_revenue` decimal(12,2) DEFAULT '0',
	`service_revenue` decimal(12,2) DEFAULT '0',
	`software_revenue` decimal(12,2) DEFAULT '0',
	`total_expenses` decimal(12,2) DEFAULT '0',
	`net_profit` decimal(12,2) DEFAULT '0',
	`report_url` varchar(500),
	`generated_at` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `yearly_reports_id` PRIMARY KEY(`id`)
);
