<!-- author: uncletientrung -->
# Đồ án môn Công nghệ phần mềm  <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYW00MjZ1bmkwcWpscWVkenI1YmsycXJrMTlyNGJ4bm1sMDBsZTJ3dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PhAcH2l5RgYzT2pKAj/giphy.gif" width="50">
## Đề tài: Hệ thống theo dõi xe buýt 

## Thành viên & Đóng góp
| Thành viên | MSSV | Vai trò | Frontend | Backend | 
|----|------|--------|----------|----------|
| <img src="https://media.giphy.com/media/WUlplcMpOCEmTGBtBW/giphy.gif" width="25"> Nguyễn Tiến Trung | 3123410396 | Nhóm trưởng | 20% | 70% |
| <img src="https://media.giphy.com/media/WUlplcMpOCEmTGBtBW/giphy.gif" width="25"> Nguyễn Minh Thuận | 3123410365 | Thành viên | 10% | 10% |
| <img src="https://media.giphy.com/media/WUlplcMpOCEmTGBtBW/giphy.gif" width="25"> Nguyễn Thái Vinh | 3123410433 | Thành viên | 60% | 10% |
| <img src="https://media.giphy.com/media/WUlplcMpOCEmTGBtBW/giphy.gif" width="25"> Phan Hoàng Vũ | 3123410436 | Thành viên | 10% | 10% |
| <img src="https://media.giphy.com/media/WUlplcMpOCEmTGBtBW/giphy.gif" width="25"> Đặng Nhật Đức | 3123410082 | Thành viên | 0% | 0% |

**Lưu ý**: Nhóm thực hiện khoảng **30% khối lượng công việc ở Frontend**, 
có tham khảo và sử dụng **công cụ AI hỗ trợ** trong việc tra cứu tài liệu, gợi ý giải pháp và chỉnh sửa nội dung.

## Getting Started
1. Tải source code về:
    ```bash
   git clone https://github.com/uncletientrung/BusTrackingSystem_CNPM.git
   ```
2. Mở xampp và vào trang http://localhost/phpmyadmin/ tạo 1 database mới có tên là bustrackingsystem và import cơ sở dữ liệu trong folder frontend -> database -> file bustrackingsystem.sql trong source code.
3. Sử dụng Visual Studio Code để chạy chương trình
4. Chạy chương trình:
   - Terminal 1:
     ```bash
     cd frontend
     npm run dev
     ```
   - Terminal 2:
     ```bash
     cd backend
     npm start
     ```
5. Truy cập "http://localhost:5173/" để sử dụng chương trình

### Tài khoản Admin
- Username: admin
- Password: 123

### Giao diện
<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/trangchu.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Trang chủ</h4>

<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/qlxebuyt.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Quản lý xe buýt</h4>

<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/qltuyenduong.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Quản lý tuyến đường</h4>

<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/qldiemdung.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Quản lý điểm dừng</h4>

<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/qlhocsinh.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Quản lý học sinh</h4>

<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/gps.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Theo dõi vị trí xe</h4>

<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/qllichtrinh.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Quản lý lịch trình</h4>

<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/tinnhan.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Nhắn tin với tài xế</h4>

<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/nguoidung.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Quản lý người dùng</h4>

<table align="center" border="2" cellpadding="10" cellspacing="0">
  <tr>
    <td>
      <img src="./img/qlthongbao.jpg" width="800">
    </td>
  </tr>
</table>
<h4 align="center">Quản lý thông báo</h4>
