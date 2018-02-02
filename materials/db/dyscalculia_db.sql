-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 02, 2018 at 09:33 AM
-- Server version: 10.1.29-MariaDB
-- PHP Version: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dyscalculia_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_account`
--

CREATE TABLE `tbl_account` (
  `account_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_bday` date NOT NULL,
  `account_username` varchar(255) NOT NULL,
  `account_password` varchar(255) NOT NULL,
  `account_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_account`
--

INSERT INTO `tbl_account` (`account_id`, `type_id`, `account_name`, `account_bday`, `account_username`, `account_password`, `account_date`) VALUES
(1, 2, 'John Doe', '2018-01-15', 'jdoe', '$2a$10$G2BPx41cgs.UNv5Y7c2vhenhiaqddZwb8WOqhfaol8hsttRKKj.D6', '2018-01-11'),
(4, 1, 'John Rey Baylen', '1995-07-21', 'jrey', '$2a$10$GSib7MV0TloyMUIVVYJPV.wcDQLGajy23ULqfBqAEDNF7PdGhdogG', '2018-01-15'),
(5, 1, 'Jegger Saren', '1990-06-13', 'jegger06', '$2a$10$G2BPx41cgs.UNv5Y7c2vhenhiaqddZwb8WOqhfaol8hsttRKKj.D6', '2018-01-17'),
(6, 1, 'Dominick Sanchez', '1995-04-16', 'doms', '$2a$10$G2BPx41cgs.UNv5Y7c2vhenhiaqddZwb8WOqhfaol8hsttRKKj.D6', '2018-02-02'),
(7, 2, 'Grace Dumandan', '1997-02-13', 'grace', '$2a$10$G2BPx41cgs.UNv5Y7c2vhenhiaqddZwb8WOqhfaol8hsttRKKj.D6', '2018-02-01'),
(8, 2, 'Jane Smith', '1990-02-12', 'jane', '$2a$10$G2BPx41cgs.UNv5Y7c2vhenhiaqddZwb8WOqhfaol8hsttRKKj.D6', '2018-02-06'),
(9, 2, 'Will Traverse', '1997-02-06', 'will', '$2a$10$G2BPx41cgs.UNv5Y7c2vhenhiaqddZwb8WOqhfaol8hsttRKKj.D6', '2018-02-04');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_answer`
--

CREATE TABLE `tbl_answer` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_choices` text NOT NULL,
  `answer_key` text NOT NULL,
  `answer_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_answer`
--

INSERT INTO `tbl_answer` (`answer_id`, `question_id`, `answer_choices`, `answer_key`, `answer_date`) VALUES
(2, 2, '[9, 11, 10]', '10', '2018-01-26 10:58:41'),
(3, 3, '[4, 3, 10]', '4', '2018-01-26 15:55:24'),
(4, 4, '[15, 5, 10]', '5', '2018-01-26 15:56:25'),
(6, 6, '[69, 3, 9]', '9', '2018-01-29 15:52:51'),
(7, 7, '[8, 44, 0]', '8', '2018-01-29 15:53:42'),
(8, 8, '[1, 3, 2]', '3', '2018-01-29 15:54:13'),
(9, 9, '[17, 7, 125]', '17', '2018-01-29 15:55:24'),
(10, 10, '[5, 7, 6]', '7', '2018-01-29 16:32:46'),
(11, 11, '[30, 20, 10]', '10', '2018-01-29 16:34:49'),
(12, 12, '[25, 35, 20]', '25', '2018-01-29 16:35:25'),
(13, 13, '[6, 4, 7]', '4', '2018-01-29 16:35:48'),
(14, 14, '[13, 5, 3]', '3', '2018-01-29 16:36:27'),
(15, 15, '[36, 20, 21]', '20', '2018-01-29 16:37:27'),
(16, 16, '[4, 0, 2]', '4', '2018-01-29 16:40:49'),
(17, 17, '[8, 15, 2]', '15', '2018-01-29 16:41:40'),
(18, 18, '[3, 4, 2]', '3', '2018-01-29 16:42:20'),
(19, 19, '[26, 10, 39]', '39', '2018-01-29 16:43:00'),
(20, 20, '[35, 2, 21]', '35', '2018-01-29 16:43:37'),
(21, 21, '[2, 24, 10]', '24', '2018-01-29 16:44:07'),
(22, 22, '[2, 30, 40]', '30', '2018-01-30 10:11:43'),
(23, 23, '[100, 90, 56]', '100', '2018-01-30 10:12:34'),
(24, 24, '[219, 199, 209]', '209', '2018-01-30 10:13:33'),
(25, 25, '[20, 120, 130]', '130', '2018-01-30 10:14:10'),
(26, 26, '[320, 620, 520]', '620', '2018-01-30 10:15:21'),
(27, 27, '[290, 280, 300]', '290', '2018-01-30 14:12:58'),
(28, 28, '[248, 238, 228]', '238', '2018-01-30 14:14:47'),
(29, 29, '[302, 102, 292]', '302', '2018-01-30 14:15:54'),
(30, 30, '[522, 501, 511]', '511', '2018-01-30 14:16:32'),
(31, 31, '[400, 500, 450]', '500', '2018-01-30 14:17:53'),
(32, 32, '[855, 755, 835]', '855', '2018-01-30 14:18:34'),
(33, 33, '[10, 22, 18]', '10', '2018-01-30 14:20:50'),
(34, 34, '[2, 20, 1]', '1', '2018-01-30 14:21:52'),
(35, 35, '[70, 6, 50]', '6', '2018-01-30 14:22:23'),
(36, 36, '[183, 177, 60]', '60', '2018-01-30 14:23:15'),
(37, 37, '[570, 3426, 3414]', '570', '2018-01-30 14:24:19');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_chapter`
--

