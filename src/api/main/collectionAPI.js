import axios, { privateAxios } from "../axios";

export const getPublicCollections = async (config) => {
    try {
        const response = await axios.get("/collections/public", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCollections = async (config) => {
    try {
        const response = await privateAxios.get("/collections", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDetailCollection = async (slug) => {
    try {
        const response = await privateAxios.get(`/collections/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyCollections = async (config) => {
    try {
        const response = await privateAxios.get("/collections/mine", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDetailCollectionForGuest = async (slug) => {
    try {
        const response = await axios.get(`/collections/${slug}/public`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addNewCollection = async (data) => {
    try {
        const response = await privateAxios.post("/collections", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editCollection = async (collectionId, data) => {
    try {
        const response = await privateAxios.put(`/collections/${collectionId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCollection = async (collectionId) => {
    try {
        const response = await privateAxios.delete(`/collections/${collectionId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addDocumentToCollection = async (collectionId, docId) => {
    try {
        const response = await privateAxios.post(`/collections/${collectionId}/document/${docId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeDocumentFromCollection = async (collectionId, docId) => {
    try {
        const response = await privateAxios.delete(`/collections/${collectionId}/document/${docId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


