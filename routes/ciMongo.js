//

const express = require('express');

module.exports = app => {
    app.get('/cipg', (req, res) => {
        res.send('ci from postgresql');
    })
    app.post('/')
}