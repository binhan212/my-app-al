-- Migration to restructure settings table
-- Backup old data first
CREATE TABLE IF NOT EXISTS settings_backup AS SELECT * FROM settings;

-- Drop old settings table
DROP TABLE IF EXISTS settings;

-- Create new settings table with fixed fields
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL DEFAULT 'Cổng Thông Tin Quy Hoạch Quốc Gia',
  site_logo VARCHAR(500),
  site_favicon VARCHAR(500),
  footer_about TEXT,
  contact_email VARCHAR(100),
  contact_phone VARCHAR(50),
  contact_address VARCHAR(255),
  facebook_url VARCHAR(255),
  youtube_url VARCHAR(255),
  footer_copyright VARCHAR(255),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default record
INSERT INTO settings (
  site_name,
  footer_about,
  contact_email,
  contact_phone,
  footer_copyright
) VALUES (
  'Phường Âu Lâu - Tỉnh Lào Cai',
  'Cổng thông tin, kế hoạch và đầu tư phường Âu Lâu, tỉnh Lào Cai',
  'info@domain.example',
  '(84) 24 1234 5678',
  'Phường Âu Lâu'
);
