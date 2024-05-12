import axios, { privateAxios } from "../axios";

export const getActiveSections = async () => {
    try {
        const response = await axios.get('/sections/active');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllSections = async (config) => {
    try {
        const response = await privateAxios.get("/sections/all", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSection = async (sectionId) => {
    try {
        const response = await privateAxios.get(`/sections/${sectionId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createSection = async (data) => {
    try {
        const response = await privateAxios.post("/sections", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateSection = async (sectionId, data) => {
    try {
        const response = await privateAxios.put(`/sections/${sectionId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteSection = async (sectionId) => {
    try {
        const response = await privateAxios.delete(`/sections/${sectionId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const activateSection = async (sectionId) => {
    try {
        const response = await privateAxios.put(`/sections/${sectionId}/activation`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getEditableSubsections = async () => {
    try {
        const response = await privateAxios.get("/sections/sub/editable");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllSubsections = async (config) => {
    try {
        const response = await privateAxios.get("/sections/sub/all", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSubsection = async (subsectionId) => {
    try {
        const response = await privateAxios.get(`/sections/sub/${subsectionId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createSubsection = async (data) => {
    try {
        const response = await privateAxios.post("/sections/sub", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateSubsection = async (subsectionId, data) => {
    try {
        const response = await privateAxios.put(`/sections/sub/${subsectionId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteSubsection = async (subsectionId) => {
    try {
        const response = await privateAxios.delete(`/sections/sub/${subsectionId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const activateSubsection = async (subsectionId) => {
    try {
        const response = await privateAxios.put(`/sections/sub/${subsectionId}/activation`);
        return response.data;
    } catch (error) {
        throw error;
    }
};