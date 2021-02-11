const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/authentication');

const Product = require('../models/product');

app.get('/products', verifyToken, (req, res) => {

    let frm = req.query.frm || 0;
    frm = Number(frm);

    Product.find({available: true})
        .skip(frm)
        .limit(5)
        .populate('user', 'name email') // shows attributes inside user
        .populate('category', 'description') // shows attributes inside category
        .exec((err, products) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products
            })
        })
});

app.get('/products/:id', (req, res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email') // shows attributes inside user
        .populate('category', 'description') // shows attributes inside category
        .exec((err, productDB) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Non-existent ID!'
                    }
                });
            }
            res.json({
                ok: true,
                productDB
            })
        })
});

app.get('/products/search/:term', verifyToken, (req, res) => {

    let term = req.params.term;
    let regex = new RegExp(term, 'i');

    Product.find({name: regex})
        // .populate('category', 'name')
        .exec((err, products) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                products
            })
        })

});

app.post('/products', verifyToken, (req, res) => {

    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            product: productDB
        })
    });
});

app.put('/products/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Non-existent ID!'
                }
            });
        }

        productDB.name = body.name;
        productDB.unitPrice = body.unitPrice;
        productDB.description = body.description;
        productDB.available = body.available;
        productDB.category = body.category;

        productDB.save(err, (err, productSave) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                product: productSave
            })
        })
    });
});

app.delete('/products/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id,(err, productDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Non-existent ID!'
                }
            });
        }

        productDB.available = false;

        productDB.save(err, (err, productDel) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                product: productDel,
                message: 'Deleted product'
            })
        })
    })
});

module.exports = app;
