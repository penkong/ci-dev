//
const config = require('config');
const dbFunc = require('../config/db/db-func');

module.exports = app => {

    // get all ci

    app.post('/ci-get', (req, res) => {
        // get info from route
        const {
            domainName,
            ciName
        } = req.body;

        // check for domain exist and draw out info
        if (!config.has(`${domainName}`)) return;
        const domain = config.get(`${domainName}`);
        const {
            prefix,
            cn: {
                dbName,
                user,
                password,
                host
            },
            providerType
        } = domain;

        // connect related db base on domain name
        const db = dbFunc(dbName, user, password, host, providerType)

        // exec logic
        try {
            db.query(`SELECT * FROM ${prefix}.${ciName}`)
                .then(response => {
                    res.send(response[0]);
                })

        }
        // error handler
        catch (error) {
            console.log(error);
            res.status(404).send('please use correct info')

        }
    })
}