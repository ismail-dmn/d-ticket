CREATE TABLE `company_firewall_ips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`ip_address` varchar(45) NOT NULL,
	`description` varchar(255),
	`purpose` varchar(100),
	`is_active` int DEFAULT 1,
	`notlar` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `company_firewall_ips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_licenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`license_type` varchar(100) NOT NULL,
	`license_key` text NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`version` varchar(50),
	`expiry_date` timestamp,
	`assigned_to` varchar(255),
	`notlar` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `company_licenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_mail_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`email_address` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`mail_server` varchar(255),
	`imap_port` int,
	`smtp_port` int,
	`assigned_to` varchar(255),
	`notlar` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `company_mail_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_user_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`system_name` varchar(255),
	`email` varchar(255),
	`role` varchar(100),
	`is_active` int DEFAULT 1,
	`last_login` timestamp,
	`notlar` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `company_user_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_vault_access_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`user_id` int NOT NULL,
	`vault_item_type` varchar(100),
	`vault_item_id` int,
	`action` varchar(50),
	`ip_address` varchar(45),
	`user_agent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `company_vault_access_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_vault_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` varchar(100),
	`priority` enum('Düşük','Orta','Yüksek','KRİTİK') DEFAULT 'Orta',
	`is_confidential` int DEFAULT 1,
	`created_by` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `company_vault_notes_id` PRIMARY KEY(`id`)
);
