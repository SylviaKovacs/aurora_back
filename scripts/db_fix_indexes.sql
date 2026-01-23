-- Drop duplicate indexes on Users, keep only PRIMARY, email, providerId
SET @sql = (
  SELECT GROUP_CONCAT(CONCAT('DROP INDEX `', index_name, '`') SEPARATOR ', ')
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'Users'
    AND index_name NOT IN ('PRIMARY', 'email', 'providerId')
);

SET @sql = IF(@sql IS NULL OR @sql = '', 'SELECT 1', CONCAT('ALTER TABLE `Users` ', @sql));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
