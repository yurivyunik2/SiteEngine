-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.0.67-community-nt


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
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=latin1;

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
 (45,4,'en',1,80,'100|72','2015-06-19 15:52:48','2015-06-19 15:52:48'),
 (46,4,'en',1,81,'null','2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (47,4,'en',1,82,'field2_value','2015-06-19 15:52:49','2015-06-19 15:52:49');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (48,4,'en',1,98,'null','2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (49,4,'en',1,99,'null','2015-06-19 15:52:49','2015-06-19 15:52:49'),
 (50,103,'en',1,101,'./SiteEngine/Site/layouts/Sample Layout.html','2015-06-19 16:04:46','2015-06-19 16:04:46'),
 (51,103,'en',1,102,'null','2015-06-19 16:04:46','2015-06-19 16:04:46'),
 (52,84,'en',1,78,'76|77','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (53,84,'en',1,80,'285|128|105|72|','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (54,84,'en',1,81,'{\"layout\":{\"name\":\"mainLayout\",\"id\":127},\"subLayouts\":[]}','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (55,84,'en',1,82,'field2_value323','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (56,84,'en',1,98,'null','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (57,84,'en',1,99,'null','2015-06-19 16:09:18','2015-06-19 16:09:18'),
 (59,75,'en',1,98,'null','2015-06-19 16:10:53','2015-06-19 16:10:53'),
 (60,75,'en',1,99,'null','2015-06-19 16:10:53','2015-06-19 16:10:53');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (62,97,'en',1,80,'79|72','2015-06-19 16:11:26','2015-06-19 16:11:26'),
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
 (85,5,'en',1,81,'null','2015-07-14 09:20:30','2015-07-14 09:20:30');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (86,126,'en',1,78,'76|77','2015-07-14 09:22:01','2015-07-14 09:22:01'),
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
 (98,137,'en',1,80,'null','2015-07-15 12:04:59','2015-07-15 12:04:59');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (99,137,'en',1,81,'null','2015-07-15 12:04:59','2015-07-15 12:04:59'),
 (100,137,'en',1,132,'Organisation','2015-07-15 12:04:59','2015-07-15 12:04:59'),
 (101,137,'en',1,133,'The iWith.org Foundation is a non-profit organisation with an international scope founded in 2001 to participate actively in the development of the most disadvantaged regions and populations, offering active assistance to take advantage of the opportunities offered by the internet and the organisations.  iWith.org is a pioneer in Internet-based training with the Ab-soo “sharing for education” programme which had the participation of organisations from Mexico, Guatemala, Dominican Republic and Ecuador.  Using its own technology, iWith.org has developed Ab-core, a platform of services which are being used by hundreds of organisations to manage their internet projects and online working.','2015-07-15 12:04:59','2015-07-15 12:04:59'),
 (102,137,'en',1,134,'http://www.iwith.org/mm/image/web2013/voluntarios.jpg','2015-07-15 12:04:59','2015-07-15 12:04:59');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (103,145,'en',1,78,'76|77','2015-07-20 12:18:16','2015-07-20 12:18:16'),
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
 (116,73,'en',1,78,'76|77','2015-07-24 16:45:43','2015-07-24 16:45:43');
INSERT INTO `fields` (`Id`,`ItemId`,`Language`,`Version`,`FieldId`,`Value`,`Created`,`Updated`) VALUES 
 (117,73,'en',1,80,'161|75|72','2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (118,73,'en',1,81,'null','2015-07-24 16:45:43','2015-07-24 16:45:43'),
 (240,136,'en',1,78,'76|77','2015-07-29 13:50:19','2015-07-29 13:50:19'),
 (241,135,'en',1,78,'76|77','2015-07-29 13:51:31','2015-07-29 13:51:31'),
 (242,135,'en',1,78,'76|77','2015-07-29 13:51:34','2015-07-29 13:51:34'),
 (243,135,'en',1,78,'76|77','2015-07-29 14:02:05','2015-07-29 14:02:05'),
 (287,324,'en',1,150,'string','2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (288,325,'en',1,150,'string','2015-07-31 16:54:22','2015-07-31 16:54:22');
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
) ENGINE=InnoDB AUTO_INCREMENT=326 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `db_site_engine`.`items`
--

/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (1,'engine',NULL,NULL,0,'2015-05-29 19:29:22','2015-05-29 19:29:22'),
 (2,'content',NULL,NULL,1,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (4,'layout',75,NULL,1,'2015-05-29 19:29:29','2015-05-29 19:29:29'),
 (5,'templates',72,NULL,1,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (70,'System',72,NULL,5,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (71,'Common',NULL,NULL,5,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (72,'Folder',75,NULL,71,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (73,'Templates',72,NULL,70,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (74,'Sections',72,NULL,73,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (75,'Template',75,NULL,73,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (76,'Insert Options',NULL,NULL,74,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (77,'Layout',NULL,NULL,74,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (78,'Base_Template',NULL,NULL,75,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (79,'Standard template',75,NULL,73,'2015-05-29 19:29:30','2015-05-29 19:29:30');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (80,'Insert_Options',NULL,NULL,76,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (81,'Renderings',NULL,NULL,77,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (84,'main',75,NULL,2,'2015-05-29 19:29:30','2015-05-29 19:29:30'),
 (100,'Layout',79,NULL,70,'2015-06-19 15:42:34','2015-06-19 15:42:34'),
 (101,'Path',-1,NULL,100,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (102,'ContentHTML',-1,NULL,100,'2015-06-19 15:42:35','2015-06-19 15:42:35'),
 (103,'Sample layout',100,NULL,4,'2015-06-19 16:04:24','2015-06-19 16:04:24'),
 (114,'UserData',72,NULL,5,'2015-07-14 08:47:00','2015-07-14 08:47:00'),
 (115,'Iwith.org',72,NULL,114,'2015-07-14 08:56:44','2015-07-14 08:56:44'),
 (116,'Article',75,NULL,115,'2015-07-14 08:59:44','2015-07-14 08:59:44'),
 (117,'Header',-1,NULL,116,'2015-07-14 08:59:44','2015-07-14 08:59:44'),
 (118,'Content',-1,NULL,116,'2015-07-14 08:59:45','2015-07-14 08:59:45'),
 (119,'Image',-1,NULL,116,'2015-07-14 08:59:45','2015-07-14 08:59:45'),
 (120,'ImageDescription',-1,NULL,116,'2015-07-14 08:59:45','2015-07-14 08:59:45');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (121,'NewsItem',75,NULL,115,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (122,'Data',-1,NULL,121,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (123,'Header',-1,NULL,121,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (124,'Link',-1,NULL,121,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (125,'ContentShort',-1,NULL,121,'2015-07-14 09:03:10','2015-07-14 09:03:10'),
 (126,'Iwith.org',72,NULL,4,'2015-07-14 09:19:26','2015-07-14 09:19:26'),
 (127,'mainLayout',100,NULL,126,'2015-07-14 09:23:07','2015-07-14 09:23:07'),
 (128,'HeaderMenuItem',75,NULL,115,'2015-07-15 11:59:07','2015-07-15 11:59:07'),
 (129,'Title',-1,NULL,128,'2015-07-15 11:59:07','2015-07-15 11:59:07'),
 (130,'HeaderMenu',72,NULL,115,'2015-07-15 12:00:28','2015-07-15 12:00:28'),
 (131,'OrganizaciónInfo',75,NULL,130,'2015-07-15 12:01:29','2015-07-15 12:01:29'),
 (132,'Title',-1,NULL,131,'2015-07-15 12:01:29','2015-07-15 12:01:29'),
 (133,'Content',-1,NULL,131,'2015-07-15 12:01:29','2015-07-15 12:01:29');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
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
 (146,'InternetConsulting',142,NULL,145,'2015-07-20 12:18:39','2015-07-20 12:18:39'),
 (147,'Working online',142,NULL,145,'2015-07-20 12:19:47','2015-07-20 12:19:47'),
 (148,'Template Field',75,NULL,73,'2015-07-21 13:24:16','2015-07-21 13:24:16');
INSERT INTO `items` (`ID`,`Name`,`TemplateID`,`MasterID`,`ParentID`,`Created`,`Updated`) VALUES 
 (150,'Type',-1,NULL,148,'2015-07-21 13:24:16','2015-07-21 13:24:16'),
 (323,'templ1',75,NULL,73,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (324,'f1',148,NULL,323,'2015-07-31 16:54:22','2015-07-31 16:54:22'),
 (325,'f2',148,NULL,323,'2015-07-31 16:54:22','2015-07-31 16:54:22');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
