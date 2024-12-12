import { configureStore } from "@reduxjs/toolkit";
import superAdminReducer from "../slices/superAdminSlice/superAdminSlice";
import staffReducer from "../slices/staffSlice/staffSlice";

const store = configureStore({
    reducer:{
        superAdminInfo:superAdminReducer,
        staffInfo:staffReducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;