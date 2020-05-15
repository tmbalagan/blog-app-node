const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    status: { type: Number, default: 1 },// 1 is-Active, 0 is in-Active
    country: String,
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('user', userSchema);