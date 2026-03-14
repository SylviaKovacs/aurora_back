-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: aurora_salon
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `serviceKey` varchar(255) NOT NULL,
  `serviceLabel` varchar(255) NOT NULL,
  `durationMinutes` int(11) NOT NULL,
  `time` varchar(255) NOT NULL,
  `staffName` varchar(255) DEFAULT 'Nincs megadva',
  `price` float DEFAULT NULL,
  `staffId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `depositAmount` float DEFAULT NULL,
  `paidAmount` float DEFAULT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `couponCode` varchar(255) DEFAULT NULL,
  `discountAmount` float DEFAULT NULL,
  `finalPrice` float DEFAULT NULL,
  `paymentStatus` varchar(255) DEFAULT 'unpaid',
  `barionPaymentId` varchar(255) DEFAULT NULL,
  `barionPaymentRequestId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (19,'2026-01-27','confirmed','2026-01-22 18:33:28','2026-01-22 18:33:28','Teszt Vendég','teszt.vendeg@example.com','06301234567','masszazs_60','Masszázs – 60 perc',60,'14:00','Teszt szakember',10000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'unpaid',NULL,NULL),(21,'2026-01-26','completed','2026-01-23 02:29:48','2026-01-27 11:29:42','Szilvia Kovács','kovacsszilvia077@gmail.com','06703256918','hidratáló_kezeles','Hidratáló kezelés',60,'14:00','Dóri',14000,6,7,NULL,NULL,'online_full',NULL,NULL,14000,'pending','77d5a66203f8f0118c24001dd8b71cc4','APPT-21-1769135388198'),(23,'2026-01-26','confirmed','2026-01-23 02:43:55','2026-01-27 11:26:52','Szilvia Kovács','kovacsszilvia077@gmail.com','06703256918','hidratáló_kezeles','Hidratáló kezelés',60,'10:00','Dóri',14000,6,7,NULL,NULL,'onsite',NULL,NULL,14000,'pending',NULL,NULL),(24,'2026-01-26','cancelled','2026-01-23 02:49:49','2026-01-27 11:29:37','Szilvia Kovács','kovacsszilvia077@gmail.com','06703256918','ferfi_vagas','Férfi hajvágás',30,'13:30','Petra',5500,5,7,NULL,NULL,'onsite',NULL,NULL,5500,'pending',NULL,NULL),(25,'2026-01-27','pending','2026-01-23 03:00:09','2026-01-23 03:00:09','Szilvia Kovács','kovacsszilvia077@gmail.com','06703256918','mukorom_epites','Műköröm építés',120,'11:45','Kinga',14000,7,7,NULL,NULL,'onsite',NULL,NULL,14000,'pending',NULL,NULL),(26,'2026-01-29','pending','2026-01-23 20:31:59','2026-01-23 20:32:00','gdgf dgdfgdf','fgdgf@gfdfgfgd.hu','06703265498','ferfi_vagas','Férfi hajvágás',30,'10:00','Luca',5500,4,NULL,NULL,NULL,'online_full',NULL,NULL,5500,'pending','b9c89a919af8f0118c24001dd8b71cc4','APPT-26-1769200319390'),(27,'2026-01-29','pending','2026-01-26 08:44:09','2026-01-26 08:44:09','Szilvia Kovács','kovacsszilvia077@gmail.com','06703256918','ferfi_vagas','Férfi hajvágás',30,'13:30','Luca',5500,4,7,NULL,NULL,'online_full',NULL,NULL,5500,'pending','4a5ac22d93faf0118c24001dd8b71cc4','APPT-27-1769417049115'),(28,'2026-01-28','pending','2026-01-27 15:07:15','2026-01-27 15:07:15','Szilvia Kovács','kovacsszilvia077@gmail.com','06703256918','balayage','Balayage',180,'09:00','Luca',35000,4,7,NULL,NULL,'onsite',NULL,NULL,35000,'pending',NULL,NULL),(29,'2026-01-30','pending','2026-01-27 15:07:36','2026-01-27 15:07:36','Szilvia Kovács','kovacsszilvia077@gmail.com','06703256918','sportmasszazs','Sportmasszázs',60,'11:00','Ádám',12000,10,7,NULL,NULL,'onsite',NULL,NULL,12000,'pending',NULL,NULL),(30,'2026-01-31','pending','2026-01-27 18:58:57','2026-01-27 18:58:57','Szilvia Kovács','kovacsszilvia077@gmail.com','06703256918','balayage','Balayage',180,'10:00','Petra',35000,5,7,NULL,NULL,'onsite',NULL,NULL,35000,'pending',NULL,NULL);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditlogs`
--

DROP TABLE IF EXISTS `auditlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auditlogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `actorUserId` int(11) DEFAULT NULL,
  `actorRole` varchar(255) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `entityType` varchar(255) NOT NULL,
  `entityId` int(11) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditlogs`
--

LOCK TABLES `auditlogs` WRITE;
/*!40000 ALTER TABLE `auditlogs` DISABLE KEYS */;
INSERT INTO `auditlogs` VALUES (1,1,'admin','appointment_status_update','Appointment',15,'{\"status\":\"pending\"}','2026-01-22 19:44:12','2026-01-22 19:44:12'),(2,1,'admin','appointment_status_update','Appointment',15,'{\"status\":\"confirmed\"}','2026-01-22 19:44:13','2026-01-22 19:44:13'),(3,1,'admin','appointment_status_update','Appointment',15,'{\"status\":\"completed\"}','2026-01-22 19:44:14','2026-01-22 19:44:14'),(4,1,'admin','appointment_status_update','Appointment',15,'{\"status\":\"completed\"}','2026-01-22 19:44:16','2026-01-22 19:44:16'),(5,1,'admin','appointment_status_update','Appointment',15,'{\"status\":\"completed\"}','2026-01-22 19:44:17','2026-01-22 19:44:17'),(6,1,'admin','appointment_status_update','Appointment',15,'{\"status\":\"cancelled\"}','2026-01-22 19:44:20','2026-01-22 19:44:20'),(7,1,'admin','appointment_status_update','Appointment',16,'{\"status\":\"pending\"}','2026-01-22 19:44:26','2026-01-22 19:44:26'),(8,1,'admin','appointment_status_update','Appointment',16,'{\"status\":\"pending\"}','2026-01-22 19:44:26','2026-01-22 19:44:26'),(9,1,'admin','appointment_status_update','Appointment',16,'{\"status\":\"pending\"}','2026-01-22 19:44:27','2026-01-22 19:44:27'),(10,1,'admin','appointment_status_update','Appointment',16,'{\"status\":\"pending\"}','2026-01-22 19:44:27','2026-01-22 19:44:27'),(11,1,'admin','appointment_status_update','Appointment',16,'{\"status\":\"pending\"}','2026-01-22 19:44:27','2026-01-22 19:44:27'),(12,1,'admin','appointment_status_update','Appointment',16,'{\"status\":\"cancelled\"}','2026-01-22 19:44:29','2026-01-22 19:44:29'),(13,1,'admin','appointment_status_update','Appointment',15,'{\"status\":\"pending\"}','2026-01-22 19:47:45','2026-01-22 19:47:45'),(14,1,'admin','appointment_status_update','Appointment',15,'{\"status\":\"confirmed\"}','2026-01-22 19:47:46','2026-01-22 19:47:46'),(15,1,'admin','appointment_delete','Appointment',15,'{\"date\":\"2026-01-23\",\"time\":\"10:00\",\"staffId\":null}','2026-01-22 20:19:36','2026-01-22 20:19:36'),(16,1,'admin','appointment_delete','Appointment',18,'{\"date\":\"2026-01-26\",\"time\":\"13:00\",\"staffId\":null}','2026-01-22 20:21:20','2026-01-22 20:21:20'),(17,NULL,NULL,'appointment_create','Appointment',20,'{\"date\":\"2026-01-23\",\"time\":\"11:00\",\"staffId\":4,\"serviceKey\":\"noi_vagas\"}','2026-01-22 20:26:11','2026-01-22 20:26:11'),(18,NULL,NULL,'appointment_create','Appointment',21,'{\"date\":\"2026-01-26\",\"time\":\"11:30\",\"staffId\":6,\"serviceKey\":\"hidratáló_kezeles\"}','2026-01-23 02:29:48','2026-01-23 02:29:48'),(19,NULL,NULL,'appointment_create','Appointment',22,'{\"date\":\"2026-01-26\",\"time\":\"13:15\",\"staffId\":5,\"serviceKey\":\"ferfi_vagas\"}','2026-01-23 02:33:07','2026-01-23 02:33:07'),(20,7,'user','appointment_update_user','Appointment',22,'{\"date\":\"2026-01-27\",\"time\":\"11:00\"}','2026-01-23 02:34:09','2026-01-23 02:34:09'),(21,NULL,NULL,'appointment_create','Appointment',23,'{\"date\":\"2026-01-26\",\"time\":\"10:00\",\"staffId\":6,\"serviceKey\":\"hidratáló_kezeles\"}','2026-01-23 02:43:55','2026-01-23 02:43:55'),(22,NULL,NULL,'appointment_create','Appointment',24,'{\"date\":\"2026-01-26\",\"time\":\"13:30\",\"staffId\":5,\"serviceKey\":\"ferfi_vagas\"}','2026-01-23 02:49:49','2026-01-23 02:49:49'),(23,NULL,NULL,'appointment_create','Appointment',25,'{\"date\":\"2026-01-27\",\"time\":\"11:45\",\"staffId\":7,\"serviceKey\":\"mukorom_epites\"}','2026-01-23 03:00:09','2026-01-23 03:00:09'),(24,7,'user','appointment_update_user','Appointment',22,'{\"date\":\"2026-01-15\",\"time\":\"11:00\"}','2026-01-23 09:46:40','2026-01-23 09:46:40'),(25,1,'admin','appointment_status_update','Appointment',16,'{\"status\":\"pending\"}','2026-01-23 10:48:04','2026-01-23 10:48:04'),(26,1,'admin','appointment_status_update','Appointment',20,'{\"status\":\"confirmed\"}','2026-01-23 10:48:07','2026-01-23 10:48:07'),(27,1,'admin','appointment_status_update','Appointment',20,'{\"status\":\"confirmed\"}','2026-01-23 10:48:07','2026-01-23 10:48:07'),(28,1,'admin','appointment_status_update','Appointment',22,'{\"status\":\"confirmed\"}','2026-01-23 11:00:56','2026-01-23 11:00:56'),(29,1,'admin','appointment_status_update','Appointment',22,'{\"status\":\"completed\"}','2026-01-23 11:30:13','2026-01-23 11:30:13'),(30,1,'admin','appointment_delete','Appointment',22,'{\"date\":\"2026-01-15\",\"time\":\"11:00\",\"staffId\":5}','2026-01-23 11:32:19','2026-01-23 11:32:19'),(31,1,'admin','appointment_delete','Appointment',20,'{\"date\":\"2026-01-23\",\"time\":\"11:00\",\"staffId\":4}','2026-01-23 11:34:08','2026-01-23 11:34:08'),(32,1,'admin','appointment_status_update','Appointment',16,'{\"status\":\"completed\"}','2026-01-23 11:34:13','2026-01-23 11:34:13'),(33,NULL,NULL,'appointment_create','Appointment',26,'{\"date\":\"2026-01-29\",\"time\":\"10:00\",\"staffId\":4,\"serviceKey\":\"ferfi_vagas\"}','2026-01-23 20:31:59','2026-01-23 20:31:59'),(34,1,'admin','appointment_delete','Appointment',16,'{\"date\":\"2026-01-24\",\"time\":\"11:00\",\"staffId\":null}','2026-01-23 20:45:21','2026-01-23 20:45:21'),(35,1,'admin','appointment_delete','Appointment',17,'{\"date\":\"2026-01-25\",\"time\":\"12:00\",\"staffId\":null}','2026-01-23 20:45:27','2026-01-23 20:45:27'),(36,7,'user','appointment_update_user','Appointment',21,'{\"date\":\"2026-01-26\",\"time\":\"14:00\"}','2026-01-24 11:17:37','2026-01-24 11:17:37'),(37,NULL,NULL,'appointment_create','Appointment',27,'{\"date\":\"2026-01-29\",\"time\":\"13:30\",\"staffId\":4,\"serviceKey\":\"ferfi_vagas\"}','2026-01-26 08:44:09','2026-01-26 08:44:09'),(38,1,'admin','appointment_status_update','Appointment',23,'{\"status\":\"confirmed\"}','2026-01-27 11:26:52','2026-01-27 11:26:52'),(39,1,'admin','appointment_status_update','Appointment',24,'{\"status\":\"cancelled\"}','2026-01-27 11:29:37','2026-01-27 11:29:37'),(40,1,'admin','appointment_status_update','Appointment',21,'{\"status\":\"completed\"}','2026-01-27 11:29:42','2026-01-27 11:29:42'),(41,NULL,NULL,'appointment_create','Appointment',28,'{\"date\":\"2026-01-28\",\"time\":\"09:00\",\"staffId\":4,\"serviceKey\":\"balayage\"}','2026-01-27 15:07:15','2026-01-27 15:07:15'),(42,NULL,NULL,'appointment_create','Appointment',29,'{\"date\":\"2026-01-30\",\"time\":\"11:00\",\"staffId\":10,\"serviceKey\":\"sportmasszazs\"}','2026-01-27 15:07:36','2026-01-27 15:07:36'),(43,NULL,NULL,'appointment_create','Appointment',30,'{\"date\":\"2026-01-31\",\"time\":\"10:00\",\"staffId\":5,\"serviceKey\":\"balayage\"}','2026-01-27 18:58:57','2026-01-27 18:58:57');
/*!40000 ALTER TABLE `auditlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blockedslots`
--

DROP TABLE IF EXISTS `blockedslots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blockedslots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `staffId` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(255) NOT NULL,
  `durationMinutes` int(11) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blockedslots`
--

LOCK TABLES `blockedslots` WRITE;
/*!40000 ALTER TABLE `blockedslots` DISABLE KEYS */;
/*!40000 ALTER TABLE `blockedslots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactmessages`
--

DROP TABLE IF EXISTS `contactmessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contactmessages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read') DEFAULT 'new',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactmessages`
--

