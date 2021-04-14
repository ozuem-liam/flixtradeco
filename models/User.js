const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    secretquestion: {
        type: String,
        require: true
    },
    secretanswer: {
        type: String,
        require: true
    },
    wallet: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    totalDeposit: {
        type: Number,
        default: 0
    },
    depositHistory: [],
    amount: {
        type: Number,
        default: 0
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;