const StudentDAO = require('../DAO/StudentDAO');
const StudentDTO = require('../DTO/StudentDTO');

const StudentBUS = {
    async getAll() {
        const listStudent = await StudentDAO.getAll();
        const result = listStudent.map(
            std => new StudentDTO(
                std.mahs,
                std.hoten,
                std.ngaysinh,
                std.gioitinh,
                std.lop,
                std.diachi,
                std.sdt,
                std.maph,
                std.diemdon,
                std.diemdung,
                std.trangthai
            )
        );
        return result;
    }
}

module.exports = StudentBUS;