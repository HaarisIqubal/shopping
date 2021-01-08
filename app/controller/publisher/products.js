const Product = require('../../models/product');
const mongoose = require('mongoose');

module.exports.get_all_data = (req,res,next)=>{
    Product.find({},{},(err,products)=>{
        res.render('product_show',{products: products, level: req.user.level});
    });   
}

//Dashboard

module.exports.get_dashboard = (req,res,next)=>{
    const options = {
        page: 1,
        limit: 10,
        collation: {
            locale: 'en'
        }
    }

    Product.paginate({'user_id': req.user._id,'product_status': true},options,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.render('product_dashboard',
            {products : result.docs,
             totalProduct: result.totalDocs,
             totalPage: result.totalPages,
             currentPage: result.page,
             isAuthenticated: req.isAuthenticated(),
             level: req.user.level
            });
        }   
    })

   /* Product.find({},{},(err,products)=>{
        res.render('product_dashboard',{products: products});
    }); */  
}

module.exports.get_dashboard_page = (req,res)=>{
    const options = {
        page: req.params.pageNum,
        limit: 10,
        collation: {
            locale: 'en'
        }
    }

    Product.paginate({'user_id': req.user._id},options,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.render('product_dashboard',
            {products : result.docs,
             totalProduct: result.totalDocs,
             totalPage: result.totalPages,
             currentPage: result.page,
             isAuthenticated: req.isAuthenticated(),
             level: req.user.level
            });
        }   
    })
}

//Products Add/Edit/Delete

module.exports.get_add_product = (req,res,next)=> {
    if(req.user.level === 'publisher'){
        res.render('product_add',{
            isAuthenticated: true,
            level: req.user.level});
    }else{
        res.redirect('/consumer/dashboard')
    }
    
}

module.exports.post_add_product = (req,res,next)=> {
    const {productName, sellerPrice, productQuantity} = req.body
    const user_id = req.user._id
    const productType = "Shirt"
    const marginPrice = 300
    const productTotalPrice = parseInt(sellerPrice) + parseInt(marginPrice) 

    if(req.file){
        var productImage = req.file.filename
        console.log(req.file);
    } else{
        var productImage = 'noimage.jpg'
    }

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        product_name: productName,
        product_type: productType,
        product_seller_price : sellerPrice,
        product_margin_price : marginPrice,
        product_total_price: productTotalPrice,
        product_quantity: productQuantity,
        product_likes: 0,
        product_image: productImage,
        user_id: user_id
    })

    product.save()
    .then(products=>{
        //console.log(products);
        return res.redirect('/'+ req.user.level +'/products/dashboard');
    })
    .catch(err=>{
        //console.log(err)
        return res.render('product_add');
    })
}

module.exports.get_edit_product = (req,res,next) => {
    const productID = req.params.productId;
    Product.findById(productID,(err,products)=>{
        if (err) throw err;
        res.render('product_edit',{products:products, isAuthenticated: req.isAuthenticated(),level: req.user.level});
    })
}

module.exports.post_edit_product = (req,res,next) => {
    const {productName,productSellerPrice,productQuantity} = req.body
    const productMarginPrice = 300
    const productTotalPrice = parseInt(productSellerPrice) + parseInt(productMarginPrice)
    //const productName = req.body.productName
    //const productSellerPrice  = req.body.sellerPrice
    //const productQuantity = req.body.productQuantity
    
    if (req.file){
        var productImage = req.file.filename
    } else{
        var productImage = 'noimage.jpg'
    }

    const query = {_id: req.params.productId}

    Product.findOneAndUpdate(query,{$set:{
        'product_status':false,
        'product_name':productName,
        'product_seller_price': productSellerPrice,
        'product_margin_price': productMarginPrice,
        'product_quantity': productQuantity,
        'product_total_price': productTotalPrice,
        'product_image': productImage}},(err,result)=>{
        if (err) {
        //console.log(err)
        };
        //console.log(result);
        res.redirect('/'+req.user.level+'/products/dashboard');
    })

}

module.exports.delete_product_byID = (req,res) => {
    const productID = req.params.productId;
    Product.findByIdAndDelete(productID,(err,success)=>{
        if (err) throw err;
        console.log(success);
        res.redirect('/'+ req.user.level +'/products/dashboard');
    });
}

//Order Path

module.exports.get_orders = (req,res) => {
    res.render('product_order',{
                isAuthenticated: true,
                level : req.user.level
    })
}

//Like Path
module.exports.post_like_product = (req,res) => {
    const productID = req.params.productID;
    const query = {_id: productID}
    Product.findOneAndUpdate(query,{$inc:{'product_likes':1}},(err,result)=>{
        if (err) throw err;
        return res.status(200).json({
            msg: "Completes"
        })
        //console.log(result)
    })
}

module.exports.get_likes_product_count = (req,res) => {
    const productID = req.params.productID;

    Product.findById(productID,{},(err,result)=> {
        return res.status(200).json({
            count: result.product_likes
        })
    })
}