CREATE TABLE `tbl_chapter` (
  `chapter_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `chapter_slog` varchar(255) NOT NULL,
  `chapter_text` varchar(255) NOT NULL,
  `chapter_status` int(11) NOT NULL DEFAULT '0' COMMENT '0 = inactive | 1 = active',
  `chapter_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_chapter`
--

INSERT INTO `tbl_chapter` (`chapter_id`, `account_id`, `chapter_slog`, `chapter_text`, `chapter_status`, `chapter_date`) VALUES
(3, 1, 'sample-chapter', 'Sample Chapter', 0, '2018-01-25'),
(8, 4, 'just-a-notebook', 'Just a Notebook', 1, '2018-01-17'),
(11, 4, 'readers-digest', 'Readers Digest', 0, '2018-01-25');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_difficulty`
--

CREATE TABLE `tbl_difficulty` (
  `difficulty_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `difficulty_slog` varchar(255) NOT NULL,
  `difficulty_text` varchar(255) NOT NULL,
  `difficulty_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_difficulty`
--

INSERT INTO `tbl_difficulty` (`difficulty_id`, `account_id`, `difficulty_slog`, `difficulty_text`, `difficulty_date`) VALUES
(1, 4, 'pre-test', 'Pre test', '2018-01-22'),
(2, 4, 'post-test', 'Post test', '2018-01-22'),
(3, 5, 'activities', 'Activities', '2018-01-22');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_lesson`
--

CREATE TABLE `tbl_lesson` (
  `lesson_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `lesson_title` varchar(255) NOT NULL,
  `lesson_slog` varchar(255) NOT NULL,
  `lesson_content` text NOT NULL,
  `lesson_status` int(11) NOT NULL DEFAULT '0' COMMENT '0 = Inactive | 1 = active',
  `lesson_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_lesson`
--

INSERT INTO `tbl_lesson` (`lesson_id`, `account_id`, `chapter_id`, `lesson_title`, `lesson_slog`, `lesson_content`, `lesson_status`, `lesson_date`) VALUES
(1, 4, 3, 'Basic Arithmetic', 'basic-arithmetic', 'Update The basics...', 0, '2018-01-22'),
(2, 4, 11, 'Sample Lesson Title', 'sample-lesson-title', 'some lesson content goes in here...', 1, '2018-01-22');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_question`
--

CREATE TABLE `tbl_question` (
  `question_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `question_range_id` int(11) NOT NULL DEFAULT '0' COMMENT '0 if the question is for pre-test',
  `question_type_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `difficulty_id` int(11) NOT NULL,
  `question_content` text NOT NULL,
  `question_status` int(11) NOT NULL DEFAULT '0' COMMENT '0 = Inactive | 1 = active	',
  `question_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_question`
--

INSERT INTO `tbl_question` (`question_id`, `lesson_id`, `question_range_id`, `question_type_id`, `account_id`, `difficulty_id`, `question_content`, `question_status`, `question_date`) VALUES
(2, 1, 1, 3, 5, 3, 'Whats the sum of 3 and 7?', 1, '2018-01-26 10:58:41'),
(3, 1, 0, 3, 5, 1, 'Whats the difference of 7 and 3?', 1, '2018-01-26 15:55:24'),
(4, 1, 0, 3, 5, 1, 'Whats the difference of 10 and 5?', 1, '2018-01-26 15:56:25'),
(6, 1, 0, 3, 5, 1, 'Whats the sum of 6 and 3?', 1, '2018-01-29 15:52:51'),
(7, 1, 0, 3, 5, 1, 'Whats the sum of 4 and 4?', 1, '2018-01-29 15:53:42'),
(8, 1, 0, 3, 5, 1, 'Whats the sum of 1 and 2?', 1, '2018-01-29 15:54:13'),
(9, 1, 0, 3, 5, 1, 'Whats the sum of 12 and 5?', 1, '2018-01-29 15:55:23'),
(10, 1, 1, 3, 5, 2, 'How may days are there in a week?', 1, '2018-01-29 16:32:46'),
(11, 1, 1, 3, 5, 2, 'What is the difference between 20 and 10?', 1, '2018-01-29 16:34:49'),
(12, 1, 1, 3, 5, 2, 'What is the difference between 30 and 5?', 1, '2018-01-29 16:35:25'),
(13, 1, 1, 3, 5, 2, 'What is the difference between 5 and 1?', 1, '2018-01-29 16:35:48'),
(14, 1, 1, 3, 5, 2, 'What is the difference between 8 and 5?', 1, '2018-01-29 16:36:27'),
(15, 1, 1, 3, 5, 2, 'What is the difference between 28 and 8?', 1, '2018-01-29 16:37:27'),
(16, 1, 2, 3, 5, 2, 'What is the multiple between 2 and 2?', 1, '2018-01-29 16:40:49'),
(17, 1, 2, 3, 5, 2, 'What is the multiple between 5 and 3?', 1, '2018-01-29 16:41:40'),
(18, 1, 2, 3, 5, 2, 'What is the multiple between 3 and 1?', 1, '2018-01-29 16:42:20'),
(19, 1, 2, 3, 5, 2, 'What is the multiple between 13 and 3?', 1, '2018-01-29 16:43:00'),
(20, 1, 2, 3, 5, 2, 'What is the multiple between 7 and 5?', 1, '2018-01-29 16:43:37'),
(21, 1, 2, 3, 5, 2, 'What is the multiple between 6 and 4?', 1, '2018-01-29 16:44:07'),
(22, 1, 3, 3, 5, 2, 'What is the sum of 16 and 14?', 1, '2018-01-30 10:11:43'),
(23, 1, 3, 3, 5, 2, 'What is the sum of 78 and 22?', 1, '2018-01-30 10:12:34'),
(24, 1, 3, 3, 5, 2, 'What is the sum of 59 and 150?', 1, '2018-01-30 10:13:33'),
(25, 1, 3, 3, 5, 2, 'What is the sum of 70 and 50?', 1, '2018-01-30 10:14:10'),
(26, 1, 3, 3, 5, 2, 'What is the sum of 470 and 150?', 1, '2018-01-30 10:15:21'),
(27, 1, 3, 3, 5, 2, 'What is the sum of 234 and 56?', 1, '2018-01-30 14:12:58'),
(28, 1, 4, 3, 5, 2, 'What is the difference between 294 and 56?', 1, '2018-01-30 14:14:47'),
(29, 1, 4, 3, 5, 2, 'What is the difference between 537 and 235?', 1, '2018-01-30 14:15:54'),
(30, 1, 4, 3, 5, 2, 'What is the difference between 863 and 352?', 1, '2018-01-30 14:16:32'),
(31, 1, 4, 3, 5, 2, 'What is the difference between 734 and 234?', 1, '2018-01-30 14:17:53'),
(32, 1, 4, 3, 5, 2, 'What is the difference between 978 and 123?', 1, '2018-01-30 14:18:34'),
(33, 1, 5, 3, 5, 2, 'What is 20 divided by 2?', 1, '2018-01-30 14:20:50'),
(34, 1, 5, 3, 5, 2, 'What is 10 divided by 10?', 1, '2018-01-30 14:21:52'),
(35, 1, 5, 3, 5, 2, 'What is 60 divided by 10?', 1, '2018-01-30 14:22:23'),
(36, 1, 5, 3, 5, 2, 'What is 180 divided by 3?', 1, '2018-01-30 14:23:15'),
(37, 1, 5, 3, 5, 2, 'What is 3420 divided by 6?', 1, '2018-01-30 14:24:19');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_question_range`
--

CREATE TABLE `tbl_question_range` (
  `question_range_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `question_range_slog` varchar(255) NOT NULL,
  `question_range_from` decimal(11,0) NOT NULL,
  `question_range_to` decimal(11,0) NOT NULL,
  `question_range_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_question_range`
--

INSERT INTO `tbl_question_range` (`question_range_id`, `account_id`, `question_range_slog`, `question_range_from`, `question_range_to`, `question_range_date`) VALUES
(0, 5, '0', '0', '0', '2018-01-25 15:17:31'),
(1, 1, '0-20', '0', '20', '2018-01-24 12:53:15'),
(2, 5, '21-40', '21', '40', '2018-01-24 13:33:26'),
(3, 5, '41-60', '41', '60', '2018-01-24 13:34:19'),
(4, 5, '61-80', '61', '80', '2018-01-24 15:39:29'),
(5, 5, '81-100', '81', '100', '2018-01-25 15:17:31'),
(6, 5, 'sample-range1', '0', '0', '2018-01-29 14:28:24');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_question_type`
--

CREATE TABLE `tbl_question_type` (
  `question_type_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `question_type_slog` varchar(255) NOT NULL,
  `question_type_text` varchar(255) NOT NULL,
  `question_type_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_question_type`
--

INSERT INTO `tbl_question_type` (`question_type_id`, `account_id`, `question_type_slog`, `question_type_text`, `question_type_date`) VALUES
(1, 5, 'identification', 'Identification', '2018-01-24 14:13:56'),
(3, 5, 'multiple-choice', 'Multiple Choice', '2018-01-24 14:35:58'),
(5, 5, 'drag-and-drop1', 'Drag and Drop', '2018-01-24 14:43:02'),
(6, 5, 'true-or-false', 'true or false', '2018-01-25 09:26:22');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_score`
--

CREATE TABLE `tbl_score` (
  `score_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `difficulty_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `score_count` decimal(3,0) NOT NULL,
  `score_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_score`
--

INSERT INTO `tbl_score` (`score_id`, `lesson_id`, `difficulty_id`, `account_id`, `score_count`, `score_date`) VALUES
(1, 1, 2, 1, '55', '2018-01-30 15:10:09'),
(2, 1, 1, 5, '100', '2018-02-02 09:50:06'),
(3, 1, 1, 4, '95', '2018-02-02 09:50:06'),
(4, 1, 1, 7, '75', '2018-02-02 10:17:54'),
(5, 1, 1, 6, '97', '2018-02-02 10:17:54'),
(6, 1, 2, 6, '78', '2018-02-02 10:18:35'),
(7, 1, 1, 8, '70', '2018-02-02 10:18:35'),
(8, 1, 2, 9, '89', '2018-02-02 10:19:33'),
(9, 1, 2, 8, '95', '2018-02-02 10:19:33'),
(10, 1, 2, 8, '90', '2018-02-02 16:02:56'),
(11, 1, 3, 9, '98', '2018-02-02 16:04:06'),
(12, 1, 2, 6, '85', '2018-02-02 16:04:44'),
(13, 1, 2, 6, '85', '2018-02-02 16:05:09');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_type`
--

CREATE TABLE `tbl_type` (
  `type_id` int(11) NOT NULL,
  `type_slog` varchar(255) NOT NULL,
  `type_description` varchar(255) NOT NULL,
  `type_status` int(11) NOT NULL DEFAULT '0' COMMENT '0 = inactive | 1 = active	',
  `type_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_type`
--

INSERT INTO `tbl_type` (`type_id`, `type_slog`, `type_description`, `type_status`, `type_date`) VALUES
(1, 'admin', 'Admin', 1, '2018-01-11 14:10:17'),
(2, 'user', 'User', 1, '2018-01-11 14:10:17'),
(4, 'author', 'Author', 0, '2018-01-23 14:18:15'),
(5, 'moderator', 'Moderator', 0, '2018-01-23 15:55:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_account`
--
ALTER TABLE `tbl_account`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `tbl_answer`
--
ALTER TABLE `tbl_answer`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `tbl_chapter`
--
ALTER TABLE `tbl_chapter`
  ADD PRIMARY KEY (`chapter_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `tbl_difficulty`
--
ALTER TABLE `tbl_difficulty`
  ADD PRIMARY KEY (`difficulty_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `tbl_lesson`
--
ALTER TABLE `tbl_lesson`
  ADD PRIMARY KEY (`lesson_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `tbl_question`
--
ALTER TABLE `tbl_question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `lesson_id` (`lesson_id`),
  ADD KEY `difficulty_id` (`difficulty_id`),
  ADD KEY `question_range_id` (`question_range_id`),
  ADD KEY `tbl_question_ibfk_4` (`question_type_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `tbl_question_range`
--
ALTER TABLE `tbl_question_range`
  ADD PRIMARY KEY (`question_range_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `tbl_question_type`
--
ALTER TABLE `tbl_question_type`
  ADD PRIMARY KEY (`question_type_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `tbl_score`
--
ALTER TABLE `tbl_score`
  ADD PRIMARY KEY (`score_id`),
  ADD KEY `difficulty_id` (`difficulty_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `tbl_type`
--
ALTER TABLE `tbl_type`
  ADD PRIMARY KEY (`type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_account`
--
ALTER TABLE `tbl_account`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_answer`
--
ALTER TABLE `tbl_answer`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tbl_chapter`
--
ALTER TABLE `tbl_chapter`
  MODIFY `chapter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_difficulty`
--
ALTER TABLE `tbl_difficulty`
  MODIFY `difficulty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_lesson`
--
ALTER TABLE `tbl_lesson`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_question`
--
ALTER TABLE `tbl_question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tbl_question_range`
--
ALTER TABLE `tbl_question_range`
  MODIFY `question_range_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_question_type`
--
ALTER TABLE `tbl_question_type`
  MODIFY `question_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_score`
--
ALTER TABLE `tbl_score`
  MODIFY `score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_type`
--
ALTER TABLE `tbl_type`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_account`
--
ALTER TABLE `tbl_account`
  ADD CONSTRAINT `tbl_account_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `tbl_type` (`type_id`) ON UPDATE NO ACTION;

--
-- Constraints for table `tbl_answer`
--
ALTER TABLE `tbl_answer`
  ADD CONSTRAINT `tbl_answer_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `tbl_question` (`question_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `tbl_chapter`
--
ALTER TABLE `tbl_chapter`
  ADD CONSTRAINT `tbl_chapter_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `tbl_account` (`account_id`) ON UPDATE NO ACTION;

--
-- Constraints for table `tbl_difficulty`
--
ALTER TABLE `tbl_difficulty`
  ADD CONSTRAINT `tbl_difficulty_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `tbl_account` (`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tbl_lesson`
--
ALTER TABLE `tbl_lesson`
  ADD CONSTRAINT `tbl_lesson_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `tbl_account` (`account_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `tbl_lesson_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `tbl_chapter` (`chapter_id`) ON UPDATE NO ACTION;

--
-- Constraints for table `tbl_question`
--
ALTER TABLE `tbl_question`
  ADD CONSTRAINT `tbl_question_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `tbl_lesson` (`lesson_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `tbl_question_ibfk_2` FOREIGN KEY (`difficulty_id`) REFERENCES `tbl_difficulty` (`difficulty_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `tbl_question_ibfk_4` FOREIGN KEY (`question_type_id`) REFERENCES `tbl_question_type` (`question_type_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `tbl_question_ibfk_5` FOREIGN KEY (`question_range_id`) REFERENCES `tbl_question_range` (`question_range_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `tbl_question_ibfk_6` FOREIGN KEY (`account_id`) REFERENCES `tbl_account` (`account_id`) ON UPDATE NO ACTION;

--
-- Constraints for table `tbl_question_range`
--
ALTER TABLE `tbl_question_range`
  ADD CONSTRAINT `tbl_question_range_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `tbl_account` (`account_id`) ON UPDATE NO ACTION;

--
-- Constraints for table `tbl_question_type`
--
ALTER TABLE `tbl_question_type`
  ADD CONSTRAINT `tbl_question_type_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `tbl_account` (`account_id`);

--
-- Constraints for table `tbl_score`
--
ALTER TABLE `tbl_score`
  ADD CONSTRAINT `tbl_score_ibfk_1` FOREIGN KEY (`difficulty_id`) REFERENCES `tbl_difficulty` (`difficulty_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `tbl_score_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `tbl_account` (`account_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `tbl_score_ibfk_3` FOREIGN KEY (`lesson_id`) REFERENCES `tbl_lesson` (`lesson_id`) ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
