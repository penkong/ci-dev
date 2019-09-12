// sample 
// {
//   "id": 3,
//   "title": "240 ولت، 15 آمپر، تکفاز",
//   "domainName": "water",
//   "ciName": "ci_ac_input"
// }
const getConfig = require('../services/getConfig');
const dbFunc = require('../db/db-func');
const redisClient = require('../services/redisClient');
const redisHelper = require('../helpers/redisHelper');

module.exports = app => {

    // add row to table
    app.post('/ci-add', async(req, res) => {
        // get info from route
        const {
            id,
            title,
            domainName,
            ciName
        } = req.body;
        // edge case handle
        if (typeof id !== 'number' || typeof title !== 'string')
            return res.status(404).send('please correct your data input!');
        // check domain exist
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
            const {
                keyForRedis,
                cachedVal
            } = await redisHelper(user, ciName, domainName, providerType);
            // if id is acceptable add to db.
            const response = await db
                .query(`INSERT INTO ${prefix}.${ciName} ("id", "title") VALUES ('${id}', '${title}')`);
            if (cachedVal) {
                const arr = JSON.parse(cachedVal);
                arr.push({
                    id: id,
                    title: title
                });
                // console.log(arr);
                redisClient.set(keyForRedis, JSON.stringify(arr));
            }
            response ? res.send([{ id, title }]) : 'something wrong';
        } catch (error) {
            console.log(error);
            res.status(404).send('please use correct info')
        };
    })
}