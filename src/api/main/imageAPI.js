import axios from "../axios";

export const uploadImageForReply = async (data, config) => {
    try {
        const response = await axios.post("/replies/image", data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
