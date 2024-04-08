import axios from "../axios";

export const getActiveSections = async () => {
    try {
        const response = await axios.get('/sections/active');
        return response.data;
    } catch (error) {
        throw error;
    }
};
