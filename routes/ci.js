//

const getConfig = require('../utils/getConfig');
const dbFunc = require('../db/db-func');
const redisClient = require('../utils/redisClient');
const redisHelper = require('../utils/redisHelper');

module.exports = app => {
    //--------------------------------------------------------------------------------
    // add row to table
    app.post('/ci/addrow', async(req, res) => {
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
                response ? res.send([{
                    id,
                    title
                }]) : 'something wrong';
            } catch (error) {
                console.log(error);
                res.status(404).send('please use correct info')
            };
        })
        //-----------------------------------------------------------------------
        // get a ci table
    app.post('/ci/get', async(req, res) => {
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
                const {
                    keyForRedis,
                    cachedVal
                } = await redisHelper(user, ciName, domainName, providerType);

                if (cachedVal) return res.send(JSON.parse(cachedVal));
                const response = await db.query(`SELECT * FROM ${prefix}.${ciName}`);
                redisClient.setex(keyForRedis, 40000, JSON.stringify(response[0]));
                res.send(JSON.parse(cachedVal) || response[0]);
            } catch (error) {
                console.log(error);
                res.status(404).send('please use correct info')

            }
        })
        //------------------------------------------------------------------------------
        // get all ci list
    app.post('/ci/getcilist', async(req, res) => {
            // get info from route
            const {
                domainName
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
        //--------------------------------------------------------------------------------
        // delete row from table
    app.post('/ci/delete', async(req, res) => {
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
            const {
                keyForRedis,
                cachedVal
            } = await redisHelper(user, ciName, domainName, providerType);
            // if id is acceptable add to db.
            const response = await db.query(`DELETE FROM ${prefix}.${ciName} WHERE "id" = '${id}'`);
            if (cachedVal) {
                const arr = JSON.parse(cachedVal).filter(item => item.id !== id);
                redisClient.set(keyForRedis, JSON.stringify(arr));
            }
            response ? res.send(`Success.id ${id} deleted.`) : 'something wrong';
        } catch (error) {
            console.log(error);
            res.status(404).send('please use correct info')
        };
    })
}