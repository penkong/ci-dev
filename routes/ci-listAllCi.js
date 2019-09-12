// sample 
// {
//     "domainName": "water"
// }
const getConfig = require('../services/getConfig');
const dbFunc = require('../db/db-func');
const redisClient = require('../services/redisClient');

module.exports = app => {

    // get all ci list
    app.post('/ci-get-all', async(req, res) => {
        // get info from route
        const { domainName } = req.body;
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
            const keyForRedis = JSON.stringify({
                user: user,
                domainName: domainName,
                providerType: providerType
            });
            const cachedVal = await redisClient.get(keyForRedis);
            if (cachedVal) return res.send(JSON.parse(cachedVal));
            let arr = [];
            const response = await db.query(`SELECT "table_name" FROM ${prefix}.GetCi`);
            const mapResult = response => {
                for (let el of response[0]) {
                    arr.push(el["table_name"]);
                }
                return arr;
            }
            redisClient.setex(keyForRedis, 600, JSON.stringify(mapResult(response)));
            res.send(mapResult(response));
        } catch (error) {
            console.log(error);
            res.status(404).send('please use correct info');
        }
    })
}