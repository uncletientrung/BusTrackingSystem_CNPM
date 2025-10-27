import apiClient from '../utils/apiClient';
import API_CONFIG from '../config/api.config';

const loginApi = (email, password) => {
    return apiClient.post(API_CONFIG.endpoints.login, { email, password });
}

export { loginApi };