SET foreign_key_checks = 0;
DROP TABLE IF EXISTS `attractions`;
CREATE TABLE `attractions` (
  `attraction_id` int NOT NULL AUTO_INCREMENT,
  `place_id` int NOT NULL,
  `name` char(16) NOT NULL,
  `description` varchar(100) NOT NULL DEFAULT '',
  `imageSrc` char(26) DEFAULT NULL,
  `imageCopyright` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`attraction_id`),
  KEY `place_id` (`place_id`),
  CONSTRAINT `attractions_ibfk_1` FOREIGN KEY (`place_id`) REFERENCES `places` (`place_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `attractions` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `places`;
CREATE TABLE `places` (
  `place_id` int NOT NULL AUTO_INCREMENT,
  `name` char(16) NOT NULL,
  `description` varchar(100) NOT NULL DEFAULT '',
  `imageSrc` char(26) DEFAULT NULL,
  `imageCopyright` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`place_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


LOCK TABLES `places` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `schedule_events`;
CREATE TABLE `schedule_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schedule_id` int NOT NULL,
  `attraction_id` int NOT NULL,
  `start_time` bigint NOT NULL,
  `end_time` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  KEY `attraction_id` (`attraction_id`),
  CONSTRAINT `schedule_events_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`),
  CONSTRAINT `schedule_events_ibfk_2` FOREIGN KEY (`attraction_id`) REFERENCES `attractions` (`attraction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `schedule_events` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `schedules`;
CREATE TABLE `schedules` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(30),
  PRIMARY KEY (`schedule_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `schedules` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(16) NOT NULL,
  `password` binary(60) NOT NULL,
  `name` char(16) NOT NULL,
  `authority_level` tinyint unsigned NOT NULL DEFAULT '1',
  `user_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `nickname` (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES ('root',_binary '$2b$10$P.oH.j0fy16XmMBVNvMa2eBVNCNigsYh9BGbT7HUps5ckl.SQtUHO','GM',9,1),('test3',_binary '$2b$10$QwrtGr60wZV0xb3ryqMac.XJdE32IeqaDBzgtJYziyvCu7XHxi6.y','TEST_3',1,2);
UNLOCK TABLES;
SET foreign_key_checks = 1;