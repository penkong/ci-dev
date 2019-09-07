// ------------- libs and modules ----------------------
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
// ------------- Postgresql connection ----------------
const dbPg = require('./config/db/db-postgresql');
// TEST Postresql connection
dbPg.authenticate()
    .then(() => console.log('connected to postgres ...'))
    .catch(err => console.log(err));
// ------------------ App Initialize ----------------
const app = express();
//------------------ middleware -------------------
// Body Parser = for form to get data from
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// ------------------- Routes ------------------
// landing route
app.get('/', (req, res) => res.send('index from landing page'));
// ci
require('./routes/ci')(app);
// ---------------- Listen and exec -------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));