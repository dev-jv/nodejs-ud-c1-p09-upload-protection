const express = require('express');
let {verifyToken, verifyAdmin_Role} = require('../middlewares/authentication');
let app = express();
let Category = require('../models/category');

app.get('/category', verifyToken, (req, res) => {

    Category.find({})
        .sort('description') // ...
        .populate('user', 'name email') // shows attributes inside user
        .exec((err, categories) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categories,
            });
        });
});

app.get('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, '', {},(err, categoryDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoryDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Incorrect ID!'
                }
            });
        }
        res.json({
            ok: true,
            ct: categoryDB
        });
    });
});

app.post('/category', verifyToken, (req, res) => {
    let body = req.body;

    let ctg = new Category({
        description: body.description,
        user: req.user._id
    });

    ctg.save((err, categoryDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if(!categoryDB) {
            return res.status(400).json({
               ok: false,
               err
            });
        }
        res.json({
            ok: true,
            ct: categoryDB
        })
    })
});

app.put('/category/:id', [verifyToken, verifyAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let des = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, des, {
        new: true,
        context: 'query',
        runValidators:true
    }, (err, categoryDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            oK: true,
            ct: categoryDB
        });
    });
});

app.delete('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Non-existent ID!'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Category deleted!',
            ct: categoryDB
        })
    })
});

module.exports = app;
