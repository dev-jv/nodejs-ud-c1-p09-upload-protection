const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let categorySchema = new Schema({
    description: { type: String, required: [true, 'A description is required'], unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' } // ref is important to use populate!
});

categorySchema.plugin(uniqueValidator, { message: '{PATH} must be unique'});

module.exports = mongoose.model('Category', categorySchema); // The colecction name would be... categories!!
