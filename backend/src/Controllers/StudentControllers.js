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
    }
};

module.exports = StudentController;