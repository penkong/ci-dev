const Sequelize = require('sequelize');
const dbPg = require('../config/db/db-postgresql');

const Gig = dbPg.define('gig', {
    id: {
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING
    }
})

module.exports = Gig;