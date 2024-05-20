import { privateAxios } from "../axios";

export const getMyNotifications = async (config) => {
    try {
        const response = await privateAxios.get("/notifications/mine", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const countMyNotifications = async () => {
    try {
        const response = await privateAxios.get("/notifications/mine/count");
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const readMyNotification = async (notiId) => {
    try {
        const response = await privateAxios.put(`/notifications/${notiId}/read`, "");
        return response.data;
    } catch (error) {
        throw error;
    }
};

