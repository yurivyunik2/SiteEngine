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
) ENGINE=InnoDB AUTO_INCREMENT=1758 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `db_site_engine`.`fields`
--

/*!40000 ALTER TABLE `fields` DISABLE KEYS */;
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (17,2003,'en',1,2009,'',0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (42,2005,'en',1,2011,'2010|2003',0,'2015-06-18 18:44:16','2015-06-18 18:44:16'),
 (43,2005,'en',1,2009,'2007|2008',0,'2015-06-18 18:44:16','2015-06-18 18:44:16'),
 (44,4000,'en',1,2009,'2007|2008|2010',0,'2015-06-19 15:52:48','2015-06-19 15:52:48'),
 (45,4000,'en',1,2011,'2003',0,'2015-06-19 15:52:48','2015-06-19 15:52:48'),
 (46,4000,'en',1,2012,'null',0,'2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (50,3001,'en',1,2015,'./SiteEngine/Site/layouts/Sample Layout.html',0,'2015-06-19 16:04:46','2015-06-19 16:04:46'),
 (51,3001,'en',1,2016,'null',0,'2015-06-19 16:04:46','2015-06-19 16:04:46'),
 (83,2000,'en',1,2009,'2007|2008',0,'2015-07-14 09:20:30','2015-07-14 09:20:30'),
 (84,2000,'en',1,2011,'100|72',0,'2015-07-14 09:20:30','2015-07-14 09:20:30'),
 (85,2000,'en',1,2012,'null',0,'2015-07-14 09:20:30','2015-07-14 09:20:30'),
 (115,2006,'en',1,2009,'2007|2008',0,'2015-07-24 15:50:10','2015-07-24 15:50:10');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (116,2004,'en',1,2009,'2007|2008',0,'2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (117,2004,'en',1,2011,'2006|2003',0,'2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (118,2004,'en',1,2012,'null',0,'2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (556,4001,'en',1,2009,'2007|2008',0,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (557,4001,'en',1,2011,'2019',0,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (558,4001,'en',1,2012,'null',0,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (559,2020,'en',1,2018,'string',0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (560,2021,'en',1,2018,'string',0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (566,4002,'en',1,2020,'null',0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (567,4002,'en',1,2021,'null',0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (568,4002,'en',1,2009,'2007|2008',0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (569,4002,'en',1,2011,'null',0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (570,4002,'en',1,2012,'null',0,'2015-08-14 13:43:53','2015-08-14 13:43:53');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (571,4003,'en',1,2020,'null',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (572,4003,'en',1,2021,'null',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (573,4003,'en',1,2009,'2007|2008',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (574,4003,'en',1,2011,'null',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (575,4003,'en',1,2012,'null',0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (576,4004,'en',1,2020,'null',0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (577,4004,'en',1,2021,'null',0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (578,4004,'en',1,2009,'2007|2008',0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (579,4004,'en',1,2011,'null',0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (580,4004,'en',1,2012,'null',0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (581,4005,'en',1,2020,'null',0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (582,4005,'en',1,2021,'null',0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (583,4005,'en',1,2009,'2007|2008',0,'2015-08-14 13:44:12','2015-08-14 13:44:12');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (584,4005,'en',1,2011,'null',0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (585,4005,'en',1,2012,'null',0,'2015-08-14 13:44:12','2015-08-14 13:44:12'),
 (586,4006,'en',1,2020,'null',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (587,4006,'en',1,2021,'null',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (588,4006,'en',1,2009,'2007|2008',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (589,4006,'en',1,2011,'null',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (590,4006,'en',1,2012,'null',0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (591,4007,'en',1,2020,'null',0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (592,4007,'en',1,2021,'null',0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (593,4007,'en',1,2009,'2007|2008',0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (594,4007,'en',1,2011,'null',0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (595,4007,'en',1,2012,'null',0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (605,5000,'en',1,2009,'2007|2008',0,'2015-08-27 13:18:59','2015-08-27 13:18:59');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (606,5000,'en',1,2011,'2003|72',0,'2015-08-27 13:18:59','2015-08-27 13:18:59'),
 (607,5000,'en',1,2012,'null',0,'2015-08-27 13:18:59','2015-08-27 13:18:59'),
 (608,2001,'en',1,2009,'2007|2008',0,'2015-08-27 13:20:23','2015-08-27 13:20:23'),
 (609,2001,'en',1,2011,'2003',0,'2015-08-27 13:20:23','2015-08-27 13:20:23'),
 (610,2001,'en',1,2012,'null',0,'2015-08-27 13:20:23','2015-08-27 13:20:23'),
 (611,2022,'en',1,2009,'2007|2008',0,'2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (612,2022,'en',1,2011,'2006',0,'2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (613,2022,'en',1,2012,'null',0,'2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (617,2024,'en',1,2018,'4002',0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (618,2025,'en',1,2018,'4003',0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (619,2026,'en',1,2018,'4003',0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (620,2027,'en',1,2018,'4002',0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (698,2019,'en',1,2024,'null',0,'2015-09-01 10:05:44','2015-09-01 10:05:44');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (699,2019,'en',1,2025,'null',0,'2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (700,2019,'en',1,2026,'null',0,'2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (701,2019,'en',1,2027,'null',0,'2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (702,2019,'en',1,2009,'2007|2008',0,'2015-09-01 10:05:44','2015-09-01 10:05:44'),
 (703,2019,'en',1,2011,'null',0,'2015-09-01 10:05:47','2015-09-01 10:05:47'),
 (704,2020,'en',1,2024,'null',0,'2015-09-01 10:05:47','2015-09-01 10:05:47'),
 (705,2019,'en',1,2012,'null',0,'2015-09-01 10:05:47','2015-09-01 10:05:47'),
 (706,2020,'en',1,2025,'null',0,'2015-09-01 10:05:50','2015-09-01 10:05:50'),
 (707,2021,'en',1,2024,'/SiteEngine/Site/media/TEST',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (708,2021,'en',1,2025,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (709,2021,'en',1,2026,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (710,2021,'en',1,2027,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (711,2021,'en',1,2009,'2007|2008',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (712,2021,'en',1,2011,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (713,2021,'en',1,2012,'null',0,'2015-09-01 10:30:49','2015-09-01 10:30:49'),
 (714,2022,'en',1,2024,'/SiteEngine/Site/media/TEST',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (715,2022,'en',1,2025,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (716,2022,'en',1,2026,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (717,2022,'en',1,2027,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (718,2022,'en',1,2009,'2007|2008',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (719,2022,'en',1,2011,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (720,2022,'en',1,2012,'null',0,'2015-09-01 10:38:12','2015-09-01 10:38:12'),
 (721,2023,'en',1,2024,'/SiteEngine/Site/media/TEST',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (722,2023,'en',1,2025,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (723,2023,'en',1,2026,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (724,2023,'en',1,2027,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (725,2023,'en',1,2009,'2007|2008',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (726,2023,'en',1,2011,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (727,2023,'en',1,2012,'null',0,'2015-09-01 10:40:06','2015-09-01 10:40:06'),
 (749,2028,'en',1,2018,'2058',0,'2015-09-04 10:39:28','2015-09-04 10:39:28'),
 (902,4008,'en',1,2020,'null',0,'2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (903,4008,'en',1,2021,'null',0,'2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (904,4008,'en',1,2009,'2007|2008',0,'2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (905,4008,'en',1,2011,'null',0,'2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (906,4008,'en',1,2012,'null',0,'2015-09-05 11:16:44','2015-09-05 11:16:44'),
 (1608,4009,'en',1,2020,'null',0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (1609,4009,'en',1,2021,'null',0,'2015-10-07 10:52:56','2015-10-07 10:52:56');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`isPublish`,`Created`,`Updated`) VALUES 
 (1610,4009,'en',1,2009,'2007|2008',0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (1611,4009,'en',1,2011,'null',0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (1612,4009,'en',1,2012,'null',0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (1613,4010,'en',1,2020,'null',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1614,4010,'en',1,2021,'null',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1615,4010,'en',1,2009,'2007|2008',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1616,4010,'en',1,2011,'null',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1617,4010,'en',1,2012,'null',0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (1745,5002,'en',1,2018,'4002',0,'2015-11-11 18:02:55','2015-11-11 18:02:55'),
 (1746,5003,'en',1,2018,'4002',0,'2015-11-11 18:02:55','2015-11-11 18:02:55'),
 (1755,2013,'en',1,2011,'null',0,'2015-11-11 18:08:26','2015-11-11 18:08:26'),
 (1756,2013,'en',1,2012,'null',0,'2015-11-11 18:08:26','2015-11-11 18:08:26'),
 (1757,2013,'en',1,2009,'2007|2008',0,'2015-11-11 18:08:26','2015-11-11 18:08:26');
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;

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
 (25,'deleteItem','Data: {\"item\":{\"id\":114}}, Results: {\"isOK\":true}',-1,'2015-11-10 14:48:21'),
 (26,'deleteItem','Data: {\"item\":{\"id\":323}}, Results: {\"isOK\":true}',-1,'2015-11-11 15:33:25'),
 (27,'addTemplate','Data: {\"item\":{\"id\":5001,\"name\":\"test1\"}}, Results: {}',-1,'2015-11-11 18:02:55'),
 (28,'newVersionCreate','Data: {\"item\":{\"id\":2013}}, Results: {\"isOK\":true}',-1,'2015-11-11 18:03:58'),
 (29,'saveItem','Data: {\"item\":{\"id\":2013}}, Results: {\"isOK\":true}',-1,'2015-11-11 18:04:07'),
 (30,'saveItem','Data: {\"item\":{\"id\":2013}}, Results: {\"isOK\":true}',-1,'2015-11-11 18:04:41'),
 (31,'createItem','Data: {\"item\":{\"name\":\"test1\"}}, Results: {\"isOK\":true}',-1,'2015-11-11 18:04:47');
INSERT INTO `history` (`ID`,`action`,`info`,`user`,`datetime`) VALUES 
 (32,'newVersionCreate','Data: {\"item\":{\"id\":2013}}, Results: {\"isOK\":true}',-1,'2015-11-11 18:08:26');
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
) ENGINE=InnoDB AUTO_INCREMENT=5005 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `db_site_engine`.`items`
--

/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (1,'engine',2006,NULL,0,0,'2015-05-29 19:29:22','2015-05-29 19:29:22'),
 (2,'content',2006,NULL,1,0,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (2000,'templates',2003,NULL,1,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2001,'System',2003,NULL,2000,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2002,'Common',NULL,NULL,2000,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2003,'Folder',2006,NULL,2002,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2004,'Templates',2003,NULL,2001,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2005,'Sections',2003,NULL,2004,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2006,'Template',2006,NULL,2004,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2007,'Insert Options',2006,NULL,2005,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2008,'Layout',2006,NULL,2005,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2009,'Base_Template',2017,NULL,2006,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2010,'Standard template',2006,NULL,2004,0,'2015-05-29 19:29:30','2015-05-29 19:29:30');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (2011,'Insert_Options',2017,NULL,2007,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2012,'Renderings',2017,NULL,2008,0,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2013,'main',2006,NULL,2,1,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (2014,'Layout',2010,NULL,2001,0,'2015-06-19 15:42:34','2015-06-19 15:42:34'),
 (2015,'Path',-1,NULL,2014,0,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (2016,'ContentHTML',-1,NULL,2014,0,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (2017,'Template Field',2006,NULL,2004,0,'2015-07-21 13:24:16','2015-07-21 13:24:16'),
 (2018,'Type',-1,NULL,2017,0,'2015-07-21 13:24:16','2015-07-21 13:24:16'),
 (2019,'Type',2006,NULL,2004,0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (2020,'Parameters',2017,NULL,2019,0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (2021,'Control',2017,NULL,2019,0,'2015-08-14 13:42:31','2015-08-14 13:42:31'),
 (2022,'Media',2003,NULL,2001,0,'2015-08-27 13:32:05','2015-08-27 13:32:05'),
 (2023,'MediaItem',2006,NULL,2022,0,'2015-08-27 13:39:39','2015-08-27 13:39:39');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (2024,'Src',2017,NULL,2023,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2025,'Width',2017,NULL,2023,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2026,'Height',2017,NULL,2023,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2027,'Alternative Text',2017,NULL,2023,0,'2015-08-27 13:39:39','2015-08-27 13:39:39'),
 (2028,'Blob',2017,NULL,2023,0,'2015-09-04 10:39:28','2015-09-04 10:39:28'),
 (3000,'layout',2006,NULL,1,0,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (3001,'Sample layout',2014,NULL,3000,0,'2015-06-19 16:04:24','2015-06-19 16:04:24'),
 (4000,'system',2006,NULL,1,0,'2015-08-03 15:25:07','2015-08-03 15:25:07'),
 (4001,'DataTypes',2003,NULL,4000,0,'2015-08-14 13:37:58','2015-08-14 13:37:58'),
 (4002,'Single-Line',2019,NULL,4001,0,'2015-08-14 13:43:53','2015-08-14 13:43:53'),
 (4003,'Integer',2019,NULL,4001,0,'2015-08-14 13:43:58','2015-08-14 13:43:58'),
 (4004,'Rich Text',2019,NULL,4001,0,'2015-08-14 13:44:04','2015-08-14 13:44:04'),
 (4005,'Image',2019,NULL,4001,0,'2015-08-14 13:44:12','2015-08-14 13:44:12');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`isPublish`,`Created`,`Updated`) VALUES 
 (4006,'Number',2019,NULL,4001,0,'2015-08-14 13:44:23','2015-08-14 13:44:23'),
 (4007,'Datetime',2019,NULL,4001,0,'2015-08-14 13:44:33','2015-08-14 13:44:33'),
 (4008,'Blob',2019,NULL,4001,0,'2015-09-05 11:16:38','2015-09-05 11:16:38'),
 (4009,'Checkbox',2019,NULL,4001,0,'2015-10-07 10:52:56','2015-10-07 10:52:56'),
 (4010,'Password',2019,NULL,4001,0,'2015-10-07 10:53:32','2015-10-07 10:53:32'),
 (5000,'media',2003,NULL,1,0,'2015-08-14 15:29:56','2015-08-14 15:29:56');
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
