// sample 
// {
//   "id": 3,
//   "domainName": "water",
//   "ciName": "ci_ac_input"
// }
const getConfig = require('../services/getConfig');
const dbFunc = require('../db/db-func');

module.exports = app => {

    // delete row from table
    app.post('/ci-del', async(req, res) => {
        // get info from route
        const {
            id,
            domainName,
            ciName
        } = req.body;
        // edge case handle
        if (typeof id !== 'number')
            return res.status(404).send('please correct your data input!');
        const {
            prefix,
            dbName,
            user,
            password,
            host,
            providerType
        } = getConfig(domainName);
        // exec logic
        try {
            // connect related db base on domain name
            const db = await dbFunc(dbName, user, password, host, providerType);
            // if id is acceptable add to db.
            const response = await db.query(`DELETE FROM ${prefix}.${ciName} WHERE "id" = '${id}'`);
            response ? res.send(`Success.id ${id} deleted.`) : 'something wrong';
        } catch (error) {
            console.log(error);
            res.status(404).send('please use correct info')
        };
    })
}