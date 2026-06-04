-- Database schema for the "rit" project
-- MySQL / MariaDB compatible

CREATE DATABASE IF NOT EXISTS rit;
USE rit;

CREATE TABLE IF NOT EXISTS bookings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    service VARCHAR(120) NOT NULL,
    address VARCHAR(255) NOT NULL,
    message TEXT,
    status ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
