const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../db');


module.exports = {
    authenticate,
    register
};

async function authenticate({ username, password }) {
    const admin = await db.Admin.scope('withHash').findOne({ where: { email: username } });
    if (!admin || !(await bcrypt.compare(password, admin.hash))) {
        throw 'Username or password is incorrect';
    }
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 1);
    const token = jwt.sign({ sub: admin.id, exp: expirationTime.getTime() / 1000 }, process.env.SECRETSTRING);
    return { ...omitHash(admin.get()), token, expiresAt: expirationTime.toISOString() };
}

async function register(params) {
    const existingAdmin = await db.Admin.findOne({ where: { email: params.email } });
    if (existingAdmin) {
        throw 'Email is already registered';
    }
    const admin = new db.Admin(params);
    const saltRounds = 10;
    const hash = await bcrypt.hash(params.password, saltRounds);
    admin.hash = hash;
    const user = await admin.save();
    return user;
}

function omitHash(admin) {
    const { hash, ...adminWithoutHash } = admin;
    return adminWithoutHash;
}