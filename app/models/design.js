const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    designer_id : {type: mongoose.Types.ObjectId, ref: 'User'},
    design_name : {type: String},
    status: {type: String},
    expected_price : {type: Number},
    design_image : {type: String, require: true},
    date : {type: Date, default: Date.now()}
})


const Design = module.exports = mongoose.model('Design', schema);