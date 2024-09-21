import { configureStore } from "@reduxjs/toolkit";
import superAdminSlice from "../slices/superAdminSlice/superAdminSlice";


const store = configureStore({
    reducer:{
        superAdminInfo:superAdminSlice
    }
})

export default store;