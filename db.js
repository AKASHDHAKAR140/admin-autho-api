const mysql = require("mysql2/promise")
const Sequelize = require("sequelize")
const dotenv = require("dotenv")
dotenv.config();

initialize();

async function initialize() {
    const { DBUSER, DBDB, DBPASSWORD, DBHOST, DBPORT } = process.env;

    const connection = await mysql.createConnection({ host: DBHOST, port: DBPORT, user: DBUSER, password: DBPASSWORD })
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DBDB}\`;`);
    const sequelize = new Sequelize(
        DBDB,
        DBUSER,
        DBPASSWORD, {
        port: DBPORT,
        host: DBHOST,
        dialect: 'mysql',
        logging: false
    }
    )


    db.sequelize = sequelize;

    db.Admin = require("./modules/admin/admin.model")(sequelize);
    db.SubAdmin = require("./modules/subAdmin/subAdmin.model")(sequelize);


    db.Admin.hasMany(db.SubAdmin);
    db.SubAdmin.belongsTo(db.Admin);

    await sequelize.sync();

}
module.exports = db = {};