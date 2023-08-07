const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "\\..\\.env")
});

const env = {
    LOCAL_PORT: process.env.LOCAL_PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    LOCAL_MONGODB_URI: process.env.LOCAL_MONGODB_URI,
    LOCAL_CLIENT_URL: process.env.LOCAL_CLIENT_URL,
    REMOTE_CLIENT_URL: process.env.REMOTE_CLIENT_URL,
    ALLOWED_DOMAINS: (
        process.env.NODE_ENV === 'production' ?
            [
                process.env.REMOTE_CLIENT_URL,
                process.env.REMOTE_SERVER_URL
            ] :
            [
                process.env.LOCAL_CLIENT_URL,
                process.env.LOCAL_SERVER_URL
            ]
    )
};

module.exports = env;