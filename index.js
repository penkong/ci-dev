//for form to get data from
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');

const dbPg = require('./config/db/db-postgresql');
dbPg.authenticated()
    .then(() => console.log('dbPg connected ...'))
    .catch(err => console.log(err));

const app = express();
// Body Parser
app.use(bodyParser.urlencoded({
    extended: false
}));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));