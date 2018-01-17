-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 17, 2018 at 09:14 AM
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
(11, 4, 'readers-digest', 'Readers Digest', 0, '2018-01-17');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_lesson`
--

CREATE TABLE `tbl_lesson` (
  `lesson_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `lesson _title` varchar(255) NOT NULL,
  `lesson_slog` varchar(255) NOT NULL,
  `lesson_content` text NOT NULL,
  `lesson_status` int(11) NOT NULL DEFAULT '0' COMMENT '0 = Inactive | 1 = active',
  `lesson_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_lesson`
--

INSERT INTO `tbl_lesson` (`lesson_id`, `account_id`, `chapter_id`, `lesson _title`, `lesson_slog`, `lesson_content`, `lesson_status`, `lesson_date`) VALUES
(1, 1, 3, 'The Basic Arithmetic', 'the-basic-arithmetic', '<p>Take a look at this image and see how its done.</p><p><img src=\"http://localhost:7000/uploads/e9baa18603ca7d93e65078dffa870ada6efd4711.gif\" style=\"width: 300px;\" class=\"fr-fic fr-dib fr-draggable\">Watch the Video Tutorial to learn more about basic arithmetic</p><p><br></p><p><span contenteditable=\"false\" draggable=\"true\" class=\"fr-video fr-dvb fr-draggable\"><video src=\"http://localhost:7000/uploads/7b4cee345c75b91a991b472feefa69c6d5b19c93.mp4\" style=\"width: 600px;\" controls=\"\" class=\"fr-draggable\">Your browser does not support HTML5 video.</video></span></p><p>Now, that is how its done.</p>', 0, '2018-01-17'),
(2, 1, 3, 'Dofus', 'dofus', 'Dofusssssssssssssss', 0, '2018-01-17');

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
-- Indexes for table `tbl_chapter`
--
ALTER TABLE `tbl_chapter`
  ADD PRIMARY KEY (`chapter_id`);

--
-- Indexes for table `tbl_lesson`
--
ALTER TABLE `tbl_lesson`
  ADD PRIMARY KEY (`lesson_id`);

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
-- AUTO_INCREMENT for table `tbl_chapter`
--
ALTER TABLE `tbl_chapter`
  MODIFY `chapter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_lesson`
--
ALTER TABLE `tbl_lesson`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_type`
--
ALTER TABLE `tbl_type`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
