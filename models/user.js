const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    stocks:[
        {
            type:String,
        }
    ],
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

const user = mongoose.model('user', userSchema)
module.exports = user;