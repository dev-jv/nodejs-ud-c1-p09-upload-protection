const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verifyToken, verifyAdmin_Role} = require('../middlewares/authentication');

app.get('/user', verifyToken, (req, res) => {

    // return res.json({
    //     user: req.user,
    //     name: req.user.name,
    //     email: req.user.email,
    // });

    let frm = req.query.frm || 0;
    frm = Number(frm);

    let lim = req.query.lim || 10;
    lim = Number(lim);

   User.find({state: true}, 'name email role state google img') // Exception...
       .skip(frm) // from...
       .limit(lim) // limit..
       .exec((err, usuarios) => {
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            User.count({state: true}, (err, ctr) => {
               res.json({
                   ok: true,
                   usuarios,
                   cantidad: ctr
               })
            });
       });
});

app.post('/user', [verifyToken, verifyAdmin_Role], function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save( (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/user/:id', [verifyToken, verifyAdmin_Role], (req, res) => {
    let id = req.params.id;
    // let body = req.body;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']); // except.. password, google

    // delete body.password;
    // delete body.google;

    User.findByIdAndUpdate(id, body, {
        new: true, // Returns updated obj
        runValidators: true, // Allow validations
        context: 'query', // Allow mongoose-unique-validator
        upsert: true // Allow creation of the object if it does not exist
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

app.delete('/user/:id', verifyToken, (req, res) => {
    //------------------------------ <> Delete in DB
    // let id = req.params.id;
    // User.findByIdAndRemove(id, (err, userDel) => {
    //     if( err ) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if(userDel === null) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado!'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: userDel
    //     })
    // })
    //------------------------------ <> Change State to false
    let id = req.params.id;
    User.findByIdAndUpdate(id, {state: false}, { // update: {...}
        new: true, // Returns updated obj
        runValidators: true, // Allow validations
        context: 'query', // Allow mongoose-unique-validator
    }, (err, userDel) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(userDel === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found!'
                }
            });
        }
        res.json({
            ok: true,
            usuario: userDel
        })
    })
});

module.exports = app;
