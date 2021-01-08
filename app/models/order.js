const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


const schema = new Schema({
    user: {type: mongoose.Types.ObjectId , ref: 'User'},
    cart: {type: Object, require: true},
    address: {type: String, require: true},
    name: {type: String, require: true},
    date: {type: Date,default: Date.now()},
    order_status: {type: String, default: "Progress"}
})

schema.plugin(mongoosePaginate)

const Order = module.exports = mongoose.model('Order', schema);

Order.paginate().then({});