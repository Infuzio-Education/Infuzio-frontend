import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SuperAdminInfo {
    username: string;
    token: string;
}

interface SuperAdminState {
    superAdminInfo: SuperAdminInfo | null;
}

const storedSuperAdminInfo = localStorage.getItem('superAdminInfo');

const initialState: SuperAdminState = {
    superAdminInfo: storedSuperAdminInfo ? JSON.parse(storedSuperAdminInfo) : null
};

const superAdminSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSuperAdminInfo: (state, action: PayloadAction<SuperAdminInfo>) => {
            state.superAdminInfo = action.payload;
            localStorage.setItem('superAdminInfo', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.superAdminInfo = null;
            localStorage.removeItem('superAdminInfo')
        }
    }
});

export const { setSuperAdminInfo, logout } = superAdminSlice.actions;

export default superAdminSlice.reducer;
