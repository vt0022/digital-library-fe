import { privateAxios } from "../axios";

export const getMyNotifications = async (config) => {
    try {
        const response = await privateAxios.get("/notifications/mine", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
