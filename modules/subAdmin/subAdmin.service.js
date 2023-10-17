const jwt = require('jsonwebtoken');
const db = require('../../db');
const { sendEmail } = require("../../middileware/email")

module.exports = {
    authenticate,
    register,
};

function omitHash(subAdmin) {
    const { hash, ...subAdminWithoutHash } = subAdmin;
    return subAdminWithoutHash;
}


async function authenticate({ username, password }) {
    try {
        const subAdmin = await db.SubAdmin.scope('withHash').findOne({ where: { email: username } });
        if (!subAdmin) {
            throw new Error('Username or password is incorrect');
        }
        const isPasswordValid = (password === subAdmin.hash);
        if (!isPasswordValid) {
            throw new Error('Username or password is incorrect');
        }
        if (subAdmin.status === 0) {
            throw new Error('First verify with admin, then login');
        }

        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 1);

        const token = jwt.sign({ sub: subAdmin.id, exp: expirationTime.getTime() / 1000 }, process.env.SECRETSTRING);

        return { ...omitHash(subAdmin.get()), token, expiresAt: expirationTime.toISOString() };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function register(params) {
    const existingSubAdmin = await db.SubAdmin.findOne({ where: { email: params.email } });
    if (existingSubAdmin) {
        throw 'Email is already registered';
    }

    const subAdmin = new db.SubAdmin(params);
    const hash = params.password;

    subAdmin.hash = hash;
    // console.log(subAdmin,"subAdmin")
    const user = await subAdmin.save();
    // console.log("!!!!!!!!!!!",user.hash)
    const emailHTML = `
        <div style="background-color: #f5f5f5; padding: 20px;">
            <div style="text-align: center;">
                <img src=${process.env.LOGO} style="width: 250px;height: 50px;">
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 5px 0px #ccc;">
                <p style="font-size: 18px;"><strong>Hi ${user.firstName} ${user.lastName},</strong></p>
                <p>Welcome to Lifetime lotto as an Admin.</p>
                <p><strong>Your Login Details:</strong></p>
                <ul>
                    <li><strong>ID:</strong> ${user.email}</li>
                    <li><strong>Password:</strong> ${user.hash}</li>
                </ul>
                <p>Welcome to Lifetime Lotto,</p>
                <p>The team at Lifetime Lotto.</p>
            </div>
        </div>
    `;

    const subject = 'Welcome to Lifetime Lotto';

    // sendEmail(user.email, subject, emailHTML)
    // .then(() => {
    //     console.error('Email sent successfully');

    // })
    // .catch((error) => {
    //     console.error('Email sending failed:', error);
    // });
    return user;
}
