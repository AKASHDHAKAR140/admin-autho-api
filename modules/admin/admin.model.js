const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        firstName: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false },
        phoneNo: { type: DataTypes.STRING, allowNull: true },
        hash: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 }
    };

    const options = {
        // timestamps: true,
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Admin', attributes, options);
}