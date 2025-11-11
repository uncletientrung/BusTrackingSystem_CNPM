const NotificationBUS = require('../BUS/NotificationBUS');

const NotificationController = {
    async getAll(req, res) {
        try {
            const listNotification = await NotificationBUS.getAll();
            res.json(listNotification);
        } catch (error) {
            console.error('Lỗi getAll từ Controller của Notification:', error);
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = NotificationController;