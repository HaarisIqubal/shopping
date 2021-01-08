const User = require('../../models/user');
const mongoose = require('mongoose');

module.exports.get_dashboard = (req,res)=> {
    if(!req.isAuthenticated()){
        res.redirect('/user/login')
    }else{
        if(req.user.level === 'publisher'){
            res.render('user_dashboard',{
                name: req.user.full_name,
                email: req.user.email,
                isAuthenticated: true,
                cart: req.user.cart,
                order: req.user.order,
                favorite: req.user.favorite,
                level: req.user.level
            })
        }
        else{
            res.redirect('/consumer/dashboard')
        }
        
    } 
}

//Cart
module.exports.get_cart = (req,res,next) => {
    if(req.user.level === 'publisher'){
        res.render('user_cart',{cart: req.user.cart, isAuthenticated: true, level: req.user.level, host: req.get('host')})
    } else{
        res.redirect('consumer/dashboard/cart')
    }
}

module.exports.post_cart_add = (req,res,next) => {
    const userID = req.user._id
    const productID = req.params.productID
    const id = new mongoose.Types.ObjectId()
    info = [];
    info["id"] = id
    info["user_id"] = userID
    info["product_id"] = productID
    User.addCart(info,(err,cb)=>{
        if(err){
            console.log('Error here')
            return res.status(401).json({err:err})
        }else{
            return res.status(200).json({message: 'Product Successfully Update'})
        }
    })
    
    
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
    const lastProductID = req.user.order[0]._id
    console.log(productID)
    User.update({userID},{$set: {'order.$[ord]': lastProductID},$push : {'order.$[ord].products_id.$[prd]':123}}).exec()
    .then(productsUpdate => {
            console.log(productsUpdate)
        })
    .catch(err=>{console.log(err)})
        /*
    User.deleteAllCart(info,(err,cb)=>{
        if(err){
            console.log('Error here')
            return res.status(401).json({err:err})
        }else{
            return res.status(200).json({message: 'Product Deleted'})
        }
    })*/
}

//Favorite
module.exports.get_favorite = (req,res,next) => {
    if(req.user.level === 'publisher'){
        res.render('user_favorite',{
            favorite: req.user.favorite, 
            isAuthenticated: true, 
            level: req.user.level});
    }else{
        res.redirect('/consumer/dashboard/favorite')
    }
}

module.exports.post_favorite_add = (req,res,next) => {
    const userID = req.user._id
    const productID = req.params.productID
    const id = new mongoose.Types.ObjectId()
    info = [];
    info["id"] = id
    info["user_id"] = userID
    info["product_id"] = productID
    User.addFavorite(info,(err,cb)=>{
        if(err){
            console.log('Error here')
            return res.status(401).json({err:err})
        }else{
            return res.status(200).json({message: 'Product Successfully Update'})
        }
    })
    
    
}

module.exports.delete_favorite = (req,res,next) => {
    const userID = req.user._id
    const productID = req.params.productID
    info = [];
    info["user_id"] = userID
    info["product_id"] = productID
    User.deleteFavorite(info,(err,cb)=>{
        if(err){
            console.log('Error here')
            return res.status(401).json({err:err})
        }else{
            return res.status(200).json({message: 'Product Deleted'})
        }
    })
}

//Order

module.exports.get_orders = (req,res,next) => {
    if(req.user.level === 'publisher'){
        res.render('user_orders',{
            order: req.user.order, 
            isAuthenticated: true, 
            level: req.user.level});
    }else{
        res.redirect('publisher/dashboard/orders')
    }
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


//Profile editing

module.exports.get_profile_edit = (req,res,next) => {
    if(req.user.level === 'publisher'){
        res.render('user_profile_edit',
        {isAuthenticated: true,
        level: req.user.level,
        userName: req.user.user_name,
        email: req.user.email,
        password: req.user.password,
        password2: req.user.password,
        fullName : req.user.full_name
    })
    } else{
        res.redirect('consumer/dashboard/editprofile')
    }
    
}

module.exports.post_profile_edit = (req,res) => {
    const {userName, email, fullName } = req.body
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
            isAuthenticated: false,
            level: req.user.level
        })
    }else{
        User.find({user_name:userName}).exec()
        .then(userNames=>{
            if(req.user.user_name === userName){
                User.find({email: email}).exec()
                .then(userEmail=>{
                    if(req.user.email === email){
                        User.findByIdAndUpdate(req.user._id,{$set: {'user_name': userName,'email':email,'full_name':fullName}}).exec()
                                    .then(updateData=>{
                                        //console.log(updateData)
                                        res.redirect('/'+req.user.level+'/dashboard')
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
                                fullName,
                                isAuthenticated:true,
                                level: req.user.level})
                        }else{
                            User.findByIdAndUpdate(req.user._id,{$set: {'user_name': userName,'email':email,'full_name':fullName}}).exec()
                                        .then(updateData=>{
                                            //console.log(updateData)
                                            res.redirect(req.user.level+'/dashboard')
                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        })
                        } 
                    }
                     
                })
                .catch(err=>{
                    return res.render('user_profile_edit',{isAuthenticated:false,level:req.user.level})
                })
            }
            else{
                if(userNames.length >= 1){
                    errors.push({msg: 'User already exit'})    
                    return res.render('user_profile_edit',{errors,
                    userName,
                    email,
                    fullName,
                    isAuthenticated: true,
                    level: req.user.level})
                    }else{
                        if(req.user.email === email){
                            User.findByIdAndUpdate(req.user._id,{$set: {'user_name': userName,'email':email,'full_name':fullName}}).exec()
                            .then(updateData=>{
                                //console.log(updateData)
                                res.redirect(req.user.level+'/dashboard')
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
                                        fullName,
                                        isAuthenticated:true,
                                        level: req.user.level})
                                }else{
                                    User.findByIdAndUpdate(req.user._id,{$set: {'user_name': userName,'email':email,'full_name':fullName}}).exec()
                                                .then(updateData=>{
                                                    //console.log(updateData)
                                                    res.redirect(req.user.level+'/dashboard')
                                                })
                                                .catch(err=>{
                                                    return res.render('user_profile_edit',{isAuthenticated:false,level: req.user.level})
                                                })
                                }  
                            })
                            .catch(err=>{
                                return res.render('user_profile_edit',{isAuthenticated:false,level: req.user.level})
                            })
                        }
                        
                    }
            }
            
        })
        .catch(err=>{
            return res.render('user_profile_edit',{isAuthenticated:true,level:req.user.level});
        })
    }
}

module.exports.get_change_password = (req,res) => {
    if(req.user.level==='publisher'){
        res.render('user_changepassword',
        {isAuthenticated: true,
        level: req.user.level
        })
    } else{
        res.redirect('consumer/dashboard/changepassword')
    }
    
}

module.exports.post_change_password = (req,res)=> {
    const {password, password2} = req.body
    if(password === password2){
       res.redirect('/'+req.user.level+'/dashboard')
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

    User.likeProduct(info,(err,cb)=>{
        if(err){
            console.log('Error here')
            return res.status(401).json({err:err})
        }else{
            return res.status(200).json({message: 'Product Successfully Update'})
        }
    })
}