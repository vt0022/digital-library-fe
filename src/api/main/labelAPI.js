import axios, { privateAxios } from "../axios";

export const getActiveLabels = async () => {
    try {
        const response = await axios.get('/labels/active');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllLabels = async (config) => {
    try {
        const response = await privateAxios.get("/labels/all", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getLabel = async (labelId) => {
    try {
        const response = await privateAxios.get(`/labels/${labelId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createLabel = async (data) => {
    try {
        const response = await privateAxios.post("/labels", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateLabel = async (labelId, data) => {
    try {
        const response = await privateAxios.put(`/labels/${labelId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteLabel = async (labelId) => {
    try {
        const response = await privateAxios.delete(`/labels/${labelId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const activateLabel = async (labelId) => {
    try {
        const response = await privateAxios.put(`/labels/${labelId}/activation`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
