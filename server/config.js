require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || '3000',

    DB_HOST: process.env.DB_HOST || '172.17.0.2',
    DB_PORT: process.env.DB_PORT || '27017',
    DB_NAME: process.env.DB_NAME || 'autdmc'
};
