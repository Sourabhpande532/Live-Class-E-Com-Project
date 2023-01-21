const nodemailer = require("nodemailer");
const config = require("./index")

let transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.SMTP_MAIL_USERNAME, // generated ethereal user
      pass: config.SMTP_MAIL_PASSWORD, // generated ethereal password
    },
  });

  module.exports = transporter;

  /*can we create some utility in which 
    we creates some methods somebuddy want to 
    send email he just send it go and created*/

  /***********************************
 * @FORGOTPASSWORD
 * @search go and search google hot to send mail in node js cheack nodemailer
 * @route http://localhost:5000/api/auth/logout
 * @description for creating forgot password 
 * @parameter
 * @returns User Object
 * @Install package npm i nodemailer
 ***********************************/