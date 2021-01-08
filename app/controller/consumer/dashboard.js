const User = require('../../models/user');
const Order = require('../../models/order');
const mongoose = require('mongoose');
const Product = require('../../models/product');
const Cart = require('../../models/cart');
const Favorite = require('../../models/favorite');
const Design = require('../../models/design');
const bcrypt = require('bcryptjs');

module.exports.get_dashboard = (req,res,next) => {
        Order.find({'user': req.user},{},{limit:1,sort:{date: -1}},(err,order)=>{
            Favorite.find({'user': req.user},{},{limit:1}).populate('product')
            .then(favorite=> {
                Design.find({'designer_id': req.user._id},{},{sort: {date: -1}})
                .then(designs =>{
                    res.render('user_dashboard',{
                        name: req.user.full_name,
                        email: req.user.email,
                        order: req.user.order,
                        cart: req.user.cart,
                        favorite: req.user.favorite,
                        type: req.user.type,
                        profileImage: req.user.profile_image,
                        about: req.user.about,
                        order: order,
                        favorite: favorite,
                        designs: designs
                        });
                })
                .catch(err=>{
                    console.log(err)
                })   
            })
            .catch(err=>{
                console.log(err);
            })
                
            
             
        })
        
}

//Cart
module.exports.get_cart = (req,res,next) => {

            if(!req.session.cart){
                res.render('user_cart',{products: null, level: req.user.level})    
            }else{
                var carts = new Cart(req.session.cart);
                //console.log(carts.generateArray())
                res.render('user_cart',{products: carts.generateArray(),totalPrice: carts.totalPrice, quantity: carts.totalQty})    
            }       
}

module.exports.post_cart_add = (req,res,next) => {
    const productID = req.params.productID
    var cart = new Cart (req.session.cart ? req.session.cart : {})

    Product.findById(productID,{},(err,product)=>{
        if (err) throw err;
        //console.log(product)
        cart.add(productID,product);
        req.session.cart = cart; 
        //console.log(req.session.cart);
        res.redirect('/')
    })
    
}

module.exports.get_cart_reduce_one = (req,res,next) => {
    const productID = req.params.productID
    var cart = new Cart (req.session.cart ? req.session.cart : {})
    cart.reduceByOne(productID)
    req.session.cart = cart;    
    res.redirect('/dashboard/cart')    
}

module.exports.get_cart_remove = (req,res,next) => {
    const productID = req.params.productID
    var cart = new Cart (req.session.cart ? req.session.cart : {})
    cart.remove(productID)
    req.session.cart = cart;    
    res.redirect('/dashboard/cart')    
}

module.exports.delete_cart = (req,res,next) => {
    const userID = req.user._id
    const productID = req.params.productID
    info = [];
    info["user_id"] = userID
    info["product_id"] = productID
    User.deleteCart(info,(err,cb)=>{
        if(err){
            console.log('Error here')
            return res.status(401).json({err:err})
        }else{
            return res.status(200).json({message: 'Product Deleted'})
        }
    })
}

module.exports.post_order_cart_all = (req,res,next) => {
    const userID = req.user._id
    info = [];
    info["user_id"] = userID
    User.deleteAllCart(info,(err,cb)=>{
        if(err){
            console.log('Error here')
            return res.status(401).json({err:err})
        }else{
            return res.status(200).json({message: 'Product Deleted'})
        }
    })
}

module.exports.get_checkout = (req,res,next) => {

    if(!req.session.cart){
        return res.redirect('/dashboard/cart')
    }else{
        var carts = new Cart(req.session.cart);
        res.render('user_checkout', {totalPrice: carts.totalPrice})
    }
}

module.exports.post_get_checkout = (req,res,next) => {
    const order = new Order({
        user: req.user,
        cart: req.session.cart,
        address: '123 Barkhamba road',
        name: req.user.full_name,
        date: Date.now(),
        status: "Progress"
    })

    order.save((err,result)=>{
        if(err) throw err;
        console.log(result);
        req.session.cart = null;
        req.flash('success_msg','Order Successfully Placed')
        res.redirect('/')
    })
}

//Favorite

module.exports.get_favorite = (req,res,next) => {
    Favorite.find({'user': req.user._id}).populate('product')
    .then(result => {
        const favItem = [];
        for(var i in result){
            favItem.push(result[i].product)
        }
        //console.log(favItem);
        res.render('user_favorite',{favorite: req.user.favorite, favItem: favItem});  
        //console.log(result);
    })
    .catch(err=>{
        console.log(err);
    })

}

