import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, API_ROUTES } from '../constants/apiRoutes';
import { logger } from '../utils/logger';

// 1. Create Axios Instance
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const setupAxiosInterceptors = (store) => {
    // 2. Request Interceptor
    apiClient.interceptors.request.use(
        async (config) => {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
            return config;
        },
        (error) => {
            logger.error('API Request Error', error);
            return Promise.reject(error);
        }
    );

    // 3. Response Interceptor
    apiClient.interceptors.response.use(
        (response) => {
            logger.debug(`API Response: ${response.status} ${response.config.url}`, response.data);

            const { success, message, data } = response.data;

            if (success === false) {
                const errorMessage = message || 'Operation failed at backend';

                // Show Global Toast for business errors (Still 200 OK but success: false)
                if (store) {
                    store.dispatch({
                        type: 'ui/addToast',
                        payload: { id: Date.now(), type: 'error', message: errorMessage }
                    });
                }

                const customError = new Error(errorMessage);
                customError.isBusinessError = true;
                customError.response = response;
                return Promise.reject(customError);
            }

            // Unbox the data if it exists (Standardized Envelope handling)
            // If the response follows { success, message, data }, return data.
            // Otherwise, return response.data as is.
            return data !== undefined ? data : response.data;
        },
        async (error) => {
            const config = error.config;

            // Handle Network Errors (No Response from Server)
            if (!error.response) {
                const networkMsg = 'Network error. Please check your internet connection.';
                // Only show Toast if it's not a background refresh/cancelled request
                if (store && config) {
                    store.dispatch({
                        type: 'ui/addToast',
                        payload: { id: Date.now(), type: 'error', message: networkMsg }
                    });
                }
                return Promise.reject(new Error(networkMsg));
            }

            // Handle Unauthorized (401) - Special case for Logout/Session Refresh
            if (error.response.status === 401 && config && !config._retry) {
                // Skip global logout redirect for login attempts (they are supposed to return 401 on wrong pass)
                const isLoginRequest = config.url?.includes(API_ROUTES.AUTH.LOGIN);

                if (!isLoginRequest) {
                    config._retry = true;
                    try {
                        logger.warn('Token expired or invalid, logging out...');
                        await SecureStore.deleteItemAsync('userToken');
                        await SecureStore.deleteItemAsync('userData');

                        if (store) {
                            store.dispatch({ type: 'auth/logout/fulfilled' });
                            store.dispatch({
                                type: 'ui/addToast',
                                payload: { id: Date.now(), type: 'error', message: 'Session expired. Please login again.' }
                            });
                        }
                        return Promise.reject(new Error('Session expired. Please login again.'));
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
            }

            // Extract the most descriptive error message possible
            const serverMessage = error.response?.data?.message || error.message || 'Something went wrong';

            // Global Toast for all API errors (4xx, 5xx) - No exceptions
            if (store) {
                store.dispatch({
                    type: 'ui/addToast',
                    payload: { id: Date.now(), type: 'error', message: serverMessage }
                });
            }

            return Promise.reject(new Error(serverMessage));
        }
    );
};

export default apiClient;
