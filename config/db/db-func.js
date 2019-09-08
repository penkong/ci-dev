//
const Sequelize = require('sequelize');

module.exports = (dbName, user, password, host, providerType) => {

    return new Sequelize(dbName, user, password, {
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