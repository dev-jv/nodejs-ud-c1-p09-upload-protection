
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let categorySchema = new Schema({
    description: { type: String, required: [true, 'La descripción es obligatoria'], unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

categorySchema.plugin(uniqueValidator, { message: '{PATH} debe ser único'});

module.exports = mongoose.model('Category', categorySchema); // la colección se llamará... categories
