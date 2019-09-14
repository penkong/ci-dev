//-----------------------------------------------
const redisClient = require('./redisClient');
module.exports = async(user, ciName, domainName, providerType) => {
    const keyForRedis = JSON.stringify({
        user: user,
        ciName: ciName,
        domainName: domainName,
        providerType: providerType
    });
    const cachedVal = await redisClient.get(keyForRedis);
    return { keyForRedis, cachedVal };
}