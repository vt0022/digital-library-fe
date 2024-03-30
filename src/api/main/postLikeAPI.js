import { privateAxios } from "../axios";

export const likePost = async (postId, config) => {
    try {
        const response = await privateAxios.post(`/posts/${postId}/like`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
