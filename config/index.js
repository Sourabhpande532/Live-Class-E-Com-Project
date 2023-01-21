// new way of doing it's work with defferent approche few programmer write like this

import dotevn from "dotenv";
dotevn.config();

const config = {
JWT_SECRET: process.env.JWT_SECRET,
JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
MONGODB_URL: process.env.MONGODB_URL,
PORT: process.env.PORT,
SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
SMTP_MAIL_EMAIL: process.env.SMTP_MAIL_EMAIL
    
}
module.exports = config;


