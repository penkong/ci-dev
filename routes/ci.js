//
const Sequelize = require('sequelize');
const config = require('config');

module.exports = app => {
    app.post('/ci', (req, res) => {
        //      { 
        //          "domainName":	"domain1",
        //          "ciName":"ci_ac_input"
        //      }
        const { domainName, ciName } = req.body;
        if (!config.has(`${domainName}`)) return;
        const domain = config.get(`${domainName}`);
        const {
            prefix,
            cn: { dbName, user, password, host },
            providerType
        } = domain;
        // const registerDB = dbRegister(dbName, providerType, password, host)
        // registerDB
        //     .authenticated()
        //     .then(() => console.log('connected to postgres ...'))
        //     .catch(err => console.log(err));
        const dbPg = new Sequelize(dbName, providerType, password, {
            host: host,
            dialect: providerType,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        });
        //----------------------
        // now we need to take info
        // select * from  sth;
        dbPg.query(`SELECT * FROM ${prefix}.${ciName}`)
            .then(res => console.log(res))
            .catch(err => console.log(err.message))
        res.send('ok');
    })
}