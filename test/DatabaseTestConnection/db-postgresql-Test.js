const Sequelize = require('sequelize');

module.exports = new Sequelize('NGO_Iran', 'postgres', '1', {
    host: '192.168.100.188',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});