module.exports.post_favorite_add = (req,res,next) => {


    Product.findById(req.params.productID)
    .then(product=>{
        //console.log(product)
        const id = new mongoose.Types.ObjectId()
        const fav = new Favorite({
            _id: id,
            user: req.user,
            product: product
        })
        fav.save().then(result=>{
            console.log(result)
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.delete_favorite = (req,res,next) => {
    const userID = req.user._id
    const productID = req.params.productID

    Favorite.findOneAndDelete({'product': productID},{},(err,deleted)=>{
        if(err) throw err;
        return res.status(200).json({msg: "Data has been deleted"})
    })
}

//Order

module.exports.get_orders = (req,res,next) => {
   
        Order.find({'user': req.user},{},{sort:{date: -1 //Sort by Date Added DESC
            }},(err,result)=>{
            if(err){
                return res.write('!Error');
            }
            else{
                var cart;
                result.forEach((order)=>{
                    cart = new Cart(order.cart);
                    order.items = cart.generateArray();
                });
                res.render('user_orders',{orders: result});
            }
            
        })
  
}

module.exports.post_order = (req,res,next) => {
    const userID = req.user._id
    const productID = req.params.productID
    const id = new mongoose.Types.ObjectId()
    info = [];
    info["id"] = id
    info["user_id"] = userID
    info["product_id"] = productID

    User.doneOrder(info,(err,cb)=>{
        if(err){
            console.log('Error here')
            return res.status(401).json({err:err})
        }else{
            return res.status(200).json({message: 'Product Successfully Update'})
        }
    })
}

module.exports.get_order_detail = (req,res,next) => {
    Order.findById(req.params.orderID,{},(err,result)=>{
        if(err){
            return res.write('!Error');
        }else{
            //console.log(result.order_status)
            res.render('user_order_details',{orderDetail: result.cart.items,
                status: result.order_status,
                address: result.address,
                orderDate:result.date,
            totalQty: result.cart.totalQty,
            totalPrice: result.cart.totalPrice});
        }
    })
    
    /*.exec()
    .then(orderDetail=>{
        var cart;
        orderDetail.forEach((order)=> {
            cart = new Cart(order.cart)
            order.items = cart.generateArray()
        })
        console.log(orderDetail)

        res.render('user_order_details',{orderDetail: orderDetail,items: orderDetail.cart.items});
    })
    .catch(err=>{
        console.log(err);
    })*/
}

//Profile editing

module.exports.get_profile_edit = (req,res,next) => {
        res.render('user_profile_edit',
        {isAuthenticated: true,
        userName: req.user.user_name,
        email: req.user.email,
        fullName : req.user.full_name,
        about: req.user.about,
        profileImage: req.user.profile_image
    })
}

module.exports.post_profile_edit = (req,res) => {
    const {userName, email, fullName, about } = req.body
    let errors = [];
    if (!userName || !email || !fullName){
        errors.push({msg: 'Please fill all fields'});
    }


    if(errors.length >0){
        res.render('user_profile_edit',{
            errors,
            userName,
            email,
            fullName,
            isAuthenticated: false
        })
    }else{
        User.find({user_name:userName}).exec()
        .then(userNames=>{
            if(req.user.user_name === userName){
                User.find({email: email}).exec()
                .then(userEmail=>{
                    if(req.user.email === email){
                        if(!req.file){
                            var profileImage = req.user.profile_image
                        }else{
                            var profileImage = req.file.filename
                        }
                        User.findByIdAndUpdate(req.user._id,{$set: {'user_name': userName,'email':email,'full_name':fullName,'about': about ,'profile_image':profileImage}}).exec()
                                    .then(updateData=>{
                                        req.flash('success_msg','Your profile has now been changed');
                                        return res.redirect('/dashboard')
                                    })
                                    .catch(err=>{
                                        console.log(err)
                                    })
                    } else{
                        if(userEmail.length >= 1){
                            errors.push({msg: 'User already exit'})
                            
                            return res.render('user_profile_edit',{errors,
                                userName,
                                email,
                                fullName
                            })
                        }else{
                            if(!req.file){
                                var profileImage = req.user.profile_image
                            }else{
                                var profileImage = req.file.filename
                            }
                            User.findByIdAndUpdate(req.user._id,{$set: {'user_name': userName,'email':email,'full_name':fullName,'about': about,'profile_image':profileImage}}).exec()
                                        .then(updateData=>{
                                            req.flash('success_msg','Your profile has now been changed');
                                            return res.redirect('/dashboard')
                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        })
                        } 
                    }
                     
                })
                .catch(err=>{
                    return res.render('user_profile_edit')
                })
            }
            else{
                if(userNames.length >= 1){
                    errors.push({msg: 'User already exit'})    
                    return res.render('user_profile_edit',{errors,
                    userName,
                    email,
                    fullName,
                    isAuthenticated: true})
                    }else{
                        if(req.user.email === email){
                            if(!req.file){
                                var profileImage = req.user.profile_image
                            }else{
                                var profileImage = req.file.filename
                            }
                            User.findByIdAndUpdate(req.user._id,{$set: {'user_name': userName,'email':email,'full_name':fullName,'about': about,'profile_image':profileImage}}).exec()
                            .then(updateData=>{
                                req.flash('success_msg','Your profile has now been changed');
                                return res.redirect('/dashboard')
                            })
                            .catch(err=>{
                                console.log(err)
                            })
                        }else{
                            User.find({email: email}).exec()
                            .then(userEmail=>{
                                if(userEmail.length >= 1){
                                    errors.push({msg: 'User already exit'})
                                    
                                    return res.render('user_profile_edit',{errors,
                                        userName,
                                        email,
                                        fullName
                                    })
                                }else{
                                    
                                    if(!req.file){
                                        var profileImage = req.user.profile_image
                                    }else{
                                        var profileImage = req.file.filename
                                    }
                                    User.findByIdAndUpdate(req.user._id,{$set: {'user_name': userName,'email':email,'full_name':fullName,'about': about,'profile_image': profileImage}}).exec()
                                                .then(updateData=>{
                                                    //console.log(updateData)
                                                    req.flash('success_msg','Your profile has now been changed');
                                                    return res.redirect('/dashboard')
                                                })
                                                .catch(err=>{
                                                    return res.render('user_profile_edit',{
                                                        userName,
                                                        email,
                                                        fullName
                                                    })
                                                })
                                }  
                            })
                            .catch(err=>{
                                return res.render('user_profile_edit')
                            })
                        }
                        
                    }
            }
            
        })
        .catch(err=>{
            return res.render('user_profile_edit');
        })
    }
}

module.exports.get_change_password = (req,res) => {
        res.render('user_changepassword',
        {isAuthenticated: true
        }) 
}

module.exports.post_change_password = (req,res)=> {
    const {password, password2} = req.body
    var errors = [];

    if(!password || !password2){
        errors.push({msg:'You need to add password for change'})
    }

    if(password.length <= 6){
        errors.push({msg:'Password need to be at least 6 characters long'})
    }

    if(password != password2){
        errors.push({msg:'Password does not match'})
    }

    if(errors.length > 0){
        res.render('user_changepassword',
        {isAuthenticated: true,
         errors
        }) 
    }else{
        
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(password,salt,(err,hash)=>{
                    if(err){
                        console.log(err);
                    }else{
                        //console.log(hash)
                        User.findByIdAndUpdate(req.user._id,{$set: {'password': hash}}).exec()
                        .then(result=>{
                            req.flash('success_msg','Your password has now been changed');
                            return res.redirect('/dashboard');
                        }).catch(err=>{
                            console.log(err);
                        })
                        

                    }
                })
            })
        
    }

}


//Designer

module.exports.post_addDesigner = (req,res,next) => {

    User.update({'_id': req.user._id},{'type': 'designer'},(err,cb)=>{
        if (err) throw err;
    });
    req.flash('success_msg', 'You are now become publisher');
    res.redirect('/dashboard');
}

module.exports.get_add_your_design = (req,res) => {
    res.render('user_designer_add_design')
}

module.exports.post_add_your_design = (req,res) => {
    const {designName, expectedPrice} = req.body
    const userID = req.user._id
    const date = Date.now()
    const errors = [];

    if(!designName || !expectedPrice){
        errors.push({msg:'Please fill all the details'})
    }

    if(errors.length > 0){
        res.render('user_designer_add_design',{
            errors,
            designName,
            expectedPrice
        })
    }
    else{
        if(req.file){
            const design = new Design({
                designer_id: userID,
                design_name : designName,
                status : false,
                expect_price : expectedPrice,
                design_image : req.file.filename,
                date : date
            })

            design.save()
            .then(designs=>{
                res.redirect('/dashboard');
                req.flash('success_msg','Product successfully added')
            })
            .catch(err=>{
                console.log(err)
            })

        } else{
            req.flash('error_msg','Please upload image')
            res.render('user_designer_add_design',{
                designName,
                expectedPrice
            })
        }
        
    }

}


//Like Product

module.exports.post_like_product = (req,res) => {
    const  productID = req.params.productID;
    const  userID = req.user._id;
    const id = new mongoose.Types.ObjectId()
    info = [];
    info["id"] = id
    info["user_id"] = userID
    info["product_id"] = productID

    Product.likeProduct(info,(err,cb)=>{
        if(err){
            console.log('Error here')
            return res.status(401).json({err:err})
        }else{
            return res.status(200).json({message: 'Product Successfully Update'})
        }
    })
}

module.exports.post_like_products = (req,res) => {
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

