import { createSlice } from '@reduxjs/toolkit';

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState: {
        plans: [],
        activePlan: null,
        modules: [],
        loading: false,
    },
    reducers: {
        setPlans: (state, action) => {
            state.plans = action.payload;
        },
        setActivePlan: (state, action) => {
            state.activePlan = action.payload;
        },
        setModules: (state, action) => {
            state.modules = action.payload;
        }
    },
});

export const { setPlans, setActivePlan, setModules } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
