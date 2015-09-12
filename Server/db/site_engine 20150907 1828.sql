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
) ENGINE=InnoDB AUTO_INCREMENT=659 DEFAULT CHARSET=latin1;

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
  `Version` int(11) default NULL,
  `FieldId` bigint(20) default NULL,
  `Value` varchar(700) NOT NULL default '',
  `Created` datetime default NULL,
  `Updated` datetime default NULL,
  UNIQUE KEY `Id` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1569 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `db_site_engine`.`fields`
--

/*!40000 ALTER TABLE `fields` DISABLE KEYS */;
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (17,72,'en',1,78,'','2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (33,79,'en',1,82,'field2_valuegregre32342','2015-06-17 16:02:59','2015-06-17 16:02:59'),
 (36,83,'en',1,73,'','2015-06-18 13:28:26','2015-06-18 13:28:26'),
 (38,86,'en',1,78,'76|77','2015-06-18 18:44:15','2015-06-18 18:44:15'),
 (39,86,'en',1,80,'79|72','2015-06-18 18:44:15','2015-06-18 18:44:15'),
 (40,86,'en',1,81,'renderings_standart','2015-06-18 18:44:15','2015-06-18 18:44:15'),
 (41,86,'en',1,82,'field2_value_test2','2015-06-18 18:44:16','2015-06-18 18:44:16'),
 (42,74,'en',1,80,'79|72','2015-06-18 18:44:16','2015-06-18 18:44:16'),
 (43,74,'en',1,78,'76|77','2015-06-18 18:44:16','2015-06-18 18:44:16'),
 (44,4,'en',1,78,'76|77|97','2015-06-19 15:52:48','2015-06-19 15:52:48'),
 (45,4,'en',1,80,'72','2015-06-19 15:52:48','2015-06-19 15:52:48'),
 (46,4,'en',1,81,'null','2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (47,4,'en',1,82,'field2_value','2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (48,4,'en',1,98,'null','2015-06-19 15:52:49','2015-06-19 15:52:49');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (49,4,'en',1,99,'null','2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (50,103,'en',1,101,'./SiteEngine/Site/layouts/Sample Layout.html','2015-06-19 16:04:46','2015-06-19 16:04:46'),
 (51,103,'en',1,102,'null','2015-06-19 16:04:46','2015-06-19 16:04:46'),
 (52,84,'en',1,78,'76|77','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (53,84,'en',1,80,'348|285|128|105|72|','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (54,84,'en',1,81,'{\"layout\":{\"name\":\"mainLayout\",\"id\":127},\"subLayouts\":[]}','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (55,84,'en',1,82,'field2_value323','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (56,84,'en',1,98,'null','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (57,84,'en',1,99,'null','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (59,75,'en',1,98,'null','2015-06-19 16:10:53','2015-06-19 16:10:53'),
 (60,75,'en',1,99,'null','2015-06-19 16:10:53','2015-06-19 16:10:53'),
 (62,97,'en',1,80,'79|72','2015-06-19 16:11:26','2015-06-19 16:11:26');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (63,97,'en',1,81,'renderings_standart','2015-06-19 16:11:26','2015-06-19 16:11:26'),
 (68,105,'en',1,82,'field2_value','2015-06-19 16:16:24','2015-06-19 16:16:24'),
 (69,108,'en',1,78,'76|77','2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (70,108,'en',1,80,'75|72','2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (71,108,'en',1,81,'{\"layoutId\":103,\"subLayouts\":[{\"id\":109,\"placeholder\":\"main\"},{\"id\":110,\"placeholder\":\"main_content\"}]}','2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (72,108,'en',1,82,'field2_value','2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (73,108,'en',1,106,'Title_test','2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (74,108,'en',1,107,'Text_test','2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (83,5,'en',1,78,'76|77','2015-07-14 09:20:30','2015-07-14 09:20:30'),
 (84,5,'en',1,80,'100|72','2015-07-14 09:20:30','2015-07-14 09:20:30'),
 (85,5,'en',1,81,'null','2015-07-14 09:20:30','2015-07-14 09:20:30'),
 (86,126,'en',1,78,'76|77','2015-07-14 09:22:01','2015-07-14 09:22:01');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (87,126,'en',1,80,'100|72','2015-07-14 09:22:33','2015-07-14 09:22:33'),
 (88,126,'en',1,81,'null','2015-07-14 09:22:36','2015-07-14 09:22:36'),
 (89,127,'en',1,101,'./SiteEngine/Site/layouts/Iwith.org/mainLayout.html','2015-07-14 09:29:37','2015-07-14 09:29:37'),
 (90,127,'en',1,102,'null','2015-07-14 09:29:39','2015-07-14 09:29:39'),
 (91,135,'en',1,78,'76|77','2015-07-15 12:03:38','2015-07-15 12:03:38'),
 (92,135,'en',1,80,'131|75|72','2015-07-15 12:03:38','2015-07-15 12:03:38'),
 (93,135,'en',1,81,'null','2015-07-15 12:03:38','2015-07-15 12:03:38'),
 (94,136,'en',1,78,'76|77','2015-07-15 12:04:18','2015-07-15 12:04:18'),
 (95,136,'en',1,80,'131|75|72','2015-07-15 12:04:18','2015-07-15 12:04:18'),
 (96,136,'en',1,81,'null','2015-07-15 12:04:18','2015-07-15 12:04:18'),
 (97,137,'en',1,78,'76|77','2015-07-15 12:04:59','2015-07-15 12:04:59'),
 (98,137,'en',1,80,'null','2015-07-15 12:04:59','2015-07-15 12:04:59'),
 (99,137,'en',1,81,'null','2015-07-15 12:04:59','2015-07-15 12:04:59');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (100,137,'en',1,132,'Organisation','2015-07-15 12:04:59','2015-07-15 12:04:59'),
 (101,137,'en',1,133,'The iWith.org Foundation is a non-profit organisation with an international scope founded in 2001 to participate actively in the development of the most disadvantaged regions and populations, offering active assistance to take advantage of the opportunities offered by the internet and the organisations.  iWith.org is a pioneer in Internet-based training with the Ab-soo “sharing for education” programme which had the participation of organisations from Mexico, Guatemala, Dominican Republic and Ecuador.  Using its own technology, iWith.org has developed Ab-core, a platform of services which are being used by hundreds of organisations to manage their internet projects and online working.','2015-07-15 12:04:59','2015-07-15 12:04:59'),
 (102,137,'en',1,134,'http://www.iwith.org/mm/image/web2013/voluntarios.jpg','2015-07-15 12:04:59','2015-07-15 12:04:59'),
 (103,145,'en',1,78,'76|77','2015-07-20 12:18:16','2015-07-20 12:18:16');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (104,145,'en',1,80,'142|75|72','2015-07-20 12:18:17','2015-07-20 12:18:17'),
 (105,145,'en',1,81,'null','2015-07-20 12:18:17','2015-07-20 12:18:17'),
 (106,146,'en',1,78,'null','2015-07-20 12:19:10','2015-07-20 12:19:10'),
 (107,146,'en',1,143,'Internet consulting222','2015-07-20 12:19:10','2015-07-20 12:19:10'),
 (108,146,'en',1,144,'http://www.iwith.org//en/soluciones/consultoria_internet.html','2015-07-20 12:19:10','2015-07-20 12:19:10'),
 (109,147,'en',1,78,'null','2015-07-20 12:19:55','2015-07-20 12:19:55'),
 (110,147,'en',1,143,'Working online','2015-07-20 12:19:55','2015-07-20 12:19:55'),
 (111,147,'en',1,144,'http://www.iwith.org/en/soluciones/oficinavirtual.html','2015-07-20 12:19:55','2015-07-20 12:19:55'),
 (112,156,'en',1,150,'string','2015-07-22 18:54:32','2015-07-22 18:54:32'),
 (115,75,'en',1,78,'76|77','2015-07-24 15:50:10','2015-07-24 15:50:10'),
 (116,73,'en',1,78,'76|77','2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (117,73,'en',1,80,'161|75|72','2015-07-24 16:45:43','2015-07-24 16:45:43');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (118,73,'en',1,81,'null','2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (240,136,'en',1,78,'76|77','2015-07-29 13:50:19','2015-07-29 13:50:19'),
 (241,135,'en',1,78,'76|77','2015-07-29 13:51:31','2015-07-29 13:51:31'),
 (242,135,'en',1,78,'76|77','2015-07-29 13:51:34','2015-07-29 13:51:34'),
 (243,135,'en',1,78,'76|77','2015-07-29 14:02:05','2015-07-29 14:02:05'),
 (287,324,'en',1,150,'string','2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (288,325,'en',1,150,'string','2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (483,326,'en',1,324,'f11','2015-08-03 15:19:13','2015-08-03 15:19:13'),
 (484,326,'en',1,325,'f22','2015-08-03 15:19:13','2015-08-03 15:19:13'),
 (485,326,'en',1,78,'76|77|79','2015-08-03 15:19:13','2015-08-03 15:19:13'),
 (486,326,'en',1,80,'1111','2015-08-03 15:19:14','2015-08-03 15:19:14'),
 (487,326,'en',1,81,'2222','2015-08-03 15:19:14','2015-08-03 15:19:14'),
 (488,326,'en',2,324,'f11_222','2015-08-03 15:21:03','2015-08-03 15:21:03'),
 (489,326,'en',2,325,'f22_222','2015-08-03 15:21:03','2015-08-03 15:21:03');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (490,326,'en',2,78,'76|77|79|22','2015-08-03 15:21:03','2015-08-03 15:21:03'),
 (491,326,'en',2,80,'1111_222','2015-08-03 15:21:03','2015-08-03 15:21:03'),
 (492,326,'en',2,81,'2222_222','2015-08-03 15:21:03','2015-08-03 15:21:03'),
 (493,326,'en',3,324,'f11_333','2015-08-03 15:23:39','2015-08-03 15:23:39'),
 (494,326,'en',3,325,'f22_333','2015-08-03 15:23:39','2015-08-03 15:23:39'),
 (495,326,'en',3,78,'76|77|79|33','2015-08-03 15:23:39','2015-08-03 15:23:39'),
 (496,326,'en',3,80,'1111_333','2015-08-03 15:23:39','2015-08-03 15:23:39'),
 (497,326,'en',3,81,'{\"layout\":{\"name\":\"mainLayout\",\"id\":127},\"subLayouts\":[]}','2015-08-03 15:23:39','2015-08-03 15:23:39'),
 (548,331,'en',2,78,'76|77','2015-08-03 17:04:23','2015-08-03 17:04:23'),
 (549,331,'en',2,80,'null','2015-08-03 17:04:23','2015-08-03 17:04:23'),
 (550,331,'en',2,81,'{\"layout\":{\"name\":\"mainLayout\",\"id\":128},\"subLayouts\":[]}','2015-08-03 17:04:23','2015-08-03 17:04:23'),
 (551,135,'en',2,78,'76|77|78','2015-08-12 17:53:21','2015-08-12 17:53:21');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (552,135,'en',2,80,'131|75|72','2015-08-12 17:53:21','2015-08-12 17:53:21'),
 (553,135,'en',2,81,'null','2015-08-12 17:53:21','2015-08-12 17:53:21'),
 (556,337,'en',1,78,'76|77','2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (557,337,'en',1,80,'338','2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (558,337,'en',1,81,'null','2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (559,339,'en',1,150,'string','2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (560,340,'en',1,150,'string','2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (566,342,'en',1,339,'null','2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (567,342,'en',1,340,'null','2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (568,342,'en',1,78,'76|77','2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (569,342,'en',1,80,'null','2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (570,342,'en',1,81,'null','2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (571,343,'en',1,339,'null','2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (572,343,'en',1,340,'null','2015-08-14 13:43:58','2015-08-14 13:43:58');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (573,343,'en',1,78,'76|77','2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (574,343,'en',1,80,'null','2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (575,343,'en',1,81,'null','2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (576,344,'en',1,339,'null','2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (577,344,'en',1,340,'null','2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (578,344,'en',1,78,'76|77','2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (579,344,'en',1,80,'null','2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (580,344,'en',1,81,'null','2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (581,345,'en',1,339,'null','2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (582,345,'en',1,340,'null','2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (583,345,'en',1,78,'76|77','2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (584,345,'en',1,80,'null','2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (585,345,'en',1,81,'null','2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (586,346,'en',1,339,'null','2015-08-14 13:44:23','2015-08-14 13:44:23');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (587,346,'en',1,340,'null','2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (588,346,'en',1,78,'76|77','2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (589,346,'en',1,80,'null','2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (590,346,'en',1,81,'null','2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (591,347,'en',1,339,'null','2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (592,347,'en',1,340,'null','2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (593,347,'en',1,78,'76|77','2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (594,347,'en',1,80,'null','2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (595,347,'en',1,81,'null','2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (596,349,'en',1,150,'342','2015-08-14 14:57:30','2015-08-14 14:57:30'),
 (597,350,'en',1,150,'343','2015-08-14 14:57:30','2015-08-14 14:57:30'),
 (598,351,'en',1,150,'344','2015-08-14 15:28:26','2015-08-14 15:28:26'),
 (599,352,'en',1,349,'Single-Line11111','2015-08-14 15:29:56','2015-08-14 15:29:56'),
 (600,352,'en',1,350,'Integer1111','2015-08-14 15:29:56','2015-08-14 15:29:56');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (601,352,'en',1,351,'Rich Text1111','2015-08-14 15:29:56','2015-08-14 15:29:56'),
 (602,352,'en',1,78,'76|77','2015-08-14 15:29:56','2015-08-14 15:29:56'),
 (603,352,'en',1,80,'null','2015-08-14 15:29:56','2015-08-14 15:29:56'),
 (604,352,'en',1,81,'null','2015-08-14 15:29:56','2015-08-14 15:29:56'),
 (605,2000,'en',1,78,'76|77','2015-08-27 13:18:59','2015-08-27 13:18:59'),
 (606,2000,'en',1,80,'2003|72','2015-08-27 13:18:59','2015-08-27 13:18:59'),
 (607,2000,'en',1,81,'null','2015-08-27 13:18:59','2015-08-27 13:18:59'),
 (608,70,'en',1,78,'76|77','2015-08-27 13:20:23','2015-08-27 13:20:23'),
 (609,70,'en',1,80,'72','2015-08-27 13:20:23','2015-08-27 13:20:23'),
 (610,70,'en',1,81,'null','2015-08-27 13:20:23','2015-08-27 13:20:23'),
 (611,2001,'en',1,78,'76|77','2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (612,2001,'en',1,80,'75','2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (613,2001,'en',1,81,'null','2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (617,2004,'en',1,150,'342','2015-08-27 13:39:39','2015-08-27 13:39:39');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (618,2005,'en',1,150,'343','2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (619,2006,'en',1,150,'343','2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (620,2007,'en',1,150,'342','2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (698,2019,'en',1,2004,'null','2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (699,2019,'en',1,2005,'null','2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (700,2019,'en',1,2006,'null','2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (701,2019,'en',1,2007,'null','2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (702,2019,'en',1,78,'76|77','2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (703,2019,'en',1,80,'null','2015-09-01 10:05:47','2015-09-01 10:05:47'),
 (704,2020,'en',1,2004,'null','2015-09-01 10:05:47','2015-09-01 10:05:47'),
 (705,2019,'en',1,81,'null','2015-09-01 10:05:47','2015-09-01 10:05:47'),
 (706,2020,'en',1,2005,'null','2015-09-01 10:05:50','2015-09-01 10:05:50'),
 (707,2021,'en',1,2004,'/SiteEngine/Site/media/TEST','2015-09-01 10:30:49','2015-09-01 10:30:49');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (708,2021,'en',1,2005,'null','2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (709,2021,'en',1,2006,'null','2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (710,2021,'en',1,2007,'null','2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (711,2021,'en',1,78,'76|77','2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (712,2021,'en',1,80,'null','2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (713,2021,'en',1,81,'null','2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (714,2022,'en',1,2004,'/SiteEngine/Site/media/TEST','2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (715,2022,'en',1,2005,'null','2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (716,2022,'en',1,2006,'null','2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (717,2022,'en',1,2007,'null','2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (718,2022,'en',1,78,'76|77','2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (719,2022,'en',1,80,'null','2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (720,2022,'en',1,81,'null','2015-09-01 10:38:12','2015-09-01 10:38:12');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (721,2023,'en',1,2004,'/SiteEngine/Site/media/TEST','2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (722,2023,'en',1,2005,'null','2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (723,2023,'en',1,2006,'null','2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (724,2023,'en',1,2007,'null','2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (725,2023,'en',1,78,'76|77','2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (726,2023,'en',1,80,'null','2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (727,2023,'en',1,81,'null','2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (749,2027,'en',1,150,'2058','2015-09-04 10:39:28','2015-09-04 10:39:28'),
 (902,2058,'en',1,339,'null','2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (903,2058,'en',1,340,'null','2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (904,2058,'en',1,78,'76|77','2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (905,2058,'en',1,80,'null','2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (906,2058,'en',1,81,'null','2015-09-05 11:16:44','2015-09-05 11:16:44');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (1426,2110,'en',1,2004,'null','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1427,2110,'en',1,2005,'null','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1428,2110,'en',1,2006,'null','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1429,2110,'en',1,2007,'null','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1430,2110,'en',1,2027,'646','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1431,2110,'en',1,78,'76|77','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1432,2110,'en',1,78,'76|77','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1433,2110,'en',1,80,'null','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1434,2110,'en',1,80,'null','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1435,2110,'en',1,81,'null','2015-09-07 18:12:20','2015-09-07 18:12:20'),
 (1436,2110,'en',1,81,'null','2015-09-07 18:12:20','2015-09-07 18:12:20');
/*!40000 ALTER TABLE `fields` ENABLE KEYS */;


--
-- Table structure for table `db_site_engine`.`items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `ID` bigint(20) unsigned NOT NULL auto_increment,
  `Name` varchar(256) NOT NULL,
  `TemplateID` bigint(20) default NULL,
  `MasterID` bigint(20) default NULL,
  `ParentID` bigint(20) default NULL,
  `Created` datetime NOT NULL,
  `Updated` datetime NOT NULL,
  UNIQUE KEY `ID` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2123 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `db_site_engine`.`items`
--

/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (1,'engine',NULL,NULL,0,'2015-05-29 19:29:22','2015-05-29 19:29:22'),
 (2,'content',NULL,NULL,1,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (3,'layout',75,NULL,1,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (4,'system',75,NULL,1,'2015-08-03 15:25:07','2015-08-03 15:25:07'),
 (5,'templates',72,NULL,1,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (70,'System',72,NULL,5,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (71,'Common',NULL,NULL,5,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (72,'Folder',75,NULL,71,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (73,'Templates',72,NULL,70,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (74,'Sections',72,NULL,73,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (75,'Template',75,NULL,73,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (76,'Insert Options',NULL,NULL,74,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (77,'Layout',NULL,NULL,74,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (78,'Base_Template',NULL,NULL,75,'2015-05-29 19:29:30','2015-05-29 19:29:30');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (79,'Standard template',75,NULL,73,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (80,'Insert_Options',NULL,NULL,76,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (81,'Renderings',NULL,NULL,77,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (84,'main',75,NULL,2,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (100,'Layout',79,NULL,70,'2015-06-19 15:42:34','2015-06-19 15:42:34'),
 (101,'Path',-1,NULL,100,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (102,'ContentHTML',-1,NULL,100,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (103,'Sample layout',100,NULL,3,'2015-06-19 16:04:24','2015-06-19 16:04:24'),
 (114,'UserData',72,NULL,5,'2015-07-14 08:47:00','2015-07-14 08:47:00'),
 (115,'Iwith.org',72,NULL,114,'2015-07-14 08:56:44','2015-07-14 08:56:44'),
 (116,'Article',75,NULL,115,'2015-07-14 08:59:44','2015-07-14 08:59:44'),
 (117,'Header',-1,NULL,116,'2015-07-14 08:59:44','2015-07-14 08:59:44'),
 (118,'Content',-1,NULL,116,'2015-07-14 08:59:45','2015-07-14 08:59:45');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (119,'Image',-1,NULL,116,'2015-07-14 08:59:45','2015-07-14 08:59:45'),
 (120,'ImageDescription',-1,NULL,116,'2015-07-14 08:59:45','2015-07-14 08:59:45'),
 (121,'NewsItem',75,NULL,115,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (122,'Data',-1,NULL,121,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (123,'Header',-1,NULL,121,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (124,'Link',-1,NULL,121,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (125,'ContentShort',-1,NULL,121,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (126,'Iwith.org',72,NULL,3,'2015-07-14 09:19:26','2015-07-14 09:19:26'),
 (127,'mainLayout',100,NULL,126,'2015-07-14 09:23:07','2015-07-14 09:23:07'),
 (128,'HeaderMenuItem',75,NULL,115,'2015-07-15 11:59:07','2015-07-15 11:59:07'),
 (129,'Title',-1,NULL,128,'2015-07-15 11:59:07','2015-07-15 11:59:07'),
 (130,'HeaderMenu',72,NULL,115,'2015-07-15 12:00:28','2015-07-15 12:00:28'),
 (131,'OrganizaciónInfo',75,NULL,130,'2015-07-15 12:01:29','2015-07-15 12:01:29');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (132,'Title',-1,NULL,131,'2015-07-15 12:01:29','2015-07-15 12:01:29'),
 (133,'Content',-1,NULL,131,'2015-07-15 12:01:29','2015-07-15 12:01:29'),
 (134,'Image',-1,NULL,131,'2015-07-15 12:01:29','2015-07-15 12:01:29'),
 (135,'HeaderMenu',72,NULL,84,'2015-07-15 12:03:14','2015-07-15 12:03:14'),
 (136,'Organizacion',72,NULL,135,'2015-07-15 12:04:04','2015-07-15 12:04:04'),
 (137,'Info',131,NULL,136,'2015-07-15 12:04:28','2015-07-15 12:04:28'),
 (138,'Home',131,NULL,135,'2015-07-16 17:04:08','2015-07-16 17:04:08'),
 (139,'Services',131,NULL,135,'2015-07-16 17:05:22','2015-07-16 17:05:22'),
 (141,'News',131,NULL,135,'2015-07-16 17:09:20','2015-07-16 17:09:20'),
 (142,'Link',75,NULL,115,'2015-07-20 12:17:19','2015-07-20 12:17:19'),
 (143,'Title',-1,NULL,142,'2015-07-20 12:17:19','2015-07-20 12:17:19'),
 (144,'Address',-1,NULL,142,'2015-07-20 12:17:20','2015-07-20 12:17:20'),
 (145,'Footer',72,NULL,84,'2015-07-20 12:17:45','2015-07-20 12:17:45'),
 (146,'InternetConsulting',142,NULL,145,'2015-07-20 12:18:39','2015-07-20 12:18:39');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (147,'Working online',142,NULL,145,'2015-07-20 12:19:47','2015-07-20 12:19:47'),
 (148,'Template Field',75,NULL,73,'2015-07-21 13:24:16','2015-07-21 13:24:16'),
 (150,'Type',-1,NULL,148,'2015-07-21 13:24:16','2015-07-21 13:24:16'),
 (323,'templ1',75,NULL,73,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (324,'f1',148,NULL,323,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (325,'f2',148,NULL,323,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (326,'test1',323,NULL,84,'2015-07-31 16:59:37','2015-07-31 16:59:37'),
 (331,'test2',327,NULL,84,'2015-08-03 15:25:07','2015-08-03 15:25:07'),
 (337,'DataTypes',72,NULL,4,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (338,'Type',75,NULL,73,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (339,'Parameters',148,NULL,338,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (340,'Control',148,NULL,338,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (342,'Single-Line',338,NULL,337,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (343,'Integer',338,NULL,337,'2015-08-14 13:43:58','2015-08-14 13:43:58');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (344,'Rich Text',338,NULL,337,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (345,'Image',338,NULL,337,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (346,'Number',338,NULL,337,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (347,'Datetime',338,NULL,337,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (348,'temp2',75,NULL,73,'2015-08-14 14:57:30','2015-08-14 14:57:30'),
 (349,'f1',148,NULL,348,'2015-08-14 14:57:30','2015-08-14 14:57:30'),
 (350,'f2',148,NULL,348,'2015-08-14 14:57:30','2015-08-14 14:57:30'),
 (351,'f3',148,NULL,348,'2015-08-14 15:28:26','2015-08-14 15:28:26'),
 (352,'test3',348,NULL,84,'2015-08-14 15:29:56','2015-08-14 15:29:56'),
 (2000,'media',72,NULL,1,'2015-08-14 15:29:56','2015-08-14 15:29:56'),
 (2001,'Media',72,NULL,70,'2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (2003,'MediaItem',75,NULL,2001,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2004,'Src',148,NULL,2003,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2005,'Width',148,NULL,2003,'2015-08-27 13:39:39','2015-08-27 13:39:39');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (2006,'Height',148,NULL,2003,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2007,'Alternative Text',148,NULL,2003,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2027,'Blob',148,NULL,2003,'2015-09-04 10:39:28','2015-09-04 10:39:28'),
 (2058,'Blob',338,NULL,337,'2015-09-05 11:16:38','2015-09-05 11:16:38'),
 (2110,'test2',2003,NULL,2000,'2015-09-07 18:12:19','2015-09-07 18:12:19');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;


--
-- Table structure for table `db_site_engine`.`user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` bigint(20) unsigned NOT NULL auto_increment,
  `name` varchar(45) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

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