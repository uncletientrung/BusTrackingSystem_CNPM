class UserDTO {
  constructor(mand, hoten, ngaysinh, sdt, email, diachi, trangthai, gioitinh) {
    this.mand=mand;
    this.hoten=hoten;
    this.ngaysinh=ngaysinh;
    this.sdt=sdt;
    this.email=email;
    this.trangthai=trangthai;
    this.diachi = diachi;
    this.gioitinh = gioitinh;
  }
}

module.exports = UserDTO;
