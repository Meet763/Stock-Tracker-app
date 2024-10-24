const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stock:{
        type: String,
        required: true
    }
})

const stock = mongoose.model('stock', stockSchema)
module.exports = stock;