export const API_ROUTES = {
    AUTH: {
        LOGIN: 'auth/login',
        REGISTER: 'auth/register',
        REFRESH: 'auth/refresh',
        LOGOUT: 'auth/logout',
        ME: 'auth/me',
        EDU_TYPES: 'auth/edu-types',
        SETUP_ORG: 'auth/setup-org',
        FORGOT_PASSWORD: 'auth/forgot-password',
        VERIFY_OTP: 'auth/verify-otp',
        RESET_PASSWORD: 'auth/reset-password',
    },
    SUPER_ADMIN: {
        CREATE_SCHOOL: 'superadmin/schools/create',
        ASSIGN_PLAN: 'superadmin/schools/assign-plan',
        DASHBOARD_STATS: 'superadmin/dashboard/stats',
        CREATE_PLAN: 'superadmin/plans/create',
        MAP_MODULES: 'superadmin/plans/map-modules',
        XLSX_UPLOAD: 'superadmin/schools/upload-xlsx',
    },
    SCHOOL: {
        LIST: 'schools',
        DETAILS: (id) => `schools/${id}`,
    },
    SUBSCRIPTION: {
        PLANS: 'plans',
    },
    USER: {
        UPLOAD_AVATAR: 'users/upload-avatar',
        PROFILE: 'users/profile',
        PASSWORD: 'users/password',
    }
};

export const API_CONFIG = {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/',
    TIMEOUT: 15000,
};
