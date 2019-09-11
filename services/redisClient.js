const Redis = require('redis')
const {
    promisify
} = require('util')

// register promises.
const redisUrl = process.env.REDIS_PORT || 'redis://127.0.0.1:6379';
const redisClient = Redis.createClient(redisUrl);

// make redis accept promises
redisClient.get = promisify(redisClient.get);
redisClient.hget = promisify(redisClient.hget);

// module.exports = (prefix, user, dbName, ciName, providerType) => {
//     const keyForRedis = JSON.stringify({
//         prefix: prefix,
//         user: user,
//         dbName: dbName,
//         ciName: ciName,
//         providerType: providerType
//     });
//     const cachedVal = await redisClient.get(keyForRedis);
//     if (cachedVal) return res.send(JSON.parse(cachedVal));

// }

// redisClient.setex(keyForRedis, 20, JSON.stringify(response[0]));
module.exports = redisClient;