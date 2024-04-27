import { privateAxios } from "../axios";
import axios from "../axios";

export const getReviewsOfOrganization = async (organizationId, config) => {
    try {
        const response = await privateAxios.get(`/organizations/${organizationId}/reviews`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyReviews = async (config) => {
    try {
        const response = await privateAxios.get("/reviews/mine", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const approveAReview = async (reviewId, config) => {
    try {
        const response = await privateAxios.put(`/reviews/${reviewId}/approval`, "", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editAReview = async (reviewId, data) => {
    try {
        const response = await privateAxios.put(`/reviews/${reviewId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAReview = async (reviewId, config) => {
    try {
        const response = await privateAxios.delete(`/reviews/${reviewId}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getReviewsOfDocument = async (slug, config) => {
    try {
        const response = await axios.get(`/documents/${slug}/reviews`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const countReviewsOfDocument = async (slug) => {
    try {
        const response = await axios.get(`/documents/${slug}/reviews/count`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkReviewedStatus = async (slug, config) => {
    try {
        const response = await privateAxios.get(`/documents/${slug}/reviewed`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postAReview = async (docId, data, config) => {
    try {
        const response = await privateAxios.post(`/documents/${docId}/review`, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};