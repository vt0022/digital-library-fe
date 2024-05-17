import { privateAxios } from "../axios";

export const getAllPostAppeals = async (config) => {
    try {
        const response = await privateAxios.get("/appeals/post", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const readPostAppeal = async (postAppealId) => {
    try {
        const response = await privateAxios.put(`/appeals/post/${postAppealId}/read`, "");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const appealPost = async (data) => {
    try {
        const response = await privateAxios.post("/appeals/post", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePostAppeal = async (postAppealId) => {
    try {
        const response = await privateAxios.delete(`/appeals/post/${postAppealId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkPostAppeal = async (postReportId) => {
    try {
        const response = await privateAxios.get(`/appeals/post/${postReportId}/check`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const handlePostAppeal = async (postAppealId, config) => {
    try {
        const response = await privateAxios.post(`/appeals/post/${postAppealId}/handle`, "", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllReplyAppeals = async (config) => {
    try {
        const response = await privateAxios.get("/appeals/reply", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const readReplyAppeal = async (replyAppealId) => {
    try {
        const response = await privateAxios.put(`/appeals/reply/${replyAppealId}/read`, "");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const appealReply = async (data) => {
    try {
        const response = await privateAxios.post("/appeals/reply", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteReplyAppeal = async (replyAppealId) => {
    try {
        const response = await privateAxios.delete(`/appeals/reply/${replyAppealId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkReplyAppeal = async (replyReportId) => {
    try {
        const response = await privateAxios.get(`/appeals/reply/${replyReportId}/check`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const handleReplyAppeal = async (replyAppealId, config) => {
    try {
        const response = await privateAxios.post(`/appeals/reply/${replyAppealId}/handle`, "", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};