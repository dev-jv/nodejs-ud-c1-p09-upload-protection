const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
    values: [ 'USER_ROLE', 'ADMIN_ROLE' ],
    message: '{VALUE} no es un rol válido'
};

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    state: {
        type: Boolean,
        default: 'true'
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único'});

module.exports = mongoose.model('User', userSchema); // la collecion se llamará... users
