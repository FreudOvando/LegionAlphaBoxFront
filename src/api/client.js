import axios from 'axios';
import { clearSession, getToken } from '@/lib/authStorage';
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiBaseUrl = configuredApiUrl
    ? configuredApiUrl.startsWith('/')
        ? configuredApiUrl.replace(/\/+$/, '') || '/api'
        : (() => {
            const url = new URL(/^https?:\/\//i.test(configuredApiUrl) ? configuredApiUrl : `https://${configuredApiUrl}`);
            url.pathname = `${url.pathname.replace(/\/+$/, '').replace(/\/api$/i, '')}/api`;
            return url.toString().replace(/\/$/, '');
        })()
    : '/api';
export const apiClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Agrega el token a cada petición saliente, si existe
apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Si el backend responde 401 (token vencido/inválido), cierra la sesión
// y manda al login — excepto si la petición que falló fue el login mismo
// (ahí un 401 significa "contraseña incorrecta", no "sesión vencida")
apiClient.interceptors.response.use((response) => response, (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
        clearSession();
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
