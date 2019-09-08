// sample 
// {
//   "id": 3,
//   "domainName": "water",
//   "ciName": "ci_ac_input"
// }

const config = require('config');
const dbFunc = require('../config/db/db-func');

module.exports = app => {

    // delete row from table

    app.post('/ci-del', (req, res) => {
        // get info from route
        const {
            id,
            domainName,
            ciName
        } = req.body;

        // edge case handle
        if (typeof id !== 'number')
            return res.status(404).send('please correct your data input!');
        if (!config.has(`${domainName}`))
            return res.status(404).send('Wrong Input');

        // check domain exist
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
        const db = dbFunc(dbName, user, password, host, providerType);

        // exec logic
        try {
            // check for id
            // if id is acceptable add to db.
            db
                .query(
                    `DELETE FROM ${prefix}.${ciName} WHERE "id" = '${id}'`
                )
                .then(response => {
                    res.send(`Success.id ${id} deleted.`);
                });
        }
        // error handler
        catch (error) {
            console.log(error);
            res.status(404).send('please use correct info')
        };
    })
}