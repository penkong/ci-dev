//---------------------------------------------------------
const mongoose = require('mongoose')
const Redis = require('redis')
const { promisify } = require('util')

const redisUrl = 'redis://127.0.0.1:6379'
const redis = Redis.createClient(redisUrl);

redis.get = promisify(redis.get)
redis.hget = promisify(redis.hget)


const exec = mongoose.prototype.Query.exec;

mongoose.Query.prototype.catch = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
}
mongoose.Query.prototype.exec = function() {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    )

    // see if we have a value for 'key' in redis
    const catchValue = await redis.hget(this.hashKey, key);

    // if we do return that
    if (catchValue) {
        const doc = JSON.parse(catchValue)

        return Array.isArray(doc) ?
            doc.map(d => new this.model(d)) :
            new this.model(d);
    }
    // otherwise, issue the Query and store the result in redis
    const result = await exec.apply(this, arguments);

    redis.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
    return result
}

module.exports = {
    clearHash(hashKey) {
        redis.del(JSON.stringify(hashKey))
    }
};