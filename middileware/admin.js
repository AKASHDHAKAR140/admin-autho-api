
const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = admin;

function admin() {
    return async (req, res, next) => {
        console.log("first")
        const authorizationHeader = req.headers["authorization"]
        console.log(authorizationHeader, "authorizationHeader");

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {

            return res.status(401).json({ message: 'Unauthorized' });

        }

        const token = authorizationHeader.replace('Bearer ', '');

        try {
            const decoded = jwt.verify(token, process.env.SECRETSTRING, { algorithms: ['HS256'] });

            const admin = await db.Admin.findOne({ where: { id: decoded.sub } });

            if (!admin) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user = admin.get();
            console.log(req.user, "req.user")
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };
}
