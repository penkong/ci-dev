// --------- define schema for postgresql ---------
const Sequelize = require('sequelize');
const dbPg = require('../config/db/db-postgresql');

const CIPostgres = dbPg.define('ci-pg', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = CIPostgres;