// sample 
// {
//   "id": 3,
//   "title": "240 ولت، 15 آمپر، تکفاز",
//   "domainName": "water",
//   "ciName": "ci_ac_input"
// }

const config = require('config');
const dbFunc = require('../config/db/db-func');

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
        if (!config.has(`${domainName}`))
            return res.status(404).send('Wrong Input');

        // check domain exist
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


        // exec logic
        try {
            // connect related db base on domain name
            const db = await dbFunc(dbName, user, password, host, providerType);
            // if id is acceptable add to db.
            const response = await db
                .query(`INSERT INTO ${prefix}.${ciName} ("id", "title") VALUES ('${id}', '${title}')`);
            response ? res.send([{ id, title }]) : 'something wrong';
        }
        // error handler
        catch (error) {
            console.log(error);
            res.status(404).send('please use correct info')
        };
    })
}