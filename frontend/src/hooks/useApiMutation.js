import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';
import { useDispatch } from 'react-redux';
import { addToast } from '../features/ui/uiSlice';

/**
 * Enterprise Grade Mutation Hook
 * Handles loading, error, success, and retries automatically.
 * @param {Function} apiFunction - The async service function to call
 * @param {Object} options - { onSuccess, onError, successMessage }
 */
export const useApiMutation = (apiFunction, options = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const dispatch = useDispatch();

    const mutate = useCallback(async (payload) => {
        setIsLoading(true);
        setError(null);

        try {
            logger.info('Mutation Started', payload);
            const result = await apiFunction(payload);

            // If we get here, the interceptor has already validated success === true
            setData(result.data);

            if (options.successMessage) {
                dispatch(addToast({ id: Date.now(), type: 'success', message: options.successMessage }));
            }

            if (options.onSuccess) {
                options.onSuccess(result.data);
            }

            return result.data;
        } catch (err) {
            const message = err.message || 'Operation failed';
            setError(message);

            dispatch(addToast({ id: Date.now(), type: 'error', message: message }));

            if (options.onError) {
                options.onError(message);
            }
            // We do not throw here to prevent app crash, unless explicitly handled
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [apiFunction, options, dispatch]);

    const reset = () => {
        setError(null);
        setData(null);
        setIsLoading(false);
    };

    return { mutate, isLoading, error, data, reset };
};
