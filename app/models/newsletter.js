const mongoose = require('mongoose');
const Schema = mongoose.Schema


const schema = new Schema({
    _id: mongoose.Types.ObjectId,
    email: {type: String,required: true},
    subscribe_status: {type:String},
    date: {type:Date, default:Date.now}
})

const Newsletter = module.exports = mongoose.model('Newsletter',schema); 