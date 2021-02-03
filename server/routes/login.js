const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');

app.post('/login', (req, res) => {
    res.json({
        ok: true,
    });
});

module.exports = app;
