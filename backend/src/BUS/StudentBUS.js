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
    },
    async updateStudent(mahs, studentData) {
        const updateStudent = await StudentDAO.update(mahs, studentData);
        return new StudentDTO(updateStudent.mahs, updateStudent.hoten, updateStudent.ngaysinh, updateStudent.gioitinh,
            updateStudent.lop, updateStudent.diachi, updateStudent.sdt, updateStudent.maph, updateStudent.diemdon,
            updateStudent.diemdung, updateStudent.trangthai);
    },
    async getById(mahs) {
        const student = await StudentDAO.getById(mahs);
        if (!student) {
            return null;
        }
        return new StudentDTO(
            student.mahs,
            student.hoten,
            student.ngaysinh,
            student.gioitinh,
            student.lop,
            student.diachi,
            student.sdt,
            student.maph,
            student.madiemdon,
            student.madiemtra,
            student.trangthai
        );
    }

}

module.exports = StudentBUS; { }