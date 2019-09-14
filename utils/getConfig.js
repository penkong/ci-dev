//-----------------------------------------------------
const config = require('config');
module.exports = domainName => {
    if (!config.has(`${domainName}`))
        return res.status(404).send('Wrong Input');
    const domain = config.get(`${domainName}`);
    const {
        prefix,
        cn: {
            dbName,
            user,
            password,
            host
        },
        providerType
    } = domain;
    return {
        prefix,
        dbName,
        user,
        password,
        host,
        providerType
    }
}