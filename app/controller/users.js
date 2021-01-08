const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');



module.exports.get_all_data = (req,res) =>{
    return res.status(200).json({message:"User"})
}

module.exports.get_add_user = (req,res,next) => {
    if(!req.isAuthenticated()){
        res.render('user_add',{title: 'Register User', isAuthenticated: false})
    }else{
        res.render('user_add',{title: 'Register User', isAuthenticated: true})
    } 
}

module.exports.post_add_user = (req,res,next) => {
    if(!req.isAuthenticated()){
    const {userName, email, password, password2, fullName } = req.body
    const type = "consumer"
    let errors = [];

    //Checking for require fields
    if (!userName || !email || !password || !password2 || !fullName){
        errors.push({msg: 'Please fill all fields'});
    }

    if(password != password2){
        errors.push({msg: 'Password is not matching'})
    }

    if(password.length <= 6){
        errors.push({msg: 'Password should be more than 6 character'})
    }

    if(errors.length >0){
        res.render('user_add',{
            errors,
            userName,
            email,
            password,
            password2,
            fullName,
            isAuthenticated: false
        })
    }else{
        User.find({user_name:userName}).exec()
        .then(userNames=>{
            if(userNames.length >= 1){
            errors.push({msg: 'User already exits'})    
            return res.render('user_add',{errors,
            userName,
            email,
            password,
            password2,
            fullName,
            isAuthenticated: false})
            }else{
                User.find({email: email}).exec()
                .then(userEmail=>{
                    if(userEmail.length >= 1){
                        errors.push({msg: 'User already exits'})
                        
                        return res.render('user_add',{errors,
                            userName,
                            email,
                            password,
                            password2,
                            fullName,
                            isAuthenticated:false})
                    }else{
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(password,salt,(err,hash)=>{
                                if(err) {
                                    throw err;
                                }
                                else{
                                    if(req.file){
                                        var profileImage = req.file.filename
                                    }else{
                                        var profileImage = "noimage.jpg"
                                    }
                                    const user = new User({
                                        _id: new mongoose.Types.ObjectId(),
                                        user_name: userName,
                                        email: email,
                                        password: hash,
                                        full_name: fullName,
                                        about: "",
                                        profile_image: profileImage,
                                        type: type
                                    });
                                
                                    user.save()
                                    .then(userAdd=>{
                                        req.flash('success_msg', 'You are now registered')
                                        return res.redirect('/')    
                                    })
                                    .catch(err=>{
                                        return res.render('user_add',{isAuthenticated:false})
                                    })
    
                                }
                            })
                        })
                    }  
                })
                .catch(err=>{
                    return res.render('user_add',{isAuthenticated:false})
                })
            }
        })
        .catch(err=>{
            return res.render('user_add',{isAuthenticated:false});
        })
    }
    }
    else{
        res.redirect('/dashboard',{isAuthenticated: true})
    }

    

    // Checking Validation
    /*check('email').isEmail()
    check('password').isLength({min: 5})

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.render('user_add',{errors: errors})
    }*/

}

module.exports.get_login_user = (req,res,next) => {
    if(!req.isAuthenticated()){
        res.render('user_login',{title: 'Login User', isAuthenticated: false})
    } else{
        res.redirect('/dashboard')
    }  
}

module.exports.post_login_user = (req,res,next) => {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        //req.flash('success_msg','You are now loged in');
        //console.log(req.user);
        if(!req.isAuthenticated()){
            res.redirect('/user/login');
        }else{
                    req.flash('success_msg','You are now logged in')
                    res.redirect('/');
            }
                   
}

module.exports.get_logout_user = (req,res,next) => {
    if(!req.isAuthenticated()){
        res.status(301).json({message: 'Not Authorized'})
    }
    else{
        req.logout();
        req.flash('warning_msg', 'You are logged out');
        res.redirect('/');
    }
}


