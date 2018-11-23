require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || '3000',

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_HOST || '27017',
    DB_NAME: process.env.DB_NAME || 'autdmc'
};
