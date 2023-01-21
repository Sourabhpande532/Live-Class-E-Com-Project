const transporter = require("../config/traspotar.Schema");
const config = require("../config/index.js");
// const { options } = require("../config/traspotar.Schema");

const mailHelper = async(options)=>{
    //simple we have craft the massage
    const message = {
        from: config.SMTP_MAIL_EMAIL, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
        // html: "<b>Hello world?</b>", // html body
      }
      await transporter.sendMail(message)
}

module.exports = mailHelper;

//let's go to controllers forgotpassword
