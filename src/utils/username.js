export const getUsername = (email) => {
    const username = email.split("@")[0];
    return username;
};
