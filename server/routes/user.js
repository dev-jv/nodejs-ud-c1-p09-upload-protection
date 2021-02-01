const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', (req, res) => {

    let des = req.query.des || 0;
    des = Number(des);

    let lim = req.query.lim || 5;
    lim = Number(lim);

   User.find({})
       .skip(des) // desde...
       .limit(lim) // cantidad..
       .exec((err, usuarios) => {
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            User.count({}, (err, ctr) => {
               res.json({
                   ok: true,
                   usuarios,
                   cantidad: ctr 
               })
            });
       });
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save( (err, userDB) => {

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    // let body = req.body;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']); // excepto.. password, google

    // delete body.password;
    // delete body.google;

    User.findByIdAndUpdate(id, body, {
        new: true, // Devuelve el obj actualizado
        runValidators: true, // Permite las validaciones
        context: 'query', // Permite mongoose-unique-validator
        upsert: true // Permite la creación del obj si este no existe
    },(err, userDB) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB,
        });
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete Usuario');
});

module.exports = app;
