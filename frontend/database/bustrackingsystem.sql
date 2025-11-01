-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 01, 2025 lúc 07:59 PM
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
  `quangduong` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Bến xe Tiến Trung', 10.823100, 106.629700, '1 Phạm Ngũ Lão, Quận 1, TP.HCM'),
(2, 'Chợ Tân Định', 10.789000, 106.685000, '120 Hai Bà Trưng, Quận 1, TP.HCM'),
(3, 'Công viên Tao Đàn', 10.776900, 106.690900, 'Trương Định, Quận 1, TP.HCM'),
(4, 'Sân bay Tân Sơn Nhất', 10.818700, 106.651900, 'Trường Sơn, Tân Bình, TP.HCM'),
(5, 'Nhà thờ Đức Bà', 10.779800, 106.699000, '01 Công xã Paris, Quận 1, TP.HCM'),
(6, 'Cầu Sài Gòn', 10.762400, 106.683200, 'Võ Văn Kiệt, Quận 1, TP.HCM'),
(7, 'TTTM Crescent Mall', 10.729200, 106.719700, '101 Tôn Dật Tiên, Quận 7, TP.HCM'),
(8, 'ĐH Quốc gia TP.HCM', 10.870000, 106.803000, 'Linh Trung, Thủ Đức, TP.HCM'),
(9, 'Chợ Thủ Đức', 10.850600, 106.771700, 'Võ Văn Ngân, Thủ Đức, TP.HCM'),
(10, 'Bệnh viện Chợ Rẫy', 10.755400, 106.666500, '201B Nguyễn Chí Thanh, Quận 5, TP.HCM'),
(11, 'Chợ Gò Vấp', 10.814200, 106.643800, 'Quang Trung, Gò Vấp, TP.HCM'),
(12, 'Đầm Sen', 10.788900, 106.654200, 'Hòa Bình, Quận 11, TP.HCM');

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
  `trangthai` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `trangthai` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(9, 'Test', '2025-11-05', '0352447642', 'thihachcf@gmail.com', '11', 1, 0);

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
(1, 'admin@gmail.com', '1234', 1, 1),
(2, 'nguyenvanan@gmail.com', '0912345678111', 3, 1),
(3, 'tranthibich@gmail.com', '1221r1a', 3, 1),
(4, 'levancuong@gmail.com', '0901122334', 2, 1),
(5, 'phamthidung@gmail.com', '0933445566', 3, 1),
(6, 'hoangvanem@gmail.com', '0977889900\r\n', 3, 1),
(7, 'nguyenthif@gmail.com', '0911223344\r\n', 3, 1),
(8, 'lethigiang@gmail.com', '0922334455', 2, 1),
(9, 'test', '123', 2, 1);

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
  `thoigiantao` date NOT NULL,
  `tieude` varchar(255) NOT NULL,
  `noidung` varchar(255) NOT NULL,
  `loaithongbao` varchar(255) NOT NULL,
  `mucdouutien` varchar(255) NOT NULL,
  `trangthai` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `tongquanduong` double NOT NULL,
  `matd` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `trangthai` tinyint(4) NOT NULL,
  `namsanxuat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `madd` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  MODIFY `mahs` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  MODIFY `malt` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `mand` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `nhomquyen`
--
ALTER TABLE `nhomquyen`
  MODIFY `manq` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `matk` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `taixe`
--
ALTER TABLE `taixe`
  MODIFY `matx` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  MODIFY `matb` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tracking`
--
ALTER TABLE `tracking`
  MODIFY `matheodoi` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  MODIFY `matd` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `xe`
--
ALTER TABLE `xe`
  MODIFY `maxe` int(50) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
