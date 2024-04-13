import axios from "../axios";

export const getBadgesOfUser = async (userId) => {
    try {
        const response = await axios.get(`/badges/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
