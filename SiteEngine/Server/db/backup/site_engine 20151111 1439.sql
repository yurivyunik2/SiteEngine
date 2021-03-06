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

/*!40000 ALTER TABLE `fields` DISABLE KEYS */;
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (17,72,'en',1,78,'',0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (33,79,'en',1,82,'field2_valuegregre32342',0,'2015-06-17 16:02:59','2015-06-17 16:02:59'),
 (36,83,'en',1,73,'',0,'2015-06-18 13:28:26','2015-06-18 13:28:26'),
 (38,86,'en',1,78,'76|77',0,'2015-06-18 18:44:15','2015-06-18 18:44:15'),
 (39,86,'en',1,80,'79|72',0,'2015-06-18 18:44:15','2015-06-18 18:44:15'),
 (40,86,'en',1,81,'renderings_standart',0,'2015-06-18 18:44:15','2015-06-18 18:44:15'),
 (41,86,'en',1,82,'field2_value_test2',0,'2015-06-18 18:44:16','2015-06-18 18:44:16'),
 (42,74,'en',1,80,'79|72',0,'2015-06-18 18:44:16','2015-06-18 18:44:16'),
 (43,74,'en',1,78,'76|77',0,'2015-06-18 18:44:16','2015-06-18 18:44:16'),
 (44,4000,'en',1,78,'76|77|97',0,'2015-06-19 15:52:48','2015-06-19 15:52:48'),
 (45,4000,'en',1,80,'72',0,'2015-06-19 15:52:48','2015-06-19 15:52:48'),
 (46,4000,'en',1,81,'null',0,'2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (47,4000,'en',1,82,'field2_value',0,'2015-06-19 15:52:49','2015-06-19 15:52:49');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (48,4000,'en',1,98,'null',0,'2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (49,4000,'en',1,99,'null',0,'2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (50,3001,'en',1,101,'./SiteEngine/Site/layouts/Sample Layout.html',0,'2015-06-19 16:04:46','2015-06-19 16:04:46'),
 (51,3001,'en',1,102,'null',0,'2015-06-19 16:04:46','2015-06-19 16:04:46'),
 (52,84,'en',1,78,'76|77|',0,'2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (53,84,'en',1,80,'2128|128|72|',0,'2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (54,84,'en',1,81,'{\"name\":\"\"}',0,'2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (55,84,'en',1,82,'field2_value323',0,'2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (56,84,'en',1,98,'null',0,'2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (57,84,'en',1,99,'null',0,'2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (59,75,'en',1,98,'null',0,'2015-06-19 16:10:53','2015-06-19 16:10:53'),
 (60,75,'en',1,99,'null',0,'2015-06-19 16:10:53','2015-06-19 16:10:53');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (62,97,'en',1,80,'79|72',0,'2015-06-19 16:11:26','2015-06-19 16:11:26'),
 (63,97,'en',1,81,'renderings_standart',0,'2015-06-19 16:11:26','2015-06-19 16:11:26'),
 (68,105,'en',1,82,'field2_value',0,'2015-06-19 16:16:24','2015-06-19 16:16:24'),
 (69,108,'en',1,78,'76|77',0,'2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (70,108,'en',1,80,'75|72',0,'2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (71,108,'en',1,81,'{\"layoutId\":103,\"subLayouts\":[{\"id\":109,\"placeholder\":\"main\"},{\"id\":110,\"placeholder\":\"main_content\"}]}',0,'2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (72,108,'en',1,82,'field2_value',0,'2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (73,108,'en',1,106,'Title_test',0,'2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (74,108,'en',1,107,'Text_test',0,'2015-06-19 16:27:21','2015-06-19 16:27:21'),
 (83,5,'en',1,78,'76|77',0,'2015-07-14 09:20:30','2015-07-14 09:20:30'),
 (84,5,'en',1,80,'100|72',0,'2015-07-14 09:20:30','2015-07-14 09:20:30');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (85,5,'en',1,81,'null',0,'2015-07-14 09:20:30','2015-07-14 09:20:30'),
 (112,156,'en',1,150,'string',0,'2015-07-22 18:54:32','2015-07-22 18:54:32'),
 (115,75,'en',1,78,'76|77',0,'2015-07-24 15:50:10','2015-07-24 15:50:10'),
 (116,73,'en',1,78,'76|77',0,'2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (117,73,'en',1,80,'161|75|72',0,'2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (118,73,'en',1,81,'null',0,'2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (287,324,'en',1,150,'string',0,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (288,325,'en',1,150,'string',0,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (556,4001,'en',1,78,'76|77',0,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (557,4001,'en',1,80,'338',0,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (558,4001,'en',1,81,'null',0,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (559,339,'en',1,150,'string',0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (560,340,'en',1,150,'string',0,'2015-08-14 13:42:31','2015-08-14 13:42:31');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (566,4002,'en',1,339,'null',0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (567,4002,'en',1,340,'null',0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (568,4002,'en',1,78,'76|77',0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (569,4002,'en',1,80,'null',0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (570,4002,'en',1,81,'null',0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (571,4003,'en',1,339,'null',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (572,4003,'en',1,340,'null',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (573,4003,'en',1,78,'76|77',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (574,4003,'en',1,80,'null',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (575,4003,'en',1,81,'null',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (576,4004,'en',1,339,'null',0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (577,4004,'en',1,340,'null',0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (578,4004,'en',1,78,'76|77',0,'2015-08-14 13:44:04','2015-08-14 13:44:04');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (579,4004,'en',1,80,'null',0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (580,4004,'en',1,81,'null',0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (581,4005,'en',1,339,'null',0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (582,4005,'en',1,340,'null',0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (583,4005,'en',1,78,'76|77',0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (584,4005,'en',1,80,'null',0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (585,4005,'en',1,81,'null',0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (586,4006,'en',1,339,'null',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (587,4006,'en',1,340,'null',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (588,4006,'en',1,78,'76|77',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (589,4006,'en',1,80,'null',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (590,4006,'en',1,81,'null',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (591,4007,'en',1,339,'null',0,'2015-08-14 13:44:33','2015-08-14 13:44:33');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (592,4007,'en',1,340,'null',0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (593,4007,'en',1,78,'76|77',0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (594,4007,'en',1,80,'null',0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (595,4007,'en',1,81,'null',0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (605,5000,'en',1,78,'76|77',0,'2015-08-27 13:18:59','2015-08-27 13:18:59'),
 (606,5000,'en',1,80,'2003|72',0,'2015-08-27 13:18:59','2015-08-27 13:18:59'),
 (607,5000,'en',1,81,'null',0,'2015-08-27 13:18:59','2015-08-27 13:18:59'),
 (608,70,'en',1,78,'76|77',0,'2015-08-27 13:20:23','2015-08-27 13:20:23'),
 (609,70,'en',1,80,'72',0,'2015-08-27 13:20:23','2015-08-27 13:20:23'),
 (610,70,'en',1,81,'null',0,'2015-08-27 13:20:23','2015-08-27 13:20:23'),
 (611,2100,'en',1,78,'76|77',0,'2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (612,2100,'en',1,80,'75',0,'2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (613,2100,'en',1,81,'null',0,'2015-08-27 13:32:05','2015-08-27 13:32:05');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (617,2004,'en',1,150,'342',0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (618,2005,'en',1,150,'343',0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (619,2006,'en',1,150,'343',0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (620,2007,'en',1,150,'342',0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (698,2019,'en',1,2004,'null',0,'2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (699,2019,'en',1,2005,'null',0,'2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (700,2019,'en',1,2006,'null',0,'2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (701,2019,'en',1,2007,'null',0,'2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (702,2019,'en',1,78,'76|77',0,'2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (703,2019,'en',1,80,'null',0,'2015-09-01 10:05:47','2015-09-01 10:05:47'),
 (704,2020,'en',1,2004,'null',0,'2015-09-01 10:05:47','2015-09-01 10:05:47'),
 (705,2019,'en',1,81,'null',0,'2015-09-01 10:05:47','2015-09-01 10:05:47'),
 (706,2020,'en',1,2005,'null',0,'2015-09-01 10:05:50','2015-09-01 10:05:50');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (707,2021,'en',1,2004,'/SiteEngine/Site/media/TEST',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (708,2021,'en',1,2005,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (709,2021,'en',1,2006,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (710,2021,'en',1,2007,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (711,2021,'en',1,78,'76|77',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (712,2021,'en',1,80,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (713,2021,'en',1,81,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (714,2022,'en',1,2004,'/SiteEngine/Site/media/TEST',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (715,2022,'en',1,2005,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (716,2022,'en',1,2006,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (717,2022,'en',1,2007,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (718,2022,'en',1,78,'76|77',0,'2015-09-01 10:38:12','2015-09-01 10:38:12');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (719,2022,'en',1,80,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (720,2022,'en',1,81,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (721,2023,'en',1,2004,'/SiteEngine/Site/media/TEST',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (722,2023,'en',1,2005,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (723,2023,'en',1,2006,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (724,2023,'en',1,2007,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (725,2023,'en',1,78,'76|77',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (726,2023,'en',1,80,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (727,2023,'en',1,81,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (749,2027,'en',1,150,'2058',0,'2015-09-04 10:39:28','2015-09-04 10:39:28'),
 (902,4008,'en',1,339,'null',0,'2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (903,4008,'en',1,340,'null',0,'2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (904,4008,'en',1,78,'76|77',0,'2015-09-05 11:16:44','2015-09-05 11:16:44');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (905,4008,'en',1,80,'null',0,'2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (906,4008,'en',1,81,'null',0,'2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (1608,4009,'en',1,339,'null',0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (1609,4009,'en',1,340,'null',0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (1610,4009,'en',1,78,'76|77',0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (1611,4009,'en',1,80,'null',0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (1612,4009,'en',1,81,'null',0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (1613,4010,'en',1,339,'null',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1614,4010,'en',1,340,'null',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1615,4010,'en',1,78,'76|77',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1616,4010,'en',1,80,'null',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1617,4010,'en',1,81,'null',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1742,84,'en',2,78,'76|77|',1,'2015-11-09 13:10:40','2015-11-09 13:10:40');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (1743,84,'en',2,80,'2128|128|72|',1,'2015-11-09 13:10:40','2015-11-09 13:10:40'),
 (1744,84,'en',2,81,'{\"name\":\"mainLayout\",\"id\":\"127\"}',1,'2015-11-09 13:10:40','2015-11-09 13:10:40');
/*!40000 ALTER TABLE `fields` ENABLE KEYS */;


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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `db_site_engine`.`history`
--

/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` (`ID`,`action`,`info`,`user`,`datetime`) VALUES 
 (1,'deleteItem','Data: {\"item\":{\"id\":147}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:43:38'),
 (2,'deleteItem','Data: {\"item\":{\"id\":146}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:43:41'),
 (3,'deleteItem','Data: {\"item\":{\"id\":145}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:43:43'),
 (4,'deleteItem','Data: {\"item\":{\"id\":137}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:43:52'),
 (5,'deleteItem','Data: {\"item\":{\"id\":136}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:43:54'),
 (6,'deleteItem','Data: {\"item\":{\"id\":135}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:43:56'),
 (7,'deleteItem','Data: {\"item\":{\"id\":326}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:43:58'),
 (8,'deleteItem','Data: {\"item\":{\"id\":331}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:44:00'),
 (9,'deleteItem','Data: {\"item\":{\"id\":2131}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:44:01'),
 (10,'deleteItem','Data: {\"item\":{\"id\":127}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:44:11'),
 (11,'deleteItem','Data: {\"item\":{\"id\":126}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:44:13');
INSERT INTO `history` (`ID`,`action`,`info`,`user`,`datetime`) VALUES 
 (12,'deleteItem','Data: {\"item\":{\"id\":2158}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:45:41'),
 (13,'deleteItem','Data: {\"item\":{\"id\":2159}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:45:43'),
 (14,'deleteItem','Data: {\"item\":{\"id\":2134}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:46:21'),
 (15,'deleteItem','Data: {\"item\":{\"id\":2130}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:46:23'),
 (16,'deleteItem','Data: {\"item\":{\"id\":2129}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:46:25'),
 (17,'deleteItem','Data: {\"item\":{\"id\":2128}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:46:26'),
 (18,'deleteItem','Data: {\"item\":{\"id\":142}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:47:00'),
 (19,'deleteItem','Data: {\"item\":{\"id\":128}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:47:27'),
 (20,'deleteItem','Data: {\"item\":{\"id\":121}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:47:29'),
 (21,'deleteItem','Data: {\"item\":{\"id\":116}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:47:31');
INSERT INTO `history` (`ID`,`action`,`info`,`user`,`datetime`) VALUES 
 (22,'deleteItem','Data: {\"item\":{\"id\":131}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:47:48'),
 (23,'deleteItem','Data: {\"item\":{\"id\":130}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:47:51'),
 (24,'deleteItem','Data: {\"item\":{\"id\":115}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:47:52'),
 (25,'deleteItem','Data: {\"item\":{\"id\":114}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:48:21');
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
) ENGINE=InnoDB AUTO_INCREMENT=2134 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `db_site_engine`.`items`
--

/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (1,'engine',75,NULL,0,0,'2015-05-29 19:29:22','2015-05-29 19:29:22'),
 (2,'content',75,NULL,1,0,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (5,'templates',72,NULL,1,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (70,'System',72,NULL,5,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (71,'Common',NULL,NULL,5,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (72,'Folder',75,NULL,71,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (73,'Templates',72,NULL,70,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (74,'Sections',72,NULL,73,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (75,'Template',75,NULL,73,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (76,'Insert Options',NULL,NULL,74,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (77,'Layout',NULL,NULL,74,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (78,'Base_Template',148,NULL,75,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (79,'Standard template',75,NULL,73,0,'2015-05-29 19:29:30','2015-05-29 19:29:30');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (80,'Insert_Options',148,NULL,76,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (81,'Renderings',148,NULL,77,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (84,'main',75,NULL,2,1,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (100,'Layout',79,NULL,70,0,'2015-06-19 15:42:34','2015-06-19 15:42:34'),
 (101,'Path',-1,NULL,100,0,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (102,'ContentHTML',-1,NULL,100,0,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (148,'Template Field',75,NULL,73,0,'2015-07-21 13:24:16','2015-07-21 13:24:16'),
 (150,'Type',-1,NULL,148,0,'2015-07-21 13:24:16','2015-07-21 13:24:16'),
 (323,'templ1',75,NULL,73,0,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (324,'f1',148,NULL,323,0,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (325,'f2',148,NULL,323,0,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (338,'Type',75,NULL,73,0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (339,'Parameters',148,NULL,338,0,'2015-08-14 13:42:31','2015-08-14 13:42:31');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (340,'Control',148,NULL,338,0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (2004,'Src',148,NULL,2101,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2005,'Width',148,NULL,2101,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2006,'Height',148,NULL,2101,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2007,'Alternative Text',148,NULL,2101,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2027,'Blob',148,NULL,2101,0,'2015-09-04 10:39:28','2015-09-04 10:39:28'),
 (2100,'Media',72,NULL,70,0,'2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (2101,'MediaItem',75,NULL,2100,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (3000,'layout',75,NULL,1,0,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (3001,'Sample layout',100,NULL,3000,0,'2015-06-19 16:04:24','2015-06-19 16:04:24'),
 (4000,'system',75,NULL,1,0,'2015-08-03 15:25:07','2015-08-03 15:25:07'),
 (4001,'DataTypes',72,NULL,4000,0,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (4002,'Single-Line',338,NULL,4001,0,'2015-08-14 13:43:53','2015-08-14 13:43:53');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (4003,'Integer',338,NULL,4001,0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (4004,'Rich Text',338,NULL,4001,0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (4005,'Image',338,NULL,4001,0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (4006,'Number',338,NULL,4001,0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (4007,'Datetime',338,NULL,4001,0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (4008,'Blob',338,NULL,4001,0,'2015-09-05 11:16:38','2015-09-05 11:16:38'),
 (4009,'Checkbox',338,NULL,4001,0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (4010,'Password',338,NULL,4001,0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (5000,'media',72,NULL,1,0,'2015-08-14 15:29:56','2015-08-14 15:29:56');
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
