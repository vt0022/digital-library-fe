import axios from "../axios";

const SIGN_UP_URL = "/auth/signup";
const LOGIN_URL = "/auth/login";
const LOGOUT_URL = "/auth/logout";
const SEND_EMAIL_URL = "/auth/sendEmail";
const VERIFY_URL = "/auth/verify";

export const logout = async (config) => {
    try {
        const response = await axios.post(LOGOUT_URL, "", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const login = async (data) => {
    try {
        const response = await axios.post("/auth/login", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginWithGoogle = async (data) => {
    try {
        const response = await axios.post("/auth/login/google", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const signupWithGoogle = async (data) => {
    try {
        const response = await axios.post("/auth/signup/google", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const signup = async (data, config) => {
    try {
        const response = await axios.post("/auth/signup", data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (data, config) => {
    try {
        const response = await axios.post(SIGN_UP_URL, data, config);
        return response.data;
    } catch (error) {
        console.error("Error in register function:", error);
        throw error;
    }
};

export const sendEmail = async (config) => {
    try {
        const response = await axios.post(SEND_EMAIL_URL, "", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verify = async (config) => {
    try {
        const response = await axios.post(VERIFY_URL, "", config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
