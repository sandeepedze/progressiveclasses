import { createSlice } from '@reduxjs/toolkit';

const schoolSlice = createSlice({
    name: 'school',
    initialState: {
        schools: [], // For Super Admin
        currentSchool: null, // For School Admin/Teacher
        stats: {},
        loading: false,
    },
    reducers: {
        setSchools: (state, action) => {
            state.schools = action.payload;
        },
        setCurrentSchool: (state, action) => {
            state.currentSchool = action.payload;
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        }
    },
});

export const { setSchools, setCurrentSchool, setStats } = schoolSlice.actions;
export default schoolSlice.reducer;
