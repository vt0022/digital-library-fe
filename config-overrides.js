const { override, useBabelRc } = require("customize-cra");

module.exports = override(useBabelRc(), (config) => {
    return {
        ...config,
        ignoreWarnings: [
            {
                module: /node_modules\/flowbite/,
            },
        ],
    };
});
