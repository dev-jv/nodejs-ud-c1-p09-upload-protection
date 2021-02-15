const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: [true, 'A name is required'] },
    unitPrice: { type: Number, required: [true, 'The unit price is required'] },
    description: { type: String, required: false },
    img: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // ref is important to use populate!
    user: { type: Schema.Types.ObjectId, ref: 'User' } // ref is important to use populate!
});

module.exports = mongoose.model('Product', productSchema); // The colecction name would be... products!!!
