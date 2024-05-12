const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");

module.exports = {
    plugins: [new NodePolyfillPlugin()],

    resolve: {
        fallback: {
            fs: false,
            tls: false,
            net: false,
            path: false,
        },

        modules: [path.resolve(__dirname, "./src"), "node_modules"],

        alias: {
            api: path.resolve(__dirname, "./src/api"),
            assets: path.resolve(__dirname, "./src/assets"),
            components: path.resolve(__dirname, "./src/components"),
            pages: path.resolve(__dirname, "./src/pages"),
            routers: path.resolve(__dirname, "./src/routers"),
        },
    },
};
