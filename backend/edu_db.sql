-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 08, 2026 at 11:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `edu_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `edu_type`
--

CREATE TABLE `edu_type` (
  `id` int(11) NOT NULL,
  `type_name` varchar(50) NOT NULL,
  `is_active` int(1) NOT NULL DEFAULT 0 COMMENT '1= active, 0=inactive',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `edu_type`
--

INSERT INTO `edu_type` (`id`, `type_name`, `is_active`, `created_at`) VALUES
(1, 'Schools', 0, '2026-02-08 20:50:57'),
(2, 'Institutes', 0, '2026-02-08 20:50:57'),
(3, 'Coaching', 1, '2026-02-08 20:50:57'),
(4, 'Tuition', 0, '2026-02-08 20:50:57');

-- --------------------------------------------------------

--
-- Table structure for table `organization_details`
--

CREATE TABLE `organization_details` (
  `id` char(36) NOT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `user_id` char(36) NOT NULL,
  `edu_type_id` int(11) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `subscription_id` int(11) DEFAULT 5,
  `status` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `role_code` varchar(50) NOT NULL,
  `is_system_role` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `role_code`, `is_system_role`, `created_at`) VALUES
(1, 'Super Admin', 'SUPER_ADMIN', 1, '2026-02-08 20:50:57'),
(2, 'School Admin', 'SCHOOL_ADMIN', 1, '2026-02-08 20:50:57'),
(3, 'Teacher', 'TEACHER', 1, '2026-02-08 20:50:57'),
(4, 'Admission Incharge', 'ADMISSION', 1, '2026-02-08 20:50:57'),
(5, 'Operator', 'OPERATOR', 1, '2026-02-08 20:50:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `profilePic` varchar(255) DEFAULT NULL,
  `edu_type_id` int(11) NOT NULL,
  `status` enum('active','inactive','suspended','blocked') DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role_id`, `profilePic`, `edu_type_id`, `status`, `last_login`, `created_at`, `updated_at`) VALUES
('ce0f6159-cf01-4540-ae11-0bf10aa987c7', 'Super Admin', 'superadmin@edu.com', '$2b$10$Lmnp61kQ5j79RwWBa709Te9KF8YrjwHaNqF9F98u84UZtR8YMYf86', NULL, 1, NULL, 0, 'active', NULL, '2026-02-08 15:20:57', '2026-02-08 20:50:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `edu_type`
--
ALTER TABLE `edu_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `organization_details`
--
ALTER TABLE `organization_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `edu_type_id` (`edu_type_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_code` (`role_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `edu_type`
--
ALTER TABLE `edu_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `organization_details`
--
ALTER TABLE `organization_details`
  ADD CONSTRAINT `organization_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `organization_details_ibfk_2` FOREIGN KEY (`edu_type_id`) REFERENCES `edu_type` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
