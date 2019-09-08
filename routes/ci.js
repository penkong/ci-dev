//
const Sequelize = require('sequelize');
const config = require('config');
const dbFunc = require('../config/db/db-func');
//      { 
//          "domainName":	"domain1",
//          "ciName":"ci_ac_input"
//      }


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
        db.query(`SELECT * FROM ${prefix}.${ciName}`)
            .then(res => console.log(res))
            .catch(err => console.log(err.message))
        res.send('ok');
    })
}