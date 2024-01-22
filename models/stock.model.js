const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    open: {
        type: Number,
        required: true
    },
    high: {
        type: Number,
        required: true
    },
    low: {
        type: Number,
        required: true
    },
    close: {
        type: Number,
        required: true
    },
    last: {
        type: Number,
        required: true
    },
    priceHistory: [
        {
            date: {
                type: String,
                required: true
            },
            open: {
                type: Number,
                required: true
            },
            high: {
                type: Number,
                required: true
            },
            low: {
                type: Number,
                required: true
            },
            close: {
                type: Number,
                required: true
            },
            last: {
                type: Number,
                required: true
            }
        }
    ]
    

}, {timestamps: true});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;

