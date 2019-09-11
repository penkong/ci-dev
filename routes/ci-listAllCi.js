// sample 
// {
//     "domainName": "water"
// }

const config = require('config');
const dbFunc = require('../config/db/db-func');

module.exports = app => {

    // get all ci list
    app.post('/ci-get-all', async(req, res) => {
        // get info from route
        const { domainName } = req.body;

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

        // exec logic
        try {
            // connect related db base on domain name
            const db = await dbFunc(dbName, user, password, host, providerType);
            let arr = [];
            const response = await db.query(`SELECT "table_name" FROM ${prefix}.GetCi`);
            const mapResult = response => {
                for (let el of response[0]) {
                    arr.push(el["table_name"]);
                }
                return arr;
            }
            res.send(mapResult(response));
        }
        // error handler
        catch (error) {
            console.log(error);
            res.status(404).send('please use correct info');
        }
    })
}