import axios, { privateAxios } from "../axios";

export const getAllPosts = async (config) => {
    try {
        const response = await axios.get("/posts", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllPostsForAdmin = async (config) => {
    try {
        const response = await privateAxios.get("/posts/all", config);
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

export const getPostsOfUser = async (userId, config) => {
    try {
        const response = await axios.get(`/posts/user/${userId}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllPostsOfUser = async (userId, config) => {
    try {
        const response = await privateAxios.get(`/posts/all/user/${userId}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRelatedPosts = async (config) => {
    try {
        const response = await privateAxios.get("/posts/related", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRelatedPostsForAPost = async (postId, config) => {
    try {
        const response = await axios.get(`/posts/related/${postId}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const likePost = async (postId, config) => {
    try {
        const response = await privateAxios.post(`/posts/${postId}/like`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const acceptPost = async (postId) => {
    try {
        const response = await privateAxios.post(`/posts/${postId}/accept`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const undoAcceptPost = async (postId) => {
    try {
        const response = await privateAxios.post(`/posts/${postId}/undo-accept`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPostLikes = async (config) => {
    try {
        const response = await privateAxios.get("/posts/user/likes", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};