-- SlotShare Database Schema
-- MySQL Database for User Management

-- Create database
CREATE DATABASE IF NOT EXISTS slotshare_db;
USE slotshare_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    license_plate VARCHAR(20),
    vehicle_model VARCHAR(100),
    vehicle_color VARCHAR(50),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- Parking listings table
CREATE TABLE IF NOT EXISTS listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    total_slots INT NOT NULL,
    available_slots INT NOT NULL,
    status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending',
    amenities JSON,
    rules TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_user_id (user_id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    user_id INT NOT NULL,
    renter_name VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_hours INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_listing_id (listing_id),
    INDEX idx_status (status),
    INDEX idx_date (booking_date)
);

-- Admin audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type ENUM('user', 'listing', 'booking') NOT NULL,
    target_id INT NOT NULL,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Admin user created by application code with proper bcrypt hash
-- See: server/config/database.js createDefaultAdmin()

-- Insert sample listings
INSERT INTO listings (user_id, name, address, description, price_per_hour, total_slots, available_slots, status, amenities, rules)
VALUES
    (2, 'IT Park Lot A', 'Cebu IT Park, Apas', 'Secure parking lot near IT Park', 50.00, 8, 5, 'active', '{"cctv": true, "covered": false, "security": true}', 'No overnight parking'),
    (2, 'Capitol Site Garage', 'Capitol Site, Cebu City', 'Covered garage parking', 40.00, 12, 0, 'inactive', '{"covered": true, "lighting": true}', 'Max height 2.1m')
ON DUPLICATE KEY UPDATE name = name;

-- Insert sample bookings
INSERT INTO bookings (listing_id, user_id, renter_name, booking_date, start_time, duration_hours, amount, status)
VALUES
    (1, 1, 'Juan Dela Cruz', '2026-05-15', '09:00:00', 4, 200.00, 'confirmed'),
    (1, 1, 'Juan Dela Cruz', '2026-05-16', '14:00:00', 2, 100.00, 'pending')
ON DUPLICATE KEY UPDATE renter_name = renter_name;