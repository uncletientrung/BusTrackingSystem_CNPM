import apiClient from './api';


export const UserAPI={
    getAllUsers: () => apiClient.fetchAll('User')
}

export const StopAPI={
    getAllStops: () => apiClient.fetchAll('Stop'),
    getStopById: (madd) => apiClient.fetchById('Stop', madd)
}