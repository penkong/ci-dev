//
const Sequelize = require('sequelize');
const config = require('config');
const dbFunc = require('../config/db/db-func');

module.exports = app => {

    app.post('/ci', (req, res) => {
        const { domainName, ciName } = req.body;
        if (!config.has(`${domainName}`)) return;
        const domain = config.get(`${domainName}`);
        const {
            prefix,
            cn: { dbName, user, password, host },
            providerType
        } = domain;
        const db = dbFunc(dbName, user, password, host, providerType)
        try {
            db.query(`SELECT * FROM ${prefix}.${ciName}`)
                .then(response => {
                    res.send(response[0]);
                })

        } catch (error) {
            console.log(error);
        }
    })
}