import apiClient from "./api";

export const UserAPI = {
  getAllUsers: () => apiClient.fetchAll("User"),
  createUser: (UsernAccountNEW) => apiClient.create("User", UsernAccountNEW),
  deleteUser: (mand) => apiClient.deleteForm("User", mand),
  updateUser: (mand, userUpdateData) =>
    apiClient.update("User", mand, userUpdateData),
};

export const StopAPI = {
  getAllStops: () => apiClient.fetchAll("Stop"),
  getStopById: (madd) => apiClient.fetchById("Stop", madd),
  createStop: (newStop) => apiClient.create("Stop", newStop),
  deleteStop: (madd) => apiClient.deleteForm("Stop", madd),
  updateStop: (madd, stopData) => apiClient.update("Stop", madd, stopData),
};

export const AccountAPI = {
  getAllAccount: () => apiClient.fetchAll("Account"),
  getAccountById: (matk) => apiClient.fetchById("Account", matk),
};

export const StudentAPI = {
  getAllStudent: () => apiClient.fetchAll("Student"),
  createStudent: (newStudent) => apiClient.create("Student", newStudent),
  deleteStudent: (mahs) => apiClient.deleteForm("Student", mahs),
  updateStudent: (mahs, updateStudent) =>
    apiClient.update("Student", mahs, updateStudent),
};

export const BusAPI = {
  getAllBus: () => apiClient.fetchAll("Bus"),
  createBus: (newBus) => apiClient.create("Bus", newBus),
  deleteBus: (maxe) => apiClient.deleteForm("Bus", maxe),
  updateBus: (maxe, updateBus) => apiClient.update("Bus", maxe, updateBus),
};

export const RouteAPI = {
  getAllRoute: () => apiClient.fetchAll("Route"),
  createRoute: (newRoute) => apiClient.create("Route", newRoute),
  deleteRoute: (matd) => apiClient.deleteForm("Route", matd),
  updateRoute: (matd, updateRoute) =>
    apiClient.update("Route", matd, updateRoute),
};

export const ScheduleAPI = {
  getAllSchedule: () => apiClient.fetchAll('Schedule'),
  createSchedule: (newScheduleDayDu) => apiClient.create('Schedule', newScheduleDayDu),
  deleteSchedule: (malt) => apiClient.deleteForm('Schedule', malt),
  updateSchedule: (malt, updateScheduleDayDu) => apiClient.update('Schedule', malt, updateScheduleDayDu)
}

export const NotificationAPI = {
  getAllNotification: () => apiClient.fetchAll("Notification"),
  createNotification: (data) => apiClient.create("Notification", data),
  deleteNotification: (matb) => apiClient.deleteForm("Notification", matb),
  updateNotification: (matb, data) => apiClient.update("Notification", matb, data),
  insertNhieuNotification: (dsFormThongBao) => apiClient.createBulk("Notification", dsFormThongBao)
};

export const CTRouteAPI = {
  getCTTTById: (matd) => apiClient.fetchById("CTRoute", matd),
  updateStatus: (matd, updateInfo) => apiClient.update("CTRoute", matd, updateInfo)
};

export const CTScheduleAPI = {
  getCTLTById: (malt) => apiClient.fetchById("CTSchedule", malt)
}