import { createSlice } from "@reduxjs/toolkit";

const storedSuperAdminInfo = localStorage.getItem('superAdminInfo');

const initialState = {
    superAdminInfo: storedSuperAdminInfo ? JSON.parse(storedSuperAdminInfo) : null
};

const superAdminSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSuperAdminInfo: (state, action) => {
            state.superAdminInfo = action.payload;
            localStorage.setItem('superAdminInfo', JSON.stringify(action.payload));
        },
        logout:(state) => {
            state.superAdminInfo = null;
            localStorage.removeItem('superAdminInfo')
        }
    }
});

export const { setSuperAdminInfo,logout } = superAdminSlice.actions;

export default superAdminSlice.reducer;
