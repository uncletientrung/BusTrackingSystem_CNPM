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
};

module.exports = StudentController;