const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id:  mongoose.Types.ObjectId, 
    user: {type: mongoose.Types.ObjectId , ref: 'User'},
    product: {type: mongoose.Types.ObjectId, ref: 'Product'}
})

const Favorite = module.exports = mongoose.model('Favorite', schema);
