const express = require('express');

const app = express();
app.post('/workshop/register', (req, res) => {
    console.log(req.body['email']);

    res.send('dafuq')
})

module.exports = app;