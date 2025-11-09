class StudentDTO {
    constructor(mahs, hoten, ngaysinh, gioitinh, lop, diachi, sdt, maph, diemdon, diemdung, trangthai) {
        this.mahs = mahs;
        this.hoten = hoten;
        this.ngaysinh = ngaysinh;
        this.gioitinh = gioitinh;
        this.lop = lop;
        this.diachi = diachi;
        this.sdt = sdt;
        this.maph = maph;
        this.diemdon = diemdon;
        this.diemdung = diemdung;
        this.trangthai = trangthai;
    }
}

module.exports = StudentDTO;
