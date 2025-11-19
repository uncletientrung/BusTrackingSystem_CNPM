const NotificationDAO = require('../DAO/NotificationDAO');
const NotificationDTO = require('../DTO/NotificationDTO');

const NotificationBUS = {
    async getAll() {
        const listNotification = await NotificationDAO.getAll();
        const result = listNotification.map(
            noti => new NotificationDTO(
                noti.matb,
                noti.matx,
                noti.maph,
                noti.thoigiantao,
                noti.thoigiangui,
                noti.tieude,
                noti.noidung,
                noti.loaithongbao,
                noti.mucdouutien,
                noti.trangthai
            )
        );
        return result;
    },
    async insertNotificationBUS(notification) {
        const giaodich = await require('../config/connectDB').sequelize.transaction();
        try {
            const noti = await NotificationDAO.insertNotificationDAO(notification, { transaction: giaodich });
            await giaodich.commit();
            return new NotificationDTO(
                noti.matb,
                noti.matx,
                noti.maph,
                noti.thoigiantao,
                noti.thoigiangui,
                noti.tieude,
                noti.noidung,
                noti.loaithongbao,
                noti.mucdouutien,
                noti.trangthai
            );
        } catch (error) {
            await giaodich.rollback();
            throw error;
        }
    },
    async deleteNotificationBUS(matb) {
        const giaodich = await require('../config/connectDB').sequelize.transaction();
        try {
            const deletedCount = await NotificationDAO.deleteNotificationDAO(matb, { transaction: giaodich });
            if (deletedCount === 0) {
                throw new Error('Không tìm thấy thông báo để xóa');
            }
            await giaodich.commit();
        } catch (error) {
            await giaodich.rollback();
            throw error;
        }
    },
    async updateNotificationBUS(matb, notificationData) {
        const giaodich = await require('../config/connectDB').sequelize.transaction();
        try {
            const [updatedCount] = await NotificationDAO.updateNotificationDAO(matb, notificationData, { transaction: giaodich });
            if (updatedCount === 0) {
                throw new Error('Không tìm thấy thông báo để cập nhật');
            }
            await giaodich.commit();
            return new NotificationDTO(
                matb,
                notificationData.matx,
                notificationData.maph,
                notificationData.thoigiantao,
                notificationData.thoigiangui,
                notificationData.tieude,
                notificationData.noidung,
                notificationData.loaithongbao,
                notificationData.mucdouutien,
                notificationData.trangthai
            );
        } catch (error) {
            await giaodich.rollback();
            throw error;
        }
    }
}

module.exports = NotificationBUS;