import axios, { privateAxios } from "../axios";

export const getReply = async (postId, config) => {
    try {
        const response = await privateAxios.get(`/posts/${postId}/replies`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getReplyForGuest = async (postId, config) => {
    try {
        const response = await axios.get(`/posts/${postId}/replies/guest`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addReply = async (postId, data) => {
    try {
        const response = await privateAxios.post(`/posts/${postId}/reply`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
