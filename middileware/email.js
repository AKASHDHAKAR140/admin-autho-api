const nodemailer = require('nodemailer');
const dotenv = require('dotenv') 
dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
async function sendEmail(to, subject, html) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
    };
    await transporter.sendMail(mailOptions);
}
module.exports = { sendEmail };
