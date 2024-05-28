const initialState = {
    profile: null,
    accessToken: null,
    refreshToken: null,
};

const AuthenReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER_PROFILE":
            return {
                ...state,
                profile: action.payload,
            };
        case "SET_ACCESS_TOKEN":
            return {
                ...state,
                accessToken: action.payload,
            };
        case "SET_REFRESH_TOKEN":
            return {
                ...state,
                refreshToken: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                profile: null,
                accessToken: null,
                refreshToken: null,
            };
        default:
            return state;
    }
};

export default AuthenReducer;
