const StudentBUS = require('../BUS/StudentBUS');

const StudentController = {
    async getAll(req, res) {
        try {
            const listStudent = await StudentBUS.getAll();
            res.json(listStudent);
        } catch (error) {
            console.error('Lỗi getAll từ Controller của Student:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const studentData = req.body;
            const newStudent = await StudentBUS.createStudent(studentData);
            res.status(201).json({
                message: 'Thêm học sinh thành công!',
                student: newStudent
            });
        } catch (error) {
            console.error('Lỗi thêm học sinh:', error);
            res.status(400).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { mahs } = req.params
            await StudentBUS.deleteStudent(Number(mahs));
            res.json({
                message: 'Xóa học sinh thành công',
                mahs: Number(mahs)
            });
        } catch (error) {
            console.error('Lỗi xóa học sinh:', error);
            res.status(400).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { mahs } = req.params;
            const studentData = req.body;
            const studentUpdate = await StudentBUS.updateStudent(mahs, studentData);
            res.json({
                message: 'Cập nhật học sinh thành công',
                student: studentUpdate
            })
        } catch (error) {
            console.error('Lỗi sửa học sinh:', error);
            res.status(400).json({ message: error.message });
        }
    },
    async getById(req, res) {
        try {
            const { mahs } = req.params;
            const student = await StudentBUS.getById(Number(mahs));
            if (!student) {
                return res.status(404).json({ message: 'Không tìm thấy học sinh' });
            }
            res.json(student);
        } catch (error) {
            console.error('Lỗi lấy thông tin học sinh:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = StudentController;