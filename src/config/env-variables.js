const dotenv = require('dotenv');
dotenv.config();


module.exports = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    AWS_REGION: process.env.AWS_REGION,
    BUCKET_NAME: process.env.BUCKET_NAME,    
    AWS_ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
}