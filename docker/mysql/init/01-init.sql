-- Initial MySQL Setup Script
-- This file runs automatically when MySQL container is first created

-- Set character set and collation
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Grant privileges to application user
GRANT ALL PRIVILEGES ON *.* TO 'cms_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Optional: Create initial admin user (password: admin123)
-- This will be created by Prisma migrations, just a placeholder
