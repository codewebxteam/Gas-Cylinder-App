import axios from 'axios';
import { storage } from './storage';

const api = axios.create({
    // Using the local IP revealed in Expo logs to ensure physical devices can connect
    baseURL: 'http://10.165.240.142:5000',
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = await storage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
