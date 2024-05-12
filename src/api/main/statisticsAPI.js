import { privateAxios } from "../axios";

export const getGeneralStatistics = async (config) => {
    try {
        const response = await privateAxios.get("/statistics/general/admin", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getGeneralStatisticsForManager = async (config) => {
    try {
        const response = await privateAxios.get("/statistics/general/manager", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getYearlyStatistics = async (config) => {
    try {
        const response = await privateAxios.get("/statistics/yearly/admin", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getYearlyStatisticsForManager = async (config) => {
    try {
        const response = await privateAxios.get("/statistics/yearly/manager", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};