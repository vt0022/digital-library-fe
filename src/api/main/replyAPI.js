import axios, { privateAxios } from "../axios";

export const getViewableRepliesOfPost = async (postId, config) => {
    try {
        const response = await privateAxios.get(`/posts/${postId}/replies`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllRepliesOfPost = async (postId, config) => {
    try {
        const response = await privateAxios.get(`/posts/${postId}/replies/all`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRepliesForGuest = async (postId, config) => {
    try {
        const response = await axios.get(`/posts/${postId}/replies/guest`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addAReply = async (postId, data) => {
    try {
        const response = await privateAxios.post(`/posts/${postId}/reply`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editAReply = async (replyId, data) => {
    try {
        const response = await privateAxios.put(`/replies/${replyId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAReply = async (replyId) => {
    try {
        const response = await privateAxios.delete(`/replies/${replyId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllRepliesOfUser = async (userId, config) => {
    try {
        const response = await privateAxios.get(`/replies/all/user/${userId}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getViewableRepliesOfUser = async (userId, config) => {
    try {
        const response = await axios.get(`/replies/user/${userId}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getHistoryOfReply = async (replyId) => {
    try {
        const response = await axios.get(`/replies/${replyId}/history`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const likeReply = async (replyId, config) => {
    try {
        const response = await privateAxios.post(`/replies/${replyId}/like`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const acceptReply = async (replyId) => {
    try {
        const response = await privateAxios.post(`/replies/${replyId}/accept`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const undoAcceptReply = async (replyId) => {
    try {
        const response = await privateAxios.post(`/replies/${replyId}/undo-accept`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getReplyLikes = async (config) => {
    try {
        const response = await privateAxios.get("/replies/user/likes", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
