// --------- define schema for postgresql ---------
const Sequelize = require('sequelize');
const dbPg = require('../config/db/db-postgresql');

const Cipg = dbPg.define(`safa_ci`, {
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

module.exports = Cipg;