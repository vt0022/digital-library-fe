import axios, { privateAxios } from "../axios";

export const getActiveSections = async () => {
    try {
        const response = await axios.get('/sections/active');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getEditableSubsections = async () => {
    try {
        const response = await privateAxios.get("/sections/editable");
        return response.data;
    } catch (error) {
        throw error;
    }
};
