const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({

    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    }

}, {timestamps: true});

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;