LOCK TABLES `contactmessages` WRITE;
/*!40000 ALTER TABLE `contactmessages` DISABLE KEYS */;
INSERT INTO `contactmessages` VALUES (3,'gfdgfdg','fsdfds@gdfgfd.hu','gfjdigfdogjfdkl','read','2026-01-22 20:12:31','2026-01-22 20:12:57'),(4,'gfdgdf','gfdgfd@gfdgfd.hu','fdhdhgfhgfh','read','2026-01-27 16:00:54','2026-01-27 16:29:23');
/*!40000 ALTER TABLE `contactmessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'percent',
  `amount` float NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usageCount` int(11) NOT NULL DEFAULT 0,
  `minSpend` float DEFAULT NULL,
  `maxDiscount` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'AURORA10','percent',10,1,'2026-01-23','2026-01-30',5000,0,10000,NULL,'2026-01-23 10:50:40','2026-01-23 10:50:40');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newslettercampaigns`
--

DROP TABLE IF EXISTS `newslettercampaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newslettercampaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `recipients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`recipients`)),
  `recipientsCount` int(11) NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'saved',
  `sentAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newslettercampaigns`
--

LOCK TABLES `newslettercampaigns` WRITE;
/*!40000 ALTER TABLE `newslettercampaigns` DISABLE KEYS */;
INSERT INTO `newslettercampaigns` VALUES (1,'drgdthg','gfhfhfghfg','[\"gfdgdgf@fgsfjglslfsdlfhjasdhfjk.hu\",\"newsletter1769015856484@example.com\",\"valami@valami.hu\",\"bm@mb.hu\",\"mmm@mmm.hu\",\"bbbbb@bb.hu\",\"kovacsszilvia077@gmail.com\"]',7,'sent','2026-01-27 16:35:39','2026-01-27 16:35:39','2026-01-27 16:35:39'),(2,'drgdthg','gfhfhfghfg','[\"gfdgdgf@fgsfjglslfsdlfhjasdhfjk.hu\",\"newsletter1769015856484@example.com\",\"valami@valami.hu\",\"bm@mb.hu\",\"mmm@mmm.hu\",\"bbbbb@bb.hu\",\"kovacsszilvia077@gmail.com\"]',7,'sent','2026-01-27 16:35:42','2026-01-27 16:35:42','2026-01-27 16:35:42'),(3,'drgdthg','gfhfhfghfg','[\"gfdgdgf@fgsfjglslfsdlfhjasdhfjk.hu\",\"newsletter1769015856484@example.com\",\"valami@valami.hu\",\"bm@mb.hu\",\"mmm@mmm.hu\",\"bbbbb@bb.hu\",\"kovacsszilvia077@gmail.com\"]',7,'sent','2026-01-27 16:35:42','2026-01-27 16:35:42','2026-01-27 16:35:42'),(4,'valami','valami','[\"gfdgdgf@fgsfjglslfsdlfhjasdhfjk.hu\",\"newsletter1769015856484@example.com\",\"valami@valami.hu\",\"bm@mb.hu\",\"mmm@mmm.hu\",\"bbbbb@bb.hu\",\"kovacsszilvia077@gmail.com\"]',7,'sent','2026-01-27 18:54:51','2026-01-27 18:54:51','2026-01-27 18:54:51');
/*!40000 ALTER TABLE `newslettercampaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newslettersubscribes`
--

DROP TABLE IF EXISTS `newslettersubscribes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newslettersubscribes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `subscribedAt` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `newslettersubscribes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_100` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_101` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_102` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_103` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_104` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_105` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_106` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_107` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_108` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_109` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_110` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_111` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_112` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_113` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_114` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_115` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_116` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_117` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_118` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_119` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_120` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_121` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_122` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_123` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_124` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_125` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_24` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_25` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_26` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_27` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_28` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_29` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_30` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_31` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_32` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_33` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_34` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_35` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_36` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_37` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_38` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_39` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_40` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_41` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_42` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_43` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_44` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_45` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_46` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_47` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_48` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_49` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_50` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_51` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_52` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_53` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_54` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_55` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_56` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_57` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_58` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_59` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_60` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_61` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_62` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_63` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_64` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_65` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_66` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_67` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_68` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_69` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_70` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_71` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_72` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_73` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_74` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_75` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_76` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_77` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_78` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_79` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_80` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_81` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_82` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_83` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_84` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_85` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_86` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_87` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_88` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_89` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_90` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_91` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_92` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_93` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_94` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_95` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_96` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_97` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_98` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `newslettersubscribes_ibfk_99` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newslettersubscribes`
--

LOCK TABLES `newslettersubscribes` WRITE;
/*!40000 ALTER TABLE `newslettersubscribes` DISABLE KEYS */;
INSERT INTO `newslettersubscribes` VALUES (2,'bbbbb@bb.hu','2025-12-08 18:37:54',NULL),(3,'mmm@mmm.hu','2025-12-09 08:25:26',NULL),(4,'bm@mb.hu','2025-12-09 08:27:39',NULL),(5,'valami@valami.hu','2025-12-09 16:39:50',NULL),(6,'newsletter1769015856484@example.com','2026-01-21 17:17:36',NULL),(7,'gfdgdgf@fgsfjglslfsdlfhjasdhfjk.hu','2026-01-22 20:15:14',NULL);
/*!40000 ALTER TABLE `newslettersubscribes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appointmentId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `staffId` int(11) DEFAULT NULL,
  `serviceKey` varchar(255) DEFAULT NULL,
  `customerName` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointmentId` (`appointmentId`),
  UNIQUE KEY `appointmentId_2` (`appointmentId`),
  UNIQUE KEY `appointmentId_3` (`appointmentId`),
  UNIQUE KEY `appointmentId_4` (`appointmentId`),
  UNIQUE KEY `appointmentId_5` (`appointmentId`),
  UNIQUE KEY `appointmentId_6` (`appointmentId`),
  UNIQUE KEY `appointmentId_7` (`appointmentId`),
  UNIQUE KEY `appointmentId_8` (`appointmentId`),
  UNIQUE KEY `appointmentId_9` (`appointmentId`),
  UNIQUE KEY `appointmentId_10` (`appointmentId`),
  UNIQUE KEY `appointmentId_11` (`appointmentId`),
  UNIQUE KEY `appointmentId_12` (`appointmentId`),
  UNIQUE KEY `appointmentId_13` (`appointmentId`),
  UNIQUE KEY `appointmentId_14` (`appointmentId`),
  UNIQUE KEY `appointmentId_15` (`appointmentId`),
  UNIQUE KEY `appointmentId_16` (`appointmentId`),
  UNIQUE KEY `appointmentId_17` (`appointmentId`),
  UNIQUE KEY `appointmentId_18` (`appointmentId`),
  UNIQUE KEY `appointmentId_19` (`appointmentId`),
  UNIQUE KEY `appointmentId_20` (`appointmentId`),
  UNIQUE KEY `appointmentId_21` (`appointmentId`),
  UNIQUE KEY `appointmentId_22` (`appointmentId`),
  UNIQUE KEY `appointmentId_23` (`appointmentId`),
  UNIQUE KEY `appointmentId_24` (`appointmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,20,7,4,'noi_vagas','Szilvia Kovács',5,'Szupeeeeeeeeeer','approved','2026-01-23 01:56:51','2026-01-23 02:00:33');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Női hajvágás',NULL,6500.00,0,'2025-12-06 17:01:06','2025-12-06 17:01:06'),(2,'Férfi hajvágás',NULL,4500.00,0,'2025-12-06 17:01:06','2025-12-06 17:01:06'),(3,'Hajfestés',NULL,15000.00,0,'2025-12-06 17:01:06','2025-12-06 17:01:06'),(4,'Melír',NULL,13000.00,0,'2025-12-06 17:01:06','2025-12-06 17:01:06'),(5,'Manikűr',NULL,8000.00,0,'2025-12-06 17:01:06','2025-12-06 17:01:06'),(6,'Gépi pedikűr',NULL,9000.00,0,'2025-12-06 17:01:06','2025-12-06 17:01:06');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staffs`
--

DROP TABLE IF EXISTS `staffs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staffs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `services` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`services`)),
  `image` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `Staffs_userId_foreign_idx` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_24` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_25` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_26` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_27` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_28` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_29` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_30` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_31` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_32` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_33` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_34` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_35` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_36` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_37` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_38` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_39` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_40` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_41` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_42` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_43` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_44` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_45` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_46` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_47` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_48` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_49` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_50` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_51` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_52` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_53` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_54` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_55` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_56` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_57` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_58` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_59` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_60` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_61` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_62` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_63` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_64` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_65` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_66` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_67` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_68` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_69` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_70` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_71` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_72` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_73` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_74` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_75` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_76` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_77` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_78` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_79` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_80` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staffs_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staffs`
--

LOCK TABLES `staffs` WRITE;
/*!40000 ALTER TABLE `staffs` DISABLE KEYS */;
INSERT INTO `staffs` VALUES (4,'Luca','fodrász','[\"noi_vagas\",\"ferfi_vagas\",\"gyerek_vagas\",\"mosas_szaritas\",\"hajfestes\",\"melir\",\"balayage\",\"keratinos\"]','assets/luca.png',1,'2025-12-11 15:37:22','2026-01-23 02:00:45',12),(5,'Petra','fodrász','[\"noi_vagas\",\"ferfi_vagas\",\"mosas_szaritas\",\"hajfestes\",\"balayage\"]','assets/petra.png',1,'2025-12-11 15:37:31','2026-01-23 02:00:45',13),(6,'Dóri','kozmetikus','[\"arctisztitas\",\"hidratáló_kezeles\",\"anti_aging\",\"mezoterapia\",\"dermapen\"]','assets/dori.png',1,'2025-12-11 15:37:37','2026-01-23 02:00:45',14),(7,'Kinga','műkörmös','[\"gel_lakk\",\"mukorom_epites\",\"mukorom_toltes\",\"eltavolitas\"]','assets/kinga.png',1,'2025-12-11 15:37:45','2026-01-23 02:00:45',15),(8,'Lili','szempilla stylist','[\"1d\",\"2d\",\"3d\",\"tobbsoros\",\"tolt_1d\",\"tolt_2d\",\"tolt_3d\"]','assets/lili.png',1,'2025-12-11 15:37:51','2026-01-23 02:00:45',16),(9,'Júlia','sminktetováló','[\"microblading\",\"powder_brows\",\"szemhej\",\"ajak\"]','assets/julia.png',1,'2025-12-11 15:37:58','2026-01-23 02:00:45',17),(10,'Ádám','masszőr','[\"masszazs_30\",\"masszazs_60\",\"masszazs_90\",\"gyogymasszazs\",\"sportmasszazs\"]','assets/adam.png',1,'2025-12-11 15:38:06','2026-01-23 02:00:45',18);
/*!40000 ALTER TABLE `staffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','admin','staff') DEFAULT 'user',
  `newsletter` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `providerId` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `addressZip` varchar(255) DEFAULT NULL,
  `addressCity` varchar(255) DEFAULT NULL,
  `addressStreet` varchar(255) DEFAULT NULL,
  `addressHouseNumber` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `blacklisted` tinyint(1) DEFAULT 0,
  `blacklistReason` varchar(255) DEFAULT NULL,
  `blacklistedAt` datetime DEFAULT NULL,
  `refreshTokenHash` varchar(255) DEFAULT NULL,
  `refreshTokenExpiresAt` datetime DEFAULT NULL,
  `resetPasswordTokenHash` varchar(255) DEFAULT NULL,
  `resetPasswordExpiresAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`),
  UNIQUE KEY `email_48` (`email`),
  UNIQUE KEY `email_49` (`email`),
  UNIQUE KEY `email_50` (`email`),
  UNIQUE KEY `email_51` (`email`),
  UNIQUE KEY `email_52` (`email`),
  UNIQUE KEY `email_53` (`email`),
  UNIQUE KEY `email_54` (`email`),
  UNIQUE KEY `email_55` (`email`),
  UNIQUE KEY `email_56` (`email`),
  UNIQUE KEY `email_57` (`email`),
  UNIQUE KEY `email_58` (`email`),
  UNIQUE KEY `email_59` (`email`),
  UNIQUE KEY `email_60` (`email`),
  UNIQUE KEY `email_61` (`email`),
  UNIQUE KEY `email_62` (`email`),
  UNIQUE KEY `providerId` (`providerId`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Aurora Admin','admin@aurora.hu','$2b$10$0gP4cL396L2nxh5CU26t9u.SI1Voi5gZya1TOWWtoGobRt9R.hIKK','admin',0,'2025-12-06 17:01:06','2026-02-07 08:30:07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,'87adb563e629e03f3702c90fe6240f06fb49577438c29b176e53825a304dfbf7','2026-02-21 08:30:07',NULL,NULL),(2,'fdsfdsf','ff@ff.hu','$2b$10$kREoIOB414mkpGOu78Ej1eWpZepPX5l3lENUkLdwX35Kt0lZYt/ri','user',1,'2025-12-07 17:38:52','2025-12-07 17:38:52',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Próba Elek','proba@proba.hu','$2b$10$GlmtkojlKJn7r0lN5JYM9eXcMEXDtDDyy0AUeEoPQqR2RCcjumo1.','user',0,'2025-12-07 17:41:56','2026-01-27 18:53:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,'nem jött el','2026-01-27 18:53:43',NULL,NULL,NULL,NULL),(4,'gfdgfd','gg@gg.hu','$2b$10$PjGh.gvskl9o0e4sXEv4q.oxEZbEwTaX.cOdvGJohvXcUeShVtJ2i','user',1,'2025-12-07 19:37:05','2026-01-22 20:20:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,NULL,NULL,NULL),(5,'szilvi','bb@bb.hu','$2b$10$Td2TUCPldinrFM49SfuPfewzqJogoE1OSc3aVkOM6eVjAED9HuT0.','user',0,'2025-12-07 20:10:22','2025-12-07 20:10:22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(6,'teszt1','teszt@teszt.hu','$2b$10$FmquvTwGNADd.p93nkFBN.VQKi44mqSgS/UXUueud/zR/RwgKWnVW','user',1,'2026-01-20 15:47:18','2026-01-27 11:36:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(7,'Szilvia Kovács','kovacsszilvia077@gmail.com',NULL,'user',0,'2026-01-20 19:36:34','2026-01-27 18:58:25','google','106374937803087122476','06703256918','','','','',1,0,NULL,NULL,'a811ed455d6c6bb926ddf873773206a50cabf38eb313feea25f021cac3de67e5','2026-02-10 18:58:25','f3038d39d1d1ef90d8276e0aa6e84ae1aab7b7b2d6529721c544e4e396530676','2026-01-27 19:51:31'),(8,'Test User 1769015856484','test1769015856484@example.com','$2b$10$YFrj1rUNkeShNdqYcg3PWeowK.rztewdCyfQ1x7jnTan8i4o0VFDO','user',0,'2026-01-21 17:17:36','2026-01-21 17:17:36',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(9,'kisdora','dora@aurora.hu','$2b$10$S7IjrTUEliy8XnpLB6wGce6iaZmhQzFEQvOyOyJY57u22b1WFwTIe','staff',1,'2026-01-21 18:37:36','2026-01-22 20:20:12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(10,'Dóra Dóra','mm@mm.hu','$2b$10$x9NjGw6E2WZbo0CaMSrYle44Uh4K1CY2Tf6NDKnPn1ZSm79RIWQUq','staff',0,'2026-01-22 18:42:28','2026-01-22 18:43:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(11,'szandi','szandi@aurora.hu','$2b$10$wYU8JNtUTgblSmdKRYu/iOGUOMuTnVNO8jB0lkANSnJEM8l9G1uba','staff',1,'2026-01-22 20:16:27','2026-01-22 20:17:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(12,'Luca','luca1@aurora.hu','$2b$10$F1rpy5DFCIA/NIH7mL43J.WqLbdz872fWO8nsooT1uP1qfLlhGxcy','staff',0,'2026-01-23 02:00:45','2026-01-23 02:05:08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(13,'Petra','petra1@aurora.hu','$2b$10$pCtNpgmUHKloI61oLvpcQOfozEufSmblMuEwvkzg5TVmqtitPutku','staff',0,'2026-01-23 02:00:45','2026-01-23 02:05:08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(14,'Dóri','dori1@aurora.hu','$2b$10$lw/1WTsD6KDA5HqruwnQpuvL9D9iHxV88DgDSRCbglfUGkoUCw1v6','staff',0,'2026-01-23 02:00:45','2026-01-23 02:05:08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(15,'Kinga','kinga1@aurora.hu','$2b$10$BgS1CZqusoUO0mED3AMhAOpdcUitu7gadyWEyG6C1TG.5gm1fL8D.','staff',0,'2026-01-23 02:00:45','2026-01-23 02:05:08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(16,'Lili','lili1@aurora.hu','$2b$10$YOn/JM5QaZaAGwtjVcKuBuwk/bwNs5jPPT1TuoQwVPrSKEBK7ke2K','staff',0,'2026-01-23 02:00:45','2026-01-23 02:05:08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(17,'Júlia','julia1@aurora.hu','$2b$10$dOeymDCKbMk0O2MX37O52OOM/YPxI8.3belPZ2UzD18QC3iqtaJFi','staff',0,'2026-01-23 02:00:45','2026-01-23 02:05:09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL),(18,'Ádám','adam1@aurora.hu','$2b$10$0Cf5h67AZgOPHLWXIQ2NX.363YcqArBvhMrKJypTcOIFe79Ne5bNW','staff',0,'2026-01-23 02:00:45','2026-01-23 02:05:09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-07 10:17:49
