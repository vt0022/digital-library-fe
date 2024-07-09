import axios, { privateAxios } from "../axios";

export const uploadImage = async (data, config) => {
    try {
        const response = await privateAxios.post("/images", data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
