import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StaffInfo {
    // username: string;
    token: string;
}

interface StaffState {
    staffInfo: StaffInfo | null;
}

const storedStaffInfo = localStorage.getItem('staffInfo');

const initialState: StaffState = {
    staffInfo: storedStaffInfo ? JSON.parse(storedStaffInfo) : null
};

const staffSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setStaffInfo: (state, action: PayloadAction<StaffInfo>) => {
            state.staffInfo = action.payload;
            localStorage.setItem('staffInfo', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.staffInfo = null;
            localStorage.removeItem('staffInfo')
        }
    }
});

export const { setStaffInfo, logout } = staffSlice.actions;

export default staffSlice.reducer;
