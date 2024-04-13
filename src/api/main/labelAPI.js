import axios from "../axios";

export const getActiveLabels = async () => {
    try {
        const response = await axios.get('/labels/active');
        return response.data;
    } catch (error) {
        throw error;
    }
};
