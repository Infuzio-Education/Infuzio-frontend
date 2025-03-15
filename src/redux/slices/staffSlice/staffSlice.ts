import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Privilege } from "../../../types/Types";

interface StaffInfo {
    regNumber: string | null;
    token: string;
    staffToken: string;
    staffID: number;
    name: string;
    idCardNumber: string | null;
    profilePicLink: string | null;
    isTeachingStaff: boolean;
    sectionIDs: number[];
    schoolName: string;
    schoolCode: string;
    specialPrivileges: Privilege[];
    isClassTeacher: boolean;
    classTeacherClassID: number;
}

interface StaffState {
    staffInfo: StaffInfo | null;
}

const storedStaffInfo = localStorage.getItem("staffInfo");

const initialState: StaffState = {
    staffInfo: storedStaffInfo ? JSON.parse(storedStaffInfo) : null,
};

const staffSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setStaffInfo: (state, action: PayloadAction<StaffInfo>) => {
            state.staffInfo = action.payload;
            localStorage.setItem("staffInfo", JSON.stringify(action.payload));
        },
        updateStaffInfo: (state, action: PayloadAction<Partial<StaffInfo>>) => {
            if (state.staffInfo) {
                state.staffInfo = {
                    ...state.staffInfo,
                    ...action.payload,
                } as StaffInfo;
            }
        },

        logout: (state) => {
            state.staffInfo = null;
            localStorage.removeItem("staffInfo");
        },
    },
});

export const { setStaffInfo, updateStaffInfo, logout } = staffSlice.actions;

export default staffSlice.reducer;
