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
                noti.tieude,
                noti.noidung,
                noti.loaithongbao,
                noti.mucdouutien,
                noti.trangthai
            )
        );
        return result;
    }
}

module.exports = NotificationBUS;