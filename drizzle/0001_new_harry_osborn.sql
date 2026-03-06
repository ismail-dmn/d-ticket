CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firm_adi` varchar(255) NOT NULL,
	`is_abonelik` enum('true','false') NOT NULL DEFAULT 'false',
	`aylik_ucret` decimal(10,2) DEFAULT '0',
	`odeme_gunu` int NOT NULL DEFAULT 5,
	`kalan_borc` decimal(10,2) DEFAULT '0',
	`iletisim_kisi` varchar(255),
	`telefon` varchar(20),
	`email` varchar(320),
	`notlar` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`tutarı` decimal(10,2) NOT NULL,
	`odeme_tarihi` timestamp NOT NULL DEFAULT (now()),
	`odeme_yontemi` varchar(50),
	`notlar` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposal_no` varchar(50) NOT NULL,
	`customer_id` int NOT NULL,
	`baslik` varchar(255) NOT NULL,
	`aciklama` text,
	`tutar_kdv_haric` decimal(12,2) NOT NULL,
	`kdv_orani` decimal(5,2) DEFAULT '18',
	`tutar_kdv_dahil` decimal(12,2) NOT NULL,
	`gecerlilik_gunu` int NOT NULL DEFAULT 3,
	`durum` enum('Taslak','Gönderildi','Kabul Edildi','Reddedildi') NOT NULL DEFAULT 'Taslak',
	`pdf_url` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`gecerlilik_bitisi_tarihi` timestamp,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`),
	CONSTRAINT `proposals_proposal_no_unique` UNIQUE(`proposal_no`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticket_no` varchar(50) NOT NULL,
	`customer_id` int NOT NULL,
	`baslik` varchar(255) NOT NULL,
	`aciklama` text,
	`oncelik` enum('Düşük','Orta','Yüksek','KRİTİK') NOT NULL DEFAULT 'Orta',
	`durum` enum('Açık','Devam Ediyor','Tamamlandı') NOT NULL DEFAULT 'Açık',
	`teknik_notlar` text,
	`sifreler` text,
	`cozum_notlari` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`tamamlandigi_tarih` timestamp,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `tickets_ticket_no_unique` UNIQUE(`ticket_no`)
);
