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
}

export const RouteAPI = {
    getAllRoute: () => apiClient.fetchAll('Route'),
}

export const ScheduleAPI = {
    getAllSchedule: () => apiClient.fetchAll('Schedule')
}

export const NotificationAPI = {
    getAllNotification: () => apiClient.fetchAll('Notification')
}