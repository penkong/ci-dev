//
const Sequelize = require('sequelize');

module.exports = new Sequelize('DbEstate', 'sa', '1', {
    host: '192.168.100.188',
    dialect: 'mssql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});