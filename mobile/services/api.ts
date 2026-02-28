import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    // Using the local IP revealed in Expo logs to ensure physical devices can connect
    baseURL: 'http://10.165.240.142:5000',
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
