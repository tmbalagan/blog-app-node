const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new mongoose.Schema({
    title: String,
    user_id: { type: Schema.Types.ObjectId, ref: 'user' },
    text: String,
    comments: [], //{"text":"blah blah", user_id: "", like: [{user_id: "", created_at: new Date().getTime()}]}
    status: { type: Number, default: 1 },    // 1 is-Active, 0 is in-Active
    share: [], //{ user_id (who shared to whom): "", created_at: new Date().getTime()}
}, { timestamps: true, versionKey: false })

// articleSchema.index({"comments._id": 1}, {unique: true});

module.exports = mongoose.model("article", articleSchema)