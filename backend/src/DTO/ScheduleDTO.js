class ScheduleDTO {
    constructor(malt, matx, matd, maxe, thoigianbatdau, thoigianketthuc, tonghocsinh, trangthai) {
        this.malt = malt;
        this.matx = matx;
        this.matd = matd;
        this.maxe = maxe;
        this.thoigianbatdau = thoigianbatdau;
        this.thoigianketthuc = thoigianketthuc;
        this.tonghocsinh = tonghocsinh;
        this.trangthai = trangthai;
    }
}

module.exports = ScheduleDTO;