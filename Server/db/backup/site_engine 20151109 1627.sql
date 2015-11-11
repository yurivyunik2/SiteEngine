-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.0.51b-community-nt


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema db_site_engine
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ db_site_engine;
USE db_site_engine;

--
-- Table structure for table `db_site_engine`.`blobs`
--

DROP TABLE IF EXISTS `blobs`;
CREATE TABLE `blobs` (
  `Id` bigint(20) unsigned NOT NULL auto_increment,
  `Data` longblob,
  `Created` datetime default NULL,
  UNIQUE KEY `Id` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `db_site_engine`.`blobs`
--

/*!40000 ALTER TABLE `blobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `blobs` ENABLE KEYS */;


--
-- Table structure for table `db_site_engine`.`fields`
--

DROP TABLE IF EXISTS `fields`;
CREATE TABLE `fields` (
  `Id` bigint(20) unsigned NOT NULL auto_increment,
  `ItemId` bigint(20) default NULL,
  `Language` varchar(50) default NULL,
  `Version` int(10) unsigned default NULL,
  `FieldId` bigint(20) default NULL,
  `Value` varchar(700) NOT NULL default '',
  `isPublish` tinyint(1) NOT NULL default '0',
  `Created` datetime default NULL,
  `Updated` datetime default NULL,
  UNIQUE KEY `Id` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1745 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `db_site_engine`.`fields`
--

--
-- Table structure for table `db_site_engine`.`history`
--

DROP TABLE IF EXISTS `history`;
CREATE TABLE `history` (
  `ID` int(11) NOT NULL auto_increment,
  `action` varchar(45) NOT NULL default '',
  `info` varchar(500) NOT NULL default '',
  `user` bigint(20) NOT NULL default '0',
  `datetime` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `db_site_engine`.`history`
--

/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` (`ID`,`action`,`info`,`user`,`datetime`) VALUES 
 (13,'publishItem','Data: {\"item\":{\"id\":84,\"name\":\"main\"}}, Results: {}',-1,'2015-11-09 16:26:53');
/*!40000 ALTER TABLE `history` ENABLE KEYS */;


--
-- Table structure for table `db_site_engine`.`items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `ID` bigint(20) unsigned NOT NULL auto_increment,
  `Name` varchar(256) NOT NULL default '',
  `TemplateID` bigint(20) default NULL,
  `MasterID` bigint(20) default NULL,
  `ParentID` bigint(20) default NULL,
  `isPublish` tinyint(1) NOT NULL default '0',
  `Created` datetime NOT NULL,
  `Updated` datetime NOT NULL,
  UNIQUE KEY `ID` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2160 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `db_site_engine`.`items`
--

/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (1,'engine',75,NULL,0,0,'2015-05-29 19:29:22','2015-05-29 19:29:22'),
 (2,'content',75,NULL,1,0,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (3,'layout',75,NULL,1,0,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (4,'system',75,NULL,1,0,'2015-08-03 15:25:07','2015-08-03 15:25:07'),
 (5,'templates',72,NULL,1,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (70,'System',72,NULL,5,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (71,'Common',NULL,NULL,5,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (72,'Folder',75,NULL,71,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (73,'Templates',72,NULL,70,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (74,'Sections',72,NULL,73,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (75,'Template',75,NULL,73,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (76,'Insert Options',NULL,NULL,74,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (77,'Layout',NULL,NULL,74,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (78,'Base_Template',148,NULL,75,0,'2015-05-29 19:29:30','2015-05-29 19:29:30');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (79,'Standard template',75,NULL,73,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (80,'Insert_Options',148,NULL,76,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (81,'Renderings',148,NULL,77,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (84,'main',75,NULL,2,1,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (100,'Layout',79,NULL,70,0,'2015-06-19 15:42:34','2015-06-19 15:42:34'),
 (101,'Path',-1,NULL,100,0,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (102,'ContentHTML',-1,NULL,100,0,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (103,'Sample layout',100,NULL,3,0,'2015-06-19 16:04:24','2015-06-19 16:04:24'),
 (114,'UserData',72,NULL,5,0,'2015-07-14 08:47:00','2015-07-14 08:47:00'),
 (115,'Iwith.org',72,NULL,114,0,'2015-07-14 08:56:44','2015-07-14 08:56:44'),
 (116,'Article',75,NULL,115,0,'2015-07-14 08:59:44','2015-07-14 08:59:44'),
 (117,'Header',-1,NULL,116,0,'2015-07-14 08:59:44','2015-07-14 08:59:44'),
 (118,'Content',-1,NULL,116,0,'2015-07-14 08:59:45','2015-07-14 08:59:45');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (119,'Image',-1,NULL,116,0,'2015-07-14 08:59:45','2015-07-14 08:59:45'),
 (120,'ImageDescription',-1,NULL,116,0,'2015-07-14 08:59:45','2015-07-14 08:59:45'),
 (121,'NewsItem',75,NULL,115,0,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (122,'Data',-1,NULL,121,0,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (123,'Header',-1,NULL,121,0,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (124,'Link',-1,NULL,121,0,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (125,'ContentShort',-1,NULL,121,0,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (126,'Iwith.org',72,NULL,3,0,'2015-07-14 09:19:26','2015-07-14 09:19:26'),
 (127,'mainLayout',100,NULL,126,0,'2015-07-14 09:23:07','2015-07-14 09:23:07'),
 (128,'HeaderMenuItem',75,NULL,115,0,'2015-07-15 11:59:07','2015-07-15 11:59:07'),
 (129,'Title',-1,NULL,128,0,'2015-07-15 11:59:07','2015-07-15 11:59:07'),
 (130,'HeaderMenu',72,NULL,115,0,'2015-07-15 12:00:28','2015-07-15 12:00:28'),
 (131,'OrganizaciónInfo',75,NULL,130,0,'2015-07-15 12:01:29','2015-07-15 12:01:29');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (132,'Title',-1,NULL,131,0,'2015-07-15 12:01:29','2015-07-15 12:01:29'),
 (133,'Content',-1,NULL,131,0,'2015-07-15 12:01:29','2015-07-15 12:01:29'),
 (134,'Image',-1,NULL,131,0,'2015-07-15 12:01:29','2015-07-15 12:01:29'),
 (135,'HeaderMenu',72,NULL,84,1,'2015-07-15 12:03:14','2015-07-15 12:03:14'),
 (136,'Organizacion',72,NULL,135,0,'2015-07-15 12:04:04','2015-07-15 12:04:04'),
 (137,'Info',131,NULL,136,0,'2015-07-15 12:04:28','2015-07-15 12:04:28'),
 (138,'Home',131,NULL,135,0,'2015-07-16 17:04:08','2015-07-16 17:04:08'),
 (139,'Services',131,NULL,135,0,'2015-07-16 17:05:22','2015-07-16 17:05:22'),
 (141,'News',131,NULL,135,0,'2015-07-16 17:09:20','2015-07-16 17:09:20'),
 (142,'Link',75,NULL,115,0,'2015-07-20 12:17:19','2015-07-20 12:17:19'),
 (143,'Title',-1,NULL,142,0,'2015-07-20 12:17:19','2015-07-20 12:17:19'),
 (144,'Address',-1,NULL,142,0,'2015-07-20 12:17:20','2015-07-20 12:17:20'),
 (145,'Footer',72,NULL,84,0,'2015-07-20 12:17:45','2015-07-20 12:17:45');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (146,'InternetConsulting',142,NULL,145,0,'2015-07-20 12:18:39','2015-07-20 12:18:39'),
 (147,'Working online',142,NULL,145,0,'2015-07-20 12:19:47','2015-07-20 12:19:47'),
 (148,'Template Field',75,NULL,73,0,'2015-07-21 13:24:16','2015-07-21 13:24:16'),
 (150,'Type',-1,NULL,148,0,'2015-07-21 13:24:16','2015-07-21 13:24:16'),
 (323,'templ1',75,NULL,73,0,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (324,'f1',148,NULL,323,0,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (325,'f2',148,NULL,323,0,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (326,'test1',323,NULL,84,0,'2015-07-31 16:59:37','2015-07-31 16:59:37'),
 (331,'test2',327,NULL,84,0,'2015-08-03 15:25:07','2015-08-03 15:25:07'),
 (337,'DataTypes',72,NULL,4,0,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (338,'Type',75,NULL,73,0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (339,'Parameters',148,NULL,338,0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (340,'Control',148,NULL,338,0,'2015-08-14 13:42:31','2015-08-14 13:42:31');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (342,'Single-Line',338,NULL,337,0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (343,'Integer',338,NULL,337,0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (344,'Rich Text',338,NULL,337,0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (345,'Image',338,NULL,337,0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (346,'Number',338,NULL,337,0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (347,'Datetime',338,NULL,337,0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (2000,'media',72,NULL,1,0,'2015-08-14 15:29:56','2015-08-14 15:29:56'),
 (2001,'Media',72,NULL,70,0,'2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (2003,'MediaItem',75,NULL,2001,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2004,'Src',148,NULL,2003,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2005,'Width',148,NULL,2003,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2006,'Height',148,NULL,2003,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2007,'Alternative Text',148,NULL,2003,0,'2015-08-27 13:39:39','2015-08-27 13:39:39');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (2027,'Blob',148,NULL,2003,0,'2015-09-04 10:39:28','2015-09-04 10:39:28'),
 (2058,'Blob',338,NULL,337,0,'2015-09-05 11:16:38','2015-09-05 11:16:38'),
 (2128,'temp2',75,NULL,73,0,'2015-09-16 12:30:30','2015-09-16 12:30:30'),
 (2129,'f1',148,NULL,2128,0,'2015-09-16 12:30:30','2015-09-16 12:30:30'),
 (2130,'f2',148,NULL,2128,0,'2015-09-16 12:30:30','2015-09-16 12:30:30'),
 (2131,'test3_2',2128,NULL,84,0,'2015-09-16 12:31:15','2015-09-16 12:31:15'),
 (2132,'Checkbox',338,NULL,337,0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (2133,'Password',338,NULL,337,0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (2134,'image',148,NULL,2128,0,'2015-10-07 11:13:56','2015-10-07 11:13:56'),
 (2158,'flowers.jpg',2003,NULL,2000,0,'2015-10-27 11:55:34','2015-10-27 11:55:34'),
 (2159,'flowers2.jpg',2003,NULL,2000,0,'2015-10-27 11:58:50','2015-10-27 11:58:50');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;


--
-- Table structure for table `db_site_engine`.`user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` bigint(20) unsigned NOT NULL auto_increment,
  `name` varchar(45) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `db_site_engine`.`user_roles`
--

/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` (`id`,`name`) VALUES 
 (1,'administrator'),
 (2,'editor'),
 (3,'author'),
 (4,'user'),
 (5,'subscriber');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;


--
-- Table structure for table `db_site_engine`.`users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL auto_increment,
  `name` varchar(45) NOT NULL default '',
  `fullname` varchar(80) NOT NULL default '',
  `role` bigint(20) unsigned NOT NULL default '0',
  `email` varchar(45) NOT NULL default '',
  `password` varchar(60) NOT NULL default '',
  `comment` varchar(300) NOT NULL default '',
  `language` varchar(10) NOT NULL default '',
  PRIMARY KEY  (`id`),
  KEY `FK_role` (`role`),
  CONSTRAINT `FK_role` FOREIGN KEY (`role`) REFERENCES `user_roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `db_site_engine`.`users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`,`name`,`fullname`,`role`,`email`,`password`,`comment`,`language`) VALUES 
 (5,'admin','admin',1,'admin@mail.ru','sha1$5a74ab62$1$976cad07adc0e42c89e03836e8d760f24397b6a3','',''),
 (8,'user','user',4,'user@mail.ru','sha1$2622dc63$1$70e5c9a48814dbba3d2cf81576e75bcf2e2fbe1e','',''),
 (9,'editor','editor',2,'editor@mail.ru','sha1$1c5c932a$1$6264963e657d8edfc328dd2e560ed047ed8c4515','','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
