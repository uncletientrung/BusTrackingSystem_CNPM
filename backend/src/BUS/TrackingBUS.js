const TrackingDTO = require('../DTO/TrackingDTO')
const TrackingDAO = require('../DAO/TrackingDAO')

const TrackingBUS = {
    async getTrackingByIdLT(malt) {
        const listTracking = await TrackingDAO.getTrackingByIdLT(malt);
        return listTracking.map(tracking => new TrackingDTO(
            tracking.malt, tracking.matd, tracking.madd,
            tracking.thutu, tracking.trangthai, tracking.hocsinhconlai, tracking.thoigianden
        ))
    },
    async updateStatus(malt, matd, madd, trangthai, soHSCanCapNhat) {
        const updateCount = TrackingDAO.updateStatus(malt, matd, madd, trangthai, soHSCanCapNhat);
        return updateCount;
    }
}

module.exports = TrackingBUS;