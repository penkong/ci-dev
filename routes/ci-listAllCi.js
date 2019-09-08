// sample 
// {
//     "domainName": "water"
// }

const config = require('config');
const dbFunc = require('../config/db/db-func');

module.exports = app => {

    // get all ci list

    app.post('/ci-get-all', (req, res) => {
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

        // connect related db base on domain name
        const db = dbFunc(dbName, user, password, host, providerType);

        // exec logic
        try {
            db.query(`SELECT "table_name" FROM ${prefix}.GetCi`)
                .then(response => {
                    console.log(response);
                    let arr = [];
                    for (let el of response[0]) {
                        arr.push(el["table_name"]);
                    }
                    res.send(arr);
                })
        }
        // error handler
        catch (error) {
            console.log(error);
            res.status(404).send('please use correct info');
        }
    })
}