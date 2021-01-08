const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');


const schema = new Schema({
    _id:  mongoose.Types.ObjectId,
    product_name : {type:String,require: true},
    product_type : {type:String, require: true},
    product_seller_price: {type: Number, require: true},
    product_margin_price : {type: Number, require:true},
    product_total_price :  {type:Number, require: true},
    product_quantity : {type:Number,require:true},
    product_likes: {type:Number, require:true},
    product_likes_user: [{
        _id: mongoose.Types.ObjectId,
        user_id:{type: String, unique:true}
    }],
    product_status: {type: Boolean, default: false},
    product_image : {type:String, require: true},
    user_id: {type:String, require: true},
    designer_id: {type:String, require: true}
})

schema.plugin(mongoosePaginate);

const Product = module.exports = mongoose.model('Product',schema);

Product.paginate().then({});


//Like
module.exports.likeProduct = (info,cb) => {
    id = info['id']
    user_id = info['user_id']
    product_id = info['product_id']

    var getUserID = user_id
    Product.findById(product_id,{},(err,cbs)=>{

        console.log(cbs.product_likes_user.length);

        if(cbs.product_likes_user.length === 0){
            Product.findByIdAndUpdate(product_id,{$push:{"product_likes_user": {_id: id,user_id: getUserID}  
                }},{safe:true,upsert:true},cb)
        }else{
            for(var i=0; i <= cbs.product_likes_user.length; i++){
                if(cbs.product_likes_user[i].user_id = getUserID){
                    console.log("Also logged");
                    break; 
                 }else if(cbs.product_likes_user[i].user_id != getUserID){
                    console.log("Already logged") 
                    Product.findByIdAndUpdate(product_id,{$push:{"product_likes_user": {_id: id,user_id: getUserID}  
                    }},{safe:true,upsert:true},cb);   
                 } else{
                   console.log('Err'); 
                 }
             }
        }
        
        //console.log(cb.product_likes_user[0].user_id);
    })
    
    /*Product.find({'product_likes_user':  user_id},(err,result)=>{
        if(err) throw err;
        console.log(err);
    })*/
    
}