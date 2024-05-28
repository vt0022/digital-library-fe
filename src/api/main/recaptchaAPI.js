import axios from "../axios";

export const verifyRecaptcha = async (config) => {
    try {
        const response = await axios.post("/recaptcha/verify", "", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
