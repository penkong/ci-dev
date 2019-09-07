//

const express = require('express');

module.exports = app => {
    app.get('/cisql', (req, res) => {
        res.send('ci from sql');
    })
}