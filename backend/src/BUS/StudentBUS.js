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
    },
    async createStudent(studentData) {
        const { hoten, ngaysinh, gioitinh, lop, diachi, sdt, maph, diemdon, diemdung, trangthai } = studentData;
        const newStudent = await StudentDAO.create({
            hoten, ngaysinh, gioitinh, lop, diachi, sdt, maph, diemdon, diemdung, trangthai
        });

        return new StudentDTO(newStudent.mahs, newStudent.hoten, newStudent.ngaysinh, newStudent.gioitinh,
            newStudent.lop, newStudent.diachi, newStudent.sdt, newStudent.maph, newStudent.diemdon,
            newStudent.diemdung, newStudent.trangthai
        );
    },
    async deleteStudent(mahs) {
        const result = await StudentDAO.delete(mahs);
        if (result == 0) {
            throw new Error('Xóa thất bại');
        }
        return { message: 'Xóa học sinhh thành công!', mahs };
    }

}

module.exports = StudentBUS;