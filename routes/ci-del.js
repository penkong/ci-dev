// sample 
// {
//   "id": 3,
//   "domainName": "water",
//   "ciName": "ci_ac_input"
// }
const getConfig = require('../services/getConfig');
const dbFunc = require('../db/db-func');
const redisClient = require('../services/redisClient');

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
            const keyForRedis = JSON.stringify({
                user: user,
                ciName: ciName,
                domainName: domainName,
                providerType: providerType
            });
            const cachedVal = await redisClient.get(keyForRedis);
            // connect related db base on domain name
            const db = await dbFunc(dbName, user, password, host, providerType);
            // if id is acceptable add to db.
            const response = await db.query(`DELETE FROM ${prefix}.${ciName} WHERE "id" = '${id}'`);
            if (cachedVal) {
                const arr = JSON.parse(cachedVal).filter(item => item.id !== id);
                console.log(arr);
                redisClient.set(keyForRedis, JSON.stringify(arr));
            }
            response ? res.send(`Success.id ${id} deleted.`) : 'something wrong';
        } catch (error) {
            console.log(error);
            res.status(404).send('please use correct info')
        };
    })
}