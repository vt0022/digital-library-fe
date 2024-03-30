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
