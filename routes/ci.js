//

const config = require('config');
const express = require('express');
// const dbPg = require('./config/db/db-postgresql');

module.exports = app => {
    app.post('/ci', (req, res) => {
    //      { 
    //          "domainName":	"domain1",
    //          "ciName":"ci_ac_input"
    //      }
        const { domainName, ciName } = req.body;
        if(!config.has(`${domainName}`)) return; 
        const domain = config.get(`${domainName}`);
        const { 
            prefix, 
            cn: {dbName, user,  password, host}, 
            providerType
        } = domain;
        res.send(password);
    })
}