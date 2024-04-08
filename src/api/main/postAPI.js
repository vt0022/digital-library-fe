import axios, { privateAxios } from "../axios";

export const getAllPosts = async (config) => {
    try {
        const response = await axios.get("/posts", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAPost = async (postId) => {
    try {
        const response = await privateAxios.get(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAPostForGuest = async (postId) => {
    try {
        const response = await axios.get(`/posts/${postId}/guest`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addAPost = async (data) => {
    try {
        const response = await privateAxios.post(`/posts`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editAPost = async (postId, data) => {
    try {
        const response = await privateAxios.put(`/posts/${postId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPostsOfUser = async (userId, config) => {
    try {
        const response = await axios.get(`/posts/user/${userId}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAPost = async (postId) => {
    try {
        const response = await privateAxios.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getHistoryOfPost = async (postId) => {
    try {
        const response = await axios.get(`/posts/${postId}/history`);
        return response.data;
    } catch (error) {
        throw error;
    }
};