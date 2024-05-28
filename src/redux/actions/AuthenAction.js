const setUserProfile = (profile) => {
    return {
        type: "SET_USER_PROFILE",
        payload: profile,
    };
};

const setAccessToken = (token) => {
    return {
        type: "SET_ACCESS_TOKEN",
        payload: token,
    };
};

const setRefreshToken = (token) => {
    return {
        type: "SET_REFRESH_TOKEN",
        payload: token,
    };
};

const logout = () => {
    return {
        type: "LOGOUT",
    };
};

const authenAction = {
    setUserProfile,
    setAccessToken,
    setRefreshToken,
    logout,
};

export default authenAction;
