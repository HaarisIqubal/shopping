const Product = require('../../models/product')
const mongoose = require('mongoose');

//Dashboard

module.exports.get_dashboard = (req,res,next)=>{
    const options = {
        page: 1,
        limit: 10,
        collation: {
            locale: 'en'
        }
    }

    Product.paginate({},options,(err,result)=>{
        if(err){
            //console.log(err);
        }else{
            //console.log(result);
            res.render('./admin/product_dashboard',
            {products : result.docs,
             totalProduct: result.totalDocs,
             totalPage: result.totalPages,
             currentPage: result.page,
            });
        }   
    }) 
}

module.exports.get_dashboard_page = (req,res)=>{
    const options = {
        page: req.params.pageNum,
        limit: 10,
        sort: { "product_status": -1 },
        collation: {
            locale: 'en'
        }
    }

    Product.paginate({},options,(err,result)=>{
        if(err){

        }else{
            res.render('./admin/product_dashboard',
            {products : result.docs,
             totalProduct: result.totalDocs,
             totalPage: result.totalPages,
             currentPage: result.page
            });
        }   
    })
}


//Products Add/Edit/Delete

module.exports.get_add_product = (req,res,next)=> {
        res.render('./admin/product_add');
}

module.exports.post_add_product = (req,res,next)=> {
    const {productName,type, sellerPrice, productQuantity,marginPrice,userID,designerID} = req.body
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
        product_type: type,
        product_seller_price : sellerPrice,
        product_margin_price : marginPrice,
        product_total_price: productTotalPrice,
        product_quantity: productQuantity,
        product_likes: 0,
        product_status: true,
        product_image: productImage,
        user_id: userID,
        designer_id: designerID
    })

    product.save()
    .then(products=>{
        return res.redirect('/admin/products/dashboard');
    })
    .catch(err=>{
        return res.render('product_add');
    })
}

module.exports.get_edit_product = (req,res,next) => {
    const productID = req.params.productId;
    Product.findById(productID,(err,products)=>{
        if (err) throw err;
        res.render('./admin/product_edit',{products:products});
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
        'product_status':true,
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
        res.redirect('/admin/products/dashboard');
    })

}

module.exports.delete_product_byID = (req,res) => {
    const productID = req.params.productId;
    Product.findByIdAndDelete(productID,(err,success)=>{
        if (err) throw err;
    });
}

module.exports.get_all_data = (req,res,next)=>{
    Product.find({},{},(err,products)=>{
        res.render('product_show',{products: products, level: req.user.level});
    });   
}

