import apiClient from './apiClient';
import { API_ROUTES } from '../constants/apiRoutes';

export const authService = {
    login: async (credentials) => {
        // apiClient returns response.data automatically due to interceptor
        return await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
    },
    logout: async () => {
        return await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    },
    getMe: async () => {
        return await apiClient.get(API_ROUTES.AUTH.ME);
    },
    register: async (data) => {
        return await apiClient.post(API_ROUTES.AUTH.REGISTER, data);
    },
    getEduTypes: async () => {
        return await apiClient.get(API_ROUTES.AUTH.EDU_TYPES);
    },
    setupOrg: async (data) => {
        return await apiClient.post(API_ROUTES.AUTH.SETUP_ORG, data);
    }
};

export const schoolService = {
    createSchool: async (schoolData) => {
        return await apiClient.post(API_ROUTES.SUPER_ADMIN.CREATE_SCHOOL, schoolData);
    },
    getAllSchools: async () => {
        return await apiClient.get(API_ROUTES.SCHOOL.LIST);
    },
    uploadXlsx: async (formData) => {
        return await apiClient.post(API_ROUTES.SUPER_ADMIN.XLSX_UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export const subscriptionService = {
    createPlan: async (payload) => {
        return await apiClient.post(API_ROUTES.SUPER_ADMIN.CREATE_PLAN, payload);
    },
    getAllPlans: async () => {
        return await apiClient.get(API_ROUTES.SUBSCRIPTION.PLANS);
    }
};

export const userService = {
    uploadAvatar: async (formData) => {
        return await apiClient.post(API_ROUTES.USER.UPLOAD_AVATAR, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateProfile: async (name) => {
        return await apiClient.put(API_ROUTES.USER.PROFILE, { name });
    },
    updatePassword: async (passwords) => {
        return await apiClient.put(API_ROUTES.USER.PASSWORD, passwords);
    }
};
