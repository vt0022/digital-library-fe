import { privateAxios } from "../axios";

export const getAllPostReports = async (config) => {
    try {
        const response = await privateAxios.get("/reports/post", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const readPostReport = async (postReportId) => {
    try {
        const response = await privateAxios.put(`/reports/post/${postReportId}/read`, "");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reportPost = async (data) => {
    try {
        const response = await privateAxios.post("/reports/post", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePostReport = async (postReportId) => {
    try {
        const response = await privateAxios.delete(`/reports/post/${postReportId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const handlePostReport = async (postReportId, config) => {
    try {
        const response = await privateAxios.post(`/reports/post/${postReportId}/handle`, "", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllReplyReports = async (config) => {
    try {
        const response = await privateAxios.get("/reports/reply", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const readReplyReport = async (replyReportId) => {
    try {
        const response = await privateAxios.put(`/reports/reply/${replyReportId}/read`, "");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reportReply = async (data) => {
    try {
        const response = await privateAxios.post("/reports/reply", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteReplyReport = async (replyReportId) => {
    try {
        const response = await privateAxios.delete(`/reports/reply/${replyReportId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const handleReplyReport = async (replyReportId, config) => {
    try {
        const response = await privateAxios.post(`/reports/reply/${replyReportId}/handle`, "", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};