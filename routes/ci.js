//

const getConfig = require('../services/getConfig');
const dbFunc = require('../db/db-func');
const redisClient = require('../services/redisClient');
module.exports = app => {

    // get a ci table
    app.post('/ci-get', async(req, res) => {
        // get info from route
        const {
            domainName,
            ciName
        } = req.body;
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
                ciName: ciName,
                domainName: domainName,
                providerType: providerType
            });
            const cachedVal = await redisClient.get(keyForRedis);
            if (cachedVal) return res.send(JSON.parse(cachedVal));
            const response = await db.query(`SELECT * FROM ${prefix}.${ciName}`);
            redisClient.setex(keyForRedis, 30, JSON.stringify(response[0]));
            res.send(response[0]);
        }
        // error handler
        catch (error) {
            console.log(error);
            res.status(404).send('please use correct info')

        }
    })
}