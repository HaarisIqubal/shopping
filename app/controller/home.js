const Product = require('../models/product');
const User = require('../models/user');
const mongoose = require('mongoose');
const Design = require('../models/design');
const Newsletter = require('../models/newsletter');

module.exports.get_all_data = (req,res,next)=>{
    Product.find({'product_status': true},{},(err,allProduct)=>{
        if (err) throw err;
        Product.find({'product_status':true},{},{limit:2,sort:{'product_likes': 'desc'}},(err,likeProduct)=>{

            User.find({"type": {"$regex": "designer", "$options": "i" }},{},(err,artists)=>{

            if (err) throw err;
            if(!req.isAuthenticated()){
                res.render('home',{
                    products: allProduct,
                    likeProduct: likeProduct,
                    artists:artists,
                    siteTitle: 'Artophilic', 
                    isAuthenticated: false});
            }
            else{
                res.render('home',{
                    products: allProduct,
                    likeProduct: likeProduct, 
                    user: req.user._id,
                    isAuthenticated: true,
                    artists:artists,
                    siteTitle: 'Artophilic', 
                    level: req.user.level});
            }
        
        })
        
        })
    })  
}

module.exports.get_all_products = (req,res,next) => {
    Product.find({'product_status': true},{},{sort: {"product_likes":"asc"}},(err,products)=>{
        //console.log(products)
        res.render('product_all',{products:products,
            siteTitle:'All Products',
            isAuthenticated:req.isAuthenticated()});
    })
}

module.exports.get_product_details = (req,res,next) => {
    Product.findById(req.params.productID,(err,productDetail)=>{

        if(!req.isAuthenticated()){
            res.render('home_product_description',{
                productDetail: productDetail,
                siteTitle: "Product Detail",
                isAuthenticated: false
            })
        }else{
            res.render('home_product_description',{
                productDetail: productDetail,
                siteTitle: "Product Detail",
                isAuthenticated: true
            })
        }
            
    })
}

module.exports.get_search = (req,res,next) => {
    
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({$or:[{'product_name': regex,'product_status': true},{'product_type': regex, 'product_status': true}]},{}).sort({'product_likes' : 'desc'}).exec((err,searchProduct)=>{
            if (err) {
                console.log(err)
            }else{
                if(searchProduct.length == 0){
                    var errors = []
                    errors.push({msg: 'No Item Found'})
                    if(!req.isAuthenticated()){
                        return res.render('home_search',{errors,
                            Products:searchProduct,
                            siteTitle: "Search Product",
                            isAuthenticated:false})
                    }else{
                        return res.render('home_search',{errors,
                            Products:searchProduct,
                            siteTitle: "Search Product",
                            isAuthenticated:true})
                    }  
                }else{
                    if(!req.isAuthenticated()){
                        return res.render('home_search',{Products:searchProduct,
                            siteTitle: "Search Product",
                            isAuthenticated:false})
                    }else{
                        return res.render('home_search',{Products:searchProduct,
                            siteTitle: "Search Product",
                            isAuthenticated:true})
                    }
                }
            }
                        
        })
    }
    else{
        //Not item found by your query
        Product.find({'product_status': true},{},(err,allProduct)=>{
            if (err) throw err;
            Product.find({'product_status':true},{},{limit:4,sort:{'product_likes': 'desc'}},(err,likeProduct)=>{
                //console.log(likeProduct)
                if (err) throw err;
                if(!req.isAuthenticated()){
                    var errors = []
                    errors.push({msg: 'No Query Found'})
                    res.render('home',{
                        products: allProduct,
                        likeProduct: likeProduct,
                        siteTitle: "Search Product", 
                        isAuthenticated: false,
                        errors
                    });
                }
                else{
                    res.render('home',{
                        products: allProduct,
                        likeProduct: likeProduct, 
                        user: req.user._id,
                        siteTitle: "Search Product",
                        isAuthenticated: true, 
                        level: req.user.level});
                }
            })
        })
    }
}

//Getting Data Profile of Designer
module.exports.get_artist_profile = (req,res,next) => {
    const userID = req.params.userID;
    User.findById(userID,{},(err,artist)=>{
        Design.find({"designer_id": userID},{},(err,designs)=>{

        
        if(err){
            return res.write("!Err")
        }else{
            console.log(artist)
            res.render('home_artist_profile',{artist,designs})
        }
        })
    
    
    })
}

//Newsletter Subscription Form
module.exports.post_subscribe_newsletter = (req,res,next) =>{
    const email = req.body.email

    Newsletter.find({"email": email},{},(err,callback) => {
        if(err) {
            console.log(err)
            return res.write("Not working");
        }else{
            if(callback.length >= 1){
                console.log("Email Already subscribed");
                req.flash('warning_msg','You are already subscribed');
                return res.redirect('/')
            }else{
                const newsletter = new Newsletter({
                    _id: new mongoose.Types.ObjectId() ,
                    email: email,
                    subscribe_status: "Subscribed",
                    date: Date.now()
                });
                newsletter.save()
                .then(result=>{
                    req.flash('success_msg','You are now subscribed for Newsletter');
                    return res.redirect('/');
                })
                .catch(err=>{
                    console.log(err)
                }) 
                
            }
        }
    })

    
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};