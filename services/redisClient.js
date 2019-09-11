//----------------------------------------------
const Redis = require('redis');
const {
    promisify
} = require('util')

// register.
const redisUrl = process.env.REDIS_PORT || 'redis://127.0.0.1:6379';
const redisClient = Redis.createClient(redisUrl);

// make redis accept promises
redisClient.get = promisify(redisClient.get);
redisClient.hget = promisify(redisClient.hget);
module.exports = redisClient;
//---------------------------------------------------------------------