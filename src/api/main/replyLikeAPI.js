import { privateAxios } from "../axios";

export const likeReply = async (replyId, config) => {
    try {
        const response = await privateAxios.post(`/replies/${replyId}/like`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
