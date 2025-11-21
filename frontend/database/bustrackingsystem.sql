-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 21, 2025 lúc 08:50 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `bustrackingsystem`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ctlichtrinh`
--

CREATE TABLE `ctlichtrinh` (
  `malt` int(50) NOT NULL,
  `mahs` int(50) NOT NULL,
  `trangthai` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ctlichtrinh`
--

INSERT INTO `ctlichtrinh` (`malt`, `mahs`, `trangthai`) VALUES
(5, 4, 1),
(5, 5, 1),
(6, 1, 1),
(6, 2, 1),
(9, 1, 1),
(12, 1, 1),
(13, 1, 1),
(14, 1, 1),
(15, 1, 1),
(16, 2, 1),
(17, 1, 1),
(18, 2, 1),
(19, 1, 1),
(8, 1, 1),
(8, 2, 1),
(7, 2, 1),
(7, 3, 1),
(7, 4, 1),
(7, 5, 0),
(7, 6, 1),
(7, 7, 1),
(7, 8, 0),
(7, 9, 1),
(7, 10, 1),
(7, 11, 0),
(7, 12, 1),
(7, 13, 1),
(7, 14, 1),
(7, 15, 1),
(7, 20, 1),
(4, 1, 1),
(4, 2, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ctquyen`
--

CREATE TABLE `ctquyen` (
  `manq` int(50) NOT NULL,
  `macn` int(50) NOT NULL,
  `hanhdong` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cttuyenduong`
--

CREATE TABLE `cttuyenduong` (
  `matd` int(50) NOT NULL,
  `madd` int(50) NOT NULL,
  `thutu` int(11) NOT NULL,
  `trangthai` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cttuyenduong`
--

INSERT INTO `cttuyenduong` (`matd`, `madd`, `thutu`, `trangthai`) VALUES
(2, 4, 1, 1),
(2, 11, 2, 1),
(2, 9, 3, 0),
(2, 8, 4, 0),
(3, 11, 1, 0),
(3, 10, 2, 0),
(3, 12, 3, 0),
(3, 7, 4, 0),
(3, 11, 1, 0),
(3, 10, 2, 0),
(3, 7, 3, 0),
(9, 2, 1, 0),
(9, 4, 2, 0),
(10, 1, 1, 0),
(10, 2, 2, 0),
(11, 1, 1, 0),
(11, 2, 2, 0),
(4, 1, 1, 0),
(4, 2, 2, 0),
(4, 3, 3, 0),
(1, 1, 1, 1),
(1, 2, 2, 1),
(1, 3, 3, 1),
(1, 5, 4, 0),
(7, 1, 1, 0),
(7, 2, 2, 0),
(7, 3, 3, 0),
(12, 1, 1, 0),
(12, 2, 2, 0),
(13, 1, 1, 0),
(13, 2, 2, 0),
(14, 2, 1, 0),
(14, 1, 2, 0),
(15, 2, 1, 0),
(15, 4, 2, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhmucchucnang`
--

CREATE TABLE `danhmucchucnang` (
  `macn` int(50) NOT NULL,
  `tenchucnang` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `diemdung`
--

CREATE TABLE `diemdung` (
  `madd` int(50) NOT NULL,
  `tendiemdung` varchar(255) NOT NULL,
  `vido` decimal(9,6) NOT NULL,
  `kinhdo` decimal(9,6) NOT NULL,
  `diachi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `diemdung`
--

INSERT INTO `diemdung` (`madd`, `tendiemdung`, `vido`, `kinhdo`, `diachi`) VALUES
(1, 'Bến xe Tiến Trungg', 10.823100, 106.629700, '1 Phạm Ngũ Lão, Quận 1, TP.HCM'),
(2, 'Chợ Tân Địnhh', 10.789000, 106.685000, '120 Hai Bà Trưng, Quận 1, TP.HCM'),
(3, 'Công viên Tao Đàn', 10.776900, 106.690900, 'Trương Định, Quận 1, TP.HCM'),
(4, 'Sân bay Tân Sơn Nhất', 10.818700, 106.651900, 'Trường Sơn, Tân Bình, TP.HCM'),
(5, 'Nhà thờ Đức Bà', 10.779800, 106.699000, '01 Công xã Paris, Quận 1, TP.HCM'),
(6, 'Cầu Sài Gòn', 10.762400, 106.683200, 'Võ Văn Kiệt, Quận 1, TP.HCM'),
(7, 'TTTM Crescent Mall', 10.729200, 106.719700, '101 Tôn Dật Tiên, Quận 7, TP.HCM'),
(8, 'ĐH Quốc gia TP.HCM', 10.870000, 106.803000, 'Linh Trung, Thủ Đức, TP.HCM'),
(9, 'Chợ Thủ Đức', 10.850600, 106.771700, 'Võ Văn Ngân, Thủ Đức, TP.HCM'),
(10, 'Bệnh viện Chợ Rẫy', 10.755400, 106.666500, '201B Nguyễn Chí Thanh, Quận 5, TP.HCM'),
(11, 'Chợ Gò Vấp', 10.814200, 106.643800, 'Quang Trung, Gò Vấp, TP.HCM'),
(12, 'Đầm Sen', 10.788900, 106.654200, 'Hòa Bình, Quận 11, TP.HCM'),
(13, 'Đại học Sài Gòn', 10.760193, 106.682161, '273 An Dương Vương, phường 2, Quận 5'),
(14, 'Đại học Sài Gòn', 10.760192, 106.682161, '273 Hùng vươnggg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hocsinh`
--

CREATE TABLE `hocsinh` (
  `mahs` int(50) NOT NULL,
  `hoten` varchar(255) NOT NULL,
  `ngaysinh` date NOT NULL,
  `gioitinh` tinyint(4) NOT NULL,
  `lop` varchar(50) NOT NULL,
  `diachi` varchar(255) NOT NULL,
  `sdt` varchar(50) NOT NULL,
  `maph` int(50) NOT NULL,
  `diemdon` int(50) NOT NULL,
  `diemdung` int(50) NOT NULL,
  `trangthai` tinyint(4) NOT NULL COMMENT '1 là đi học, 0 là nghỉ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hocsinh`
--

INSERT INTO `hocsinh` (`mahs`, `hoten`, `ngaysinh`, `gioitinh`, `lop`, `diachi`, `sdt`, `maph`, `diemdon`, `diemdung`, `trangthai`) VALUES
(1, 'Nguyễn Tiến Trung', '2005-11-08', 1, '1', '99 An Dương Vương, Phường 16, Quận 8', '0923456789', 1, 1, 1, 1),
(2, 'Lê Đình Luyện', '2005-01-30', 0, '11', '31 Bạch Đằng, Q.10, TP.HCM', '0934567890	', 2, 8, 8, 1),
(3, 'Nguyễn Văn An', '2005-03-15', 1, '10', '123 Trần Hưng Đạo, Q.1, TP.HCM', '0901234567', 1, 5, 8, 1),
(4, 'Trần Thị Bích', '2005-07-22', 0, '10', '456 Lê Lợi, Q.3, TP.HCM', '0912345678', 2, 6, 9, 1),
(5, 'Lê Hoàng Nam', '2005-11-08', 1, '10', '789 Nguyễn Huệ, Q.1, TP.HCM', '0923456789', 3, 7, 10, 0),
(6, 'Phạm Minh Châu', '2005-01-30', 0, '11', '321 Cách Mạng Tháng 8, Q.10, TP.HCM', '0934567890', 4, 8, 10, 1),
(7, 'Hoàng Đức Bình', '2004-09-14', 1, '11', '654 Phan Đình Phùng, Q.Phú Nhuận, TP.HCM', '0945678901', 5, 9, 10, 1),
(8, 'Vũ Thị Diễm My', '2004-12-25', 0, '11', '987 Nguyễn Trãi, Q.5, TP.HCM', '0956789012', 6, 10, 10, 0),
(9, 'Đặng Quốc Huy', '2004-04-18', 1, '12', '147 Lý Thường Kiệt, Q.11, TP.HCM', '0967890123', 7, 10, 10, 1),
(10, 'Bùi Ngọc Trâm', '2004-06-09', 0, '12', '258 Võ Văn Tần, Q.3, TP.HCM', '0978901234', 8, 10, 10, 1),
(11, 'Ngô Thanh Tùng', '2003-08-11', 1, '12', '369 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM', '0989012345', 9, 10, 10, 0),
(12, 'Dương Mai Linh', '2003-02-28', 0, '12', '741 Hai Bà Trưng, Q.1, TP.HCM', '0990123456', 10, 10, 10, 1),
(13, 'a', '2025-11-03', 1, '1', 'a', '0352447642', 6, 12, 12, 1),
(14, 'test2', '2025-11-04', 1, '1', '123', '0352447642', 8, 10, 10, 1),
(15, 'test3', '2025-11-04', 1, '1', '123', '0352447642', 7, 8, 8, 1),
(20, 'Nguyễn Tiến Trung', '2025-11-04', 1, '1', 'aaa', '0352447642', 7, 7, 7, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichtrinh`
--

CREATE TABLE `lichtrinh` (
  `malt` int(50) NOT NULL,
  `matx` int(50) NOT NULL,
  `matd` int(50) NOT NULL,
  `maxe` int(50) NOT NULL,
  `thoigianbatdau` timestamp NULL DEFAULT NULL,
  `thoigianketthuc` timestamp NULL DEFAULT NULL,
  `tonghocsinh` int(11) NOT NULL,
  `trangthai` tinyint(4) NOT NULL COMMENT '0 là bỏ, 1 là đã lên lịch, 2 đã hoàn thành'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lichtrinh`
--

INSERT INTO `lichtrinh` (`malt`, `matx`, `matd`, `maxe`, `thoigianbatdau`, `thoigianketthuc`, `tonghocsinh`, `trangthai`) VALUES
(4, 8, 1, 2, '2025-11-10 16:30:00', '2025-11-10 17:15:00', 2, 2),
(5, 9, 2, 3, '2025-11-11 00:00:00', '2025-11-11 00:50:00', 2, 2),
(6, 4, 1, 1, '2025-11-19 04:10:00', '2025-11-19 06:12:00', 2, 1),
(7, 4, 2, 1, '2025-11-18 21:15:00', '2025-11-18 23:15:00', 15, 1),
(8, 9, 1, 1, '2025-11-18 22:28:00', '2025-11-20 22:28:00', 2, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
--

CREATE TABLE `nguoidung` (
  `mand` int(50) NOT NULL,
  `hoten` varchar(255) NOT NULL,
  `ngaysinh` date NOT NULL,
  `sdt` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `diachi` varchar(255) NOT NULL,
  `trangthai` tinyint(4) NOT NULL,
  `gioitinh` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`mand`, `hoten`, `ngaysinh`, `sdt`, `email`, `diachi`, `trangthai`, `gioitinh`) VALUES
(1, 'Admin', '2025-11-04', '0901234567', 'admin@gmail.com', '123 Đường ABC, Quận 1, TP.HCM', 1, 0),
(2, 'Nguyễn Văn An', '1995-03-15', '0912345678', 'nguyenvanan@gmail.com', '123 Lê Lợi, Quận 1, TP.HCM', 1, 0),
(3, 'Trần Thị Bích', '1992-07-20', '0987654321', 'tranthibich@gmail.com', '456 Nguyễn Trãi, Quận 5, TP.HCM', 1, 1),
(4, 'Lê Văn Cường', '1988-11-02', '0901122334', 'levancuong@gmail.com', '789 Trần Hưng Đạo, Quận 3, TP.HCM', 1, 0),
(5, 'Phạm Thị Dung', '2000-01-10', '0933445566', 'phamthidung@gmail.com', '321 Lê Duẩn, Quận 1, Hà Nội', 1, 1),
(6, 'Hoàng Văn Em', '1997-06-25', '0977889900', 'hoangvanem@gmail.com', '654 Hải Thượng Lãn Ông, Hà Nội', 1, 0),
(7, 'Nguyễn Thị F', '1993-09-18', '0911223344', 'nguyenthif@gmail.com', '87 Phạm Văn Đồng, Cầu Giấy, Hà Nội', 1, 1),
(8, 'Lê Thị Giang', '1996-12-05', '0922334455', 'lethigiang@gmail.com', '147 Võ Văn Kiệt, Quận 1, TP.HCM', 1, 1),
(9, 'Test', '2025-11-05', '0352447642', 'thihachcf@gmail.com', '11', 1, 0),
(10, 'Test tài xế', '2002-02-28', '0944455566', 'driver@gmail.com', '99 AnDuongVuong', 1, 1),
(11, 'test', '2025-11-07', '0352447642', 'thihachcf@gmail.com', 'a', 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhomquyen`
--

CREATE TABLE `nhomquyen` (
  `manq` int(50) NOT NULL,
  `tennq` varchar(255) NOT NULL,
  `trangthai` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `matk` int(50) NOT NULL,
  `tendangnhap` varchar(255) NOT NULL,
  `matkhau` varchar(255) NOT NULL,
  `manq` int(50) NOT NULL,
  `trangthai` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`matk`, `tendangnhap`, `matkhau`, `manq`, `trangthai`) VALUES
(1, 'admin', '123', 1, 1),
(2, 'nguyenvanan@gmail.com', '0912345678111', 3, 1),
(3, 'tranthibich@gmail.com', '1221r1a', 3, 1),
(4, 'levancuong@gmail.com', '0901122334', 2, 1),
(5, 'phamthidung@gmail.com', '0933445566', 3, 1),
(6, 'hoangvanem@gmail.com', '0977889900\r\n', 3, 1),
(7, 'nguyenthif@gmail.com', '0911223344\r\n', 3, 1),
(8, 'lethigiang@gmail.com', '0922334455', 2, 1),
(9, 'driver', '123', 2, 1),
(10, 'parent', '123', 3, 1),
(11, 'test123', '123012', 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taixe`
--

CREATE TABLE `taixe` (
  `matx` int(50) NOT NULL,
  `hoten` varchar(255) NOT NULL,
  `ngaysinh` date NOT NULL,
  `gioitinh` tinyint(4) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sdt` varchar(50) NOT NULL,
  `diachi` varchar(255) NOT NULL,
  `trangthai` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thongbao`
--

CREATE TABLE `thongbao` (
  `matb` int(50) NOT NULL,
  `matx` int(50) NOT NULL,
  `maph` int(50) NOT NULL,
  `thoigiantao` datetime NOT NULL DEFAULT current_timestamp(),
  `thoigiangui` datetime DEFAULT NULL,
  `tieude` varchar(255) NOT NULL,
  `noidung` varchar(255) NOT NULL,
  `loaithongbao` varchar(255) NOT NULL,
  `mucdouutien` varchar(255) NOT NULL,
  `trangthai` tinyint(4) NOT NULL COMMENT '1 là lên lịch, 2 là đã gửi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `thongbao`
--

INSERT INTO `thongbao` (`matb`, `matx`, `maph`, `thoigiantao`, `thoigiangui`, `tieude`, `noidung`, `loaithongbao`, `mucdouutien`, `trangthai`) VALUES
(1, 4, 2, '2025-11-11 09:00:00', '2025-11-11 09:15:00', 'Hoàn thành chuyến đi an toàn', 'Con bạn đã được trả an toàn tại điểm Trường THCS ABC lúc 7:45 AM. Cảm ơn quý phụ huynh đã tin tưởng dịch vụ.', 'Lịch trình', 'Bình thường', 1),
(2, 9, 10, '2025-11-11 10:30:00', NULL, 'Xe buýt BUS-002 bị trễ 15 phút', 'Xe buýt BUS-002 đang bị trễ 15 phút do tắc đường. Dự kiến đến điểm đón lúc 7:45 AM.', 'Khẩn cấp', 'Cao', 2),
(3, 9, 3, '2025-11-11 11:00:00', NULL, 'Xe buýt BUS-001 đã đến điểm Bến Thành', 'Con bạn đã được đón tại điểm Bến xe Bến Thành lúc 7:15 AM. Xe đang trên đường đến trường.', 'Thông tin', 'Bình thường', 2),
(4, 8, 6, '2025-11-11 12:15:00', NULL, 'Thông báo thay đổi lịch trình', 'Do sửa chữa đường, tuyến Quận 1 - Quận 7 sẽ thay đổi lộ trình từ ngày mai. Thời gian đón trả không đổi.', 'Thông tin', 'Bình thường', 1),
(5, 0, 0, '2025-11-20 05:08:12', NULL, 'aa', 'aa', 'Thông tin', 'Bình thường', 2),
(6, 1, 1, '2025-11-20 18:33:36', '2025-11-20 18:33:36', 'Bắt đầu xuất phát chuyến đi', 'Con đã được đón ở Bến xe Tiến Trung và bắt đầu đi', 'Lịch trình', 'Bình thường', 2),
(7, 1, 2, '2025-11-20 18:33:36', '2025-11-20 18:33:36', 'Bắt đầu xuất phát chuyến đi', 'Con đã được đón ở Bến xe Tiến Trung và bắt đầu đi', 'Lịch trình', 'Bình thường', 2),
(8, 1, 1, '2025-11-20 18:33:57', '2025-11-20 18:33:57', 'Đã đến Chợ Tân Địnhh', 'Đã đến trạm Chợ Tân Địnhh, cha mẹ chú ý đưa/ đón con mình', 'Lịch trình', 'Bình thường', 2),
(9, 1, 2, '2025-11-20 18:33:57', '2025-11-20 18:33:57', 'Đã đến Chợ Tân Địnhh', 'Đã đến trạm Chợ Tân Địnhh, cha mẹ chú ý đưa/ đón con mình', 'Lịch trình', 'Bình thường', 2),
(10, 1, 1, '2025-11-21 03:36:56', '2025-11-21 03:36:56', 'Đã đến Công viên Tao Đàn', 'Đã đến trạm Công viên Tao Đàn, cha mẹ chú ý đưa/ đón con mình', 'Lịch trình', 'Bình thường', 2),
(11, 1, 2, '2025-11-21 03:36:56', '2025-11-21 03:36:56', 'Đã đến Công viên Tao Đàn', 'Đã đến trạm Công viên Tao Đàn, cha mẹ chú ý đưa/ đón con mình', 'Lịch trình', 'Bình thường', 2),
(12, 1, 2, '2025-11-21 04:24:55', '2025-11-21 04:24:55', 'Đã đến Chợ Gò Vấp', 'Đã đến trạm Chợ Gò Vấp, cha mẹ chú ý đưa/ đón con mình', 'Lịch trình', 'Bình thường', 2),
(13, 1, 3, '2025-11-21 04:24:55', '2025-11-21 04:24:55', 'Đã đến Chợ Gò Vấp', 'Đã đến trạm Chợ Gò Vấp, cha mẹ chú ý đưa/ đón con mình', 'Lịch trình', 'Bình thường', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tracking`
--

CREATE TABLE `tracking` (
  `matheodoi` int(50) NOT NULL,
  `thoigian` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `vidoCenter` decimal(9,6) NOT NULL,
  `kinhdoCenter` decimal(9,6) NOT NULL,
  `vantoc` double NOT NULL,
  `malt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuyenduong`
--

CREATE TABLE `tuyenduong` (
  `tentuyen` varchar(255) NOT NULL,
  `mota` varchar(255) NOT NULL,
  `tongquangduong` double NOT NULL,
  `trangthai` tinyint(4) NOT NULL,
  `matd` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tuyenduong`
--

INSERT INTO `tuyenduong` (`tentuyen`, `mota`, `tongquangduong`, `trangthai`, `matd`) VALUES
('Quận 1 City Tour', 'Bến xe Tiến Trung - Chợ Tân Đình - Công viên Tao Đàn - Nhà thờ Đức Bà', 6.5, 1, 1),
('Sân Bay - Thủ Đức', 'Sân bay Tân Sơn Nhất - Chợ Gò Vấp - Chợ Thủ Đức - ĐH Quốc gia TP.HCM', 18.2, 1, 2),
('Gò Vấp - Quận 7', 'Chợ Gò Vấp - Bệnh viện Chợ Rẫy - Đầm Sen - Crescent Mall (Quận 7)', 14.3, 0, 3),
('a', 'aaa', 8.62, 1, 4),
('test', '123', 8.62, 0, 7),
('test2', '123', 4.9, 0, 9),
('test', '123', 7.13, 1, 10),
('test3', '123', 7.13, 1, 11),
('test', 'ăd', 7.13, 1, 12),
('testx', 'text', 7.13, 1, 13),
('testa', 'testa', 7.13, 0, 14),
('ư', 'a', 4.9, 0, 15);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xe`
--

CREATE TABLE `xe` (
  `maxe` int(50) NOT NULL,
  `bienso` varchar(255) NOT NULL,
  `hangxe` varchar(255) NOT NULL,
  `soghe` int(11) NOT NULL,
  `vantoctrungbinh` double NOT NULL,
  `trangthai` tinyint(4) NOT NULL COMMENT '0 là ngưng HĐ, 1 là HĐ, 2 là bảo trì, 3 là sửa chửa',
  `namsanxuat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `xe`
--

INSERT INTO `xe` (`maxe`, `bienso`, `hangxe`, `soghe`, `vantoctrungbinh`, `trangthai`, `namsanxuat`) VALUES
(1, '29A1-12345', 'Toyota', 40, 45.5, 1, 2020),
(2, '30A2-67890', 'Honda', 50, 40.2, 1, 2021),
(3, '31A3-11111', 'Ford', 40, 35.7, 2, 2019),
(4, '32A4-22222', 'Hyundai', 50, 38.3, 1, 2022),
(5, '33A5-33333', 'Mercedes', 40, 30.8, 1, 2023),
(6, '29B1-44444', 'BMW', 50, 45.6, 3, 2021),
(7, '30B2-55555', 'Audi', 36, 45.9, 1, 2020),
(8, '31B3-66666', 'Kia', 50, 42.4, 1, 2018),
(9, '32B4-77777', 'Mazda', 45, 42.1, 0, 2022),
(10, '33B5-88888', 'VinFast', 50, 38.9, 1, 2023),
(11, '29C1-99999', 'Chevrolet', 46, 47.3, 1, 2021),
(27, 'test1', 'Toyota', 12, 50, 0, 2001),
(28, 'test2', 'Toyota', 12, 50, 0, 12),
(29, 'test3', '123', 12, 50, 0, 2000),
(34, 'testfinal', 'Toyota', 50, 50, 0, 2024),
(35, 'test11', 'Mercedes', 40, 50, 2, 2023),
(36, 'test5', 'Toyota', 40, 50, 0, 2000);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `danhmucchucnang`
--
ALTER TABLE `danhmucchucnang`
  ADD PRIMARY KEY (`macn`);

--
-- Chỉ mục cho bảng `diemdung`
--
ALTER TABLE `diemdung`
  ADD PRIMARY KEY (`madd`);

--
-- Chỉ mục cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD PRIMARY KEY (`mahs`);

--
-- Chỉ mục cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD PRIMARY KEY (`malt`);

--
-- Chỉ mục cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`mand`);

--
-- Chỉ mục cho bảng `nhomquyen`
--
ALTER TABLE `nhomquyen`
  ADD PRIMARY KEY (`manq`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`matk`);

--
-- Chỉ mục cho bảng `taixe`
--
ALTER TABLE `taixe`
  ADD PRIMARY KEY (`matx`);

--
-- Chỉ mục cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`matb`);

--
-- Chỉ mục cho bảng `tracking`
--
ALTER TABLE `tracking`
  ADD PRIMARY KEY (`matheodoi`);

--
-- Chỉ mục cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  ADD PRIMARY KEY (`matd`);

--
-- Chỉ mục cho bảng `xe`
--
ALTER TABLE `xe`
  ADD PRIMARY KEY (`maxe`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `danhmucchucnang`
--
ALTER TABLE `danhmucchucnang`
  MODIFY `macn` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `diemdung`
--
ALTER TABLE `diemdung`
  MODIFY `madd` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  MODIFY `mahs` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  MODIFY `malt` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `mand` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `nhomquyen`
--
ALTER TABLE `nhomquyen`
  MODIFY `manq` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `matk` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `taixe`
--
ALTER TABLE `taixe`
  MODIFY `matx` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  MODIFY `matb` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `tracking`
--
ALTER TABLE `tracking`
  MODIFY `matheodoi` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  MODIFY `matd` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `xe`
--
ALTER TABLE `xe`
  MODIFY `maxe` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
