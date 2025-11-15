import apiClient from './api';


export const UserAPI = {
    getAllUsers: () => apiClient.fetchAll('User')
}

export const StopAPI = {
    getAllStops: () => apiClient.fetchAll('Stop'),
    getStopById: (madd) => apiClient.fetchById('Stop', madd)
}

export const AccountAPI = {
    getAllAccount: () => apiClient.fetchAll('Account'),
    getAccountById: (matk) => apiClient.fetchById('Account', matk)
}

export const StudentAPI = {
    getAllStudent: () => apiClient.fetchAll('Student'),
}

export const BusAPI = {
    getAllBus: () => apiClient.fetchAll('Bus'),
    createBus: (newBus) => apiClient.create('Bus', newBus),
    deleteBus: (maxe) => apiClient.deleteForm('Bus', maxe),
    updateBus: (maxe, updateBus) => apiClient.update('Bus', maxe, updateBus)
}

export const RouteAPI = {
    getAllRoute: () => apiClient.fetchAll('Route'),
    createRoute: (newRoute) => apiClient.create('Route', newRoute),
    deleteRoute: (matd) => apiClient.deleteForm('Route', matd),
    updateRoute: (matd, updateRoute) => apiClient.update('Route', matd, updateRoute)
}

export const ScheduleAPI = {
    getAllSchedule: () => apiClient.fetchAll('Schedule')
}

export const NotificationAPI = {
    getAllNotification: () => apiClient.fetchAll('Notification')
}

export const CTRouteAPI = {
    getCTTTById: (matd) => apiClient.fetchById('CTRoute', matd)
}