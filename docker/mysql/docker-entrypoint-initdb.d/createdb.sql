CREATE DATABASE IF NOT EXISTS `db_name` COLLATE 'utf8_general_ci';
GRANT ALL ON `db_name`.* TO 'mysql'@'%';

FLUSH PRIVILEGES;