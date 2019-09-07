// --------- define schema for postgresql ---------
const Sequelize = require('sequelize');
const dbPg = require('../config/db/db-postgresql');

const CIPostgres = dbPg.define('ci-pg', {
    id: {
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING
    }
})

module.exports = CIPostgres;



const Sequelize = require('sequelize')
const {
    sequelize
} = require('../startup/db')

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    age: {
        typeequelize.DOUBLE,
        allowNull: false,
    }

});

exports = User;