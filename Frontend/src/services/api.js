import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    const { access } = response.data;
                    localStorage.setItem('accessToken', access);

                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => api.post('/auth/register/', data),
    login: (data) => api.post('/auth/login/', data),
    refreshToken: (refresh) => api.post('/auth/token/refresh/', { refresh }),
    requestPasswordReset: (email) => api.post('/auth/password-reset/', { email }),
    confirmPasswordReset: (data) => api.post('/auth/password-reset-confirm/', data),
    getCurrentUser: () => api.get('/auth/me/'),
    updateProfile: (data) => api.patch('/auth/profile/', data),
    changePassword: (data) => api.post('/auth/change-password/', data),
};

export const tutorialsAPI = {
    getAll: (params) => api.get('/tutorials/', { params }),
    getById: (id) => api.get(`/tutorials/${id}/`),
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        return api.post('/tutorials/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    update: (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        return api.patch(`/tutorials/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (id) => api.delete(`/tutorials/${id}/`),
    getDashboard: () => api.get('/tutorials/dashboard/'),
};

export const contentAPI = {
    create: (tutorialId, data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        return api.post(`/tutorials/${tutorialId}/contents/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    update: (contentId, data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        return api.patch(`/tutorials/contents/${contentId}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (contentId) => api.delete(`/tutorials/contents/${contentId}/`),
};

export const progressAPI = {
    get: (tutorialId) => api.get(`/tutorials/${tutorialId}/progress/`),
    update: (tutorialId, completedContentIds) =>
        api.patch(`/tutorials/${tutorialId}/progress/`, {
            completed_content_ids: completedContentIds,
        }),
};

export default api;