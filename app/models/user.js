const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id:  mongoose.Types.ObjectId,
    user_name: {type:String,require: true},
    email:  {type:String, require: true},
    password: {type:String,require:true},
    full_name: {type:String, required: true},
    about: {type:String},
    profile_image:{type:String}, 
    type: {type: String},
    cart: [{
        _id: mongoose.Types.ObjectId,
        product_id: {
            type: String
        }
    }],
    favorite: [{
        product_id: {
            type: Schema.Types.ObjectId ,
            ref: 'Product'
        }
    }],
    order: [{
        _id: mongoose.Types.ObjectId,
        products_id: [],
        date: {
            type: Date,
            default: Date.now
        }
    }],
    likes: [{
        _id: mongoose.Types.ObjectId,
        product_id: {
            type: String
        }
    }]
})

const User = module.exports = mongoose.model('User',schema);

//Cart Position
module.exports.addCart = (info,cb) => {
    id = info['id']
    user_id = info['user_id']
    product_id = info['product_id']
    
    User.findByIdAndUpdate(user_id,{$push:{"cart": {_id: id,product_id: product_id}  
    }},{safe:true,upsert:true},cb)
}

module.exports.deleteCart = (info,cb) => {
    user_id = info['user_id']
    product_id = info['product_id']
    
    User.findByIdAndUpdate(user_id,{$pull:{"cart": {_id: product_id}  
    }},{safe:true,upsert:true},cb)
}

module.exports.deleteAllCart = (info,cb)=>{
    user_id = info['user_id']   
    User.update({_id: user_id},{ $set : {cart: []}},cb)
}


//Favorite Position
module.exports.addFavorite = (info,cb) => {

    id = info['id']
    user_id = info['user_id']
    product_id = info['product_id']
    User.findByIdAndUpdate(user_id,{$push:{"favorite": {_id: id,product_id: product_id}  
    }},{safe:true,upsert:true},cb)
}

module.exports.deleteFavorite = (info,cb) => {
    user_id = info['user_id']
    product_id = info['product_id']

    User.findByIdAndUpdate(user_id,{$pull:{"favorite":{_id: product_id}
    }},{safe:true,upsert:true},cb)
}


//Ordering Position

module.exports.doneOrder = (info,cb) => {
    id = info['id']
    user_id = info['user_id']
    products_id = info['product_id']
    date = new Date()
    
    User.findByIdAndUpdate(user_id,{$push:{"order": {_id: id,date: date}  
    }},{safe:true,upsert:true},cb)
    


    User.findById(user_id,(err,user)=>{
        if(err) throw err;
        const lastOrderId = user.order.slice(-1)[0]._id
        //console.log(cb.order.slice(-1)[0]._id);

        User.update({'order[0]._id': lastOrderId}, {$push: {'order.0.$.products_id': 123}},{safe:true,upsert:true})


        /*User.findOneAndUpdate({'_id' : user_id, 'order._id': lastOrderId} 
        ,{$push: [{'order[0].products_id': [123123]}]},{safe:true,upsert:true})*/
    })

}

//Profile Editing


//Like
module.exports.likeProduct = (info,cb) => {
    id = info['id']
    user_id = info['user_id']
    product_id = info['product_id']
    User.find({'likes': {$in: {product_id}}},(err,result)=>{
        if(err) throw err;
        console.log(result);
    })
    /*
    User.findByIdAndUpdate(user_id,{$push:{"likes": {_id: id,product_id: product_id}  
    }},{safe:true,upsert:true},cb)*/
}