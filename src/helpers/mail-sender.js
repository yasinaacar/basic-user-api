const nodemailer=require("nodemailer");
const APIError = require("../utils/errors");
const host=process.env.EMAIL_HOST;
const port=process.env.EMAIL_PORT;
const ciphers=process.env.EMAIL_CIPHERS;
const email=process.env.EMAIL_ADRESS;
const password=process.env.EMAIL_PASSWORD;

const sendMail=async (mailOptions)=>{
    const transporter= nodemailer.createTransport({
        //this settings are for outlook, u can design by your project
        host: host,
        port: port,
        secure: false,
        tls:{
            ciphers: ciphers
        },
        auth:{
            user: email,
            pass: password
        }
    });

    await transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log("Something went wrong while sending the email",err)
            throw new APIError("Something went wrong while sending the email")
        }
        console.log(`Sended Mail Infos : ${info}`);
        return true
    });

};

module.exports=sendMail;

