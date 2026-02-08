import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../../services';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.login(credentials);
            await SecureStore.setItemAsync('userToken', data.token);
            await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const restoreToken = createAsyncThunk(
    'auth/restoreToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                // Token exists, fetch fresh user data from the backend
                const data = await authService.getMe();

                // Flexible unboxing: handle { user: {...} } or {...user} directly
                const user = data.user || data;

                if (user && (user.id || user.email)) {
                    await SecureStore.setItemAsync('userData', JSON.stringify(user));
                    return { token, user };
                }
            }
            // No token, so we don't need to do anything
            return rejectWithValue('No token found');
        } catch (error) {
            // If getMe fails (e.g., invalid token), logout
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userData');
            return rejectWithValue(error.message || 'Session expired');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.logout();
            return response;
        } catch (error) {
            // Even if the API call fails, we want to log the user out locally.
            // We'll re-throw the error so the UI can show a notification.
            return rejectWithValue(error.message);
        } finally {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userData');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true, // Used ONLY for the initial token check/splash screen
        isActionLoading: false, // Used for buttons (login/logout)
        error: null,
    },
    reducers: {
        setProfileImage: (state, action) => {
            if (state.user) {
                state.user.profile_image = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isActionLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isActionLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            })
            .addCase(restoreToken.pending, (state) => {
                // ONLY show full screen loader if we don't have a user yet (Initial App Start)
                // If we already have a user, it's a background refresh (Profile update, etc)
                if (!state.user) {
                    state.isLoading = true;
                }
            })
            .addCase(restoreToken.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoading = false;
            })
            .addCase(restoreToken.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isActionLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isActionLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isActionLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setProfileImage } = authSlice.actions;
export default authSlice.reducer;
