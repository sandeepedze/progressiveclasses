import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import subscriptionReducer from '../features/subscription/subscriptionSlice';
import schoolReducer from '../features/school/schoolSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        subscription: subscriptionReducer,
        school: schoolReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
