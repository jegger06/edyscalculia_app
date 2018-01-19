-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2018 at 09:25 AM
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
(1, 1, 'John Doe', '2018-01-15', 'jdoe', 'bcrypt datap', '2018-01-11'),
(2, 2, 'Jane Smith', '2018-01-01', 'jane', 'bcrypt', '2018-01-02'),
(4, 1, 'John Rey Baylen', '1995-07-21', 'jrey', '$2a$10$GSib7MV0TloyMUIVVYJPV.wcDQLGajy23ULqfBqAEDNF7PdGhdogG', '2018-01-15'),
(5, 1, 'Jegger Saren', '1990-06-13', 'jegger06', '$2a$10$1CG80rL//nXwNGFDhM9G6.B4D1kTrbI288E56KBCCYNkYkquXaw/6', '2018-01-17');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_answer`
--

CREATE TABLE `tbl_answer` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_slog` varchar(255) NOT NULL,
  `answer_choices` text NOT NULL,
  `answer_key` text NOT NULL,
  `answer_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(3, 1, 'the-awesome-chapter1', 'some title here', 1, '2018-01-17'),
(6, 1, 'sample-chapter', 'sample chapter', 1, '2018-01-16'),
(8, 4, 'just-a-notebook', 'Just a Notebook', 1, '2018-01-17'),
(11, 4, 'readers-digest', 'Readers Digest', 0, '2018-01-17'),
(12, 4, 'readers-digest1', 'Readers Digest', 0, '2018-01-18');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_difficulty`
--

CREATE TABLE `tbl_difficulty` (
  `difficulty_id` int(11) NOT NULL,
  `difficulty_slog` varchar(255) NOT NULL,
  `difficulty_text` varchar(255) NOT NULL,
  `difficulty_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

-- --------------------------------------------------------

--
-- Table structure for table `tbl_question`
--

CREATE TABLE `tbl_question` (
  `question_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `difficulty_id` int(11) NOT NULL,
  `question_content` text NOT NULL,
  `question_status` int(11) NOT NULL DEFAULT '0' COMMENT '0 = Inactive | 1 = active	',
  `question_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_type`
--

CREATE TABLE `tbl_type` (
  `type_id` int(11) NOT NULL,
  `type_slog` varchar(255) NOT NULL,
  `type_description` varchar(255) NOT NULL,
  `type_active` int(11) NOT NULL,
  `type_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_type`
--

INSERT INTO `tbl_type` (`type_id`, `type_slog`, `type_description`, `type_active`, `type_date`) VALUES
(1, 'admin', 'Admin', 1, '2018-01-11 14:10:17'),
(2, 'user', 'User', 1, '2018-01-11 14:10:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_account`
--
ALTER TABLE `tbl_account`
  ADD PRIMARY KEY (`account_id`);

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
  ADD PRIMARY KEY (`chapter_id`);

--
-- Indexes for table `tbl_difficulty`
--
ALTER TABLE `tbl_difficulty`
  ADD PRIMARY KEY (`difficulty_id`);

--
-- Indexes for table `tbl_lesson`
--
ALTER TABLE `tbl_lesson`
  ADD PRIMARY KEY (`lesson_id`);

--
-- Indexes for table `tbl_question`
--
ALTER TABLE `tbl_question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `lesson_id` (`lesson_id`),
  ADD KEY `difficulty_id` (`difficulty_id`);

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
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_answer`
--
ALTER TABLE `tbl_answer`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_chapter`
--
ALTER TABLE `tbl_chapter`
  MODIFY `chapter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_difficulty`
--
ALTER TABLE `tbl_difficulty`
  MODIFY `difficulty_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_lesson`
--
ALTER TABLE `tbl_lesson`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_question`
--
ALTER TABLE `tbl_question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_type`
--
ALTER TABLE `tbl_type`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_answer`
--
ALTER TABLE `tbl_answer`
  ADD CONSTRAINT `tbl_answer_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `tbl_question` (`question_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `tbl_question`
--
ALTER TABLE `tbl_question`
  ADD CONSTRAINT `tbl_question_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `tbl_lesson` (`lesson_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `tbl_question_ibfk_2` FOREIGN KEY (`difficulty_id`) REFERENCES `tbl_difficulty` (`difficulty_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
