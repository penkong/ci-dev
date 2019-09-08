//
//
const Sequelize = require('sequelize');

module.exports = (dbName, providerType, password, host) => {

    return new Sequelize(dbName, providerType, password, {
        host: host,
        dialect: providerType,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    });
}