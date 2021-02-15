const express = require('express');

const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

const fileUpload = require('express-fileupload');

const app = express();
app.use(fileUpload());

// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }));

app.put('/upload/:type/:id', function (req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if(!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No file has been selected'
                }
            });
    }

    let validTypes = ['products', 'users'];

    if(validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            er: {
                message: 'The types allowed are ' + validTypes.join(', ')
            }
        });
    }

    let file = req.files.fi;
    // console.log(req.files.fi);
    // console.log(file.name);
    let cutName = file.name.split('.');
    let extension = cutName[cutName.length - 1];

    let validExtensions = ['png', 'jpg', 'gif', 'jpge'];

    if(validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Allowed extensions are ' + validExtensions.join(', '),
                ext: extension
            }
        })
    }

    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if(err)
            return res.status(500).json({
                ok:false,
                err
            });

        if(type === 'users') {
            userImage(id, res, fileName);
        } else {
            productImage(id, res, fileName);
        }
    })
});

function userImage(id, res, fileName) {

    User.findById(id, (err, userDB) => {
        if(err) {
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!userDB) {
            deleteFile(fileName, 'users');
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Non-existent user'
                }
            })
        }

        deleteFile(userDB.img, 'users');

        userDB.img = fileName;

        userDB.save((err, userSave) => {
            res.json({
                ok: true,
                user: userSave,
                img: fileName
            });
        });
    })
}

function productImage(id, res, fileName) {
    Product.findById(id, (err, productDB) => {
        if(err) {
            deleteFile(fileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productDB) {
            deleteFile(fileName, 'products');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Non-existent product'
                }
            })
        }

        deleteFile(productDB.img, 'products');

        productDB.img = fileName;

        productDB.save((err, productSave) => {
            res.json({
                ok:true,
                product: productSave,
                img: fileName
            })
        })
    });
}

function deleteFile(imgName, type) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${type}/${imgName}`);

    if(fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;
