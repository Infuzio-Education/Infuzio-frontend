import Api from './axiosConfig';
import superAdminEndpoints from '../endpoints/superAdmin';
import axios from 'axios';


export const superLogin = async(body:string)=>{
    try {
        const response = await Api.post(superAdminEndpoints.login, body);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const getSyllabus = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.syllabus);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const createSchool = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.createSchool);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

