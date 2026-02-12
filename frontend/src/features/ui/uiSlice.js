import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        theme: 'light', // or 'dark'
        toasts: [],
    },
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        addToast: (state, action) => {
            state.toasts.push(action.payload);
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(t => t.id !== action.payload);
        }
    },
});

export const { toggleTheme, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
