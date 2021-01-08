const express = require('express');
const router = express.Router();
const user = require('../controller/users');
const passport = require('passport');
const multer = require('multer');
const upload = multer({dest:'./uploads/profile'});

// Routes
router.get('/', user.get_all_data);

router.get('/signup',user.get_add_user);

router.post('/signup', upload.single('profileImage') ,user.post_add_user);

router.get('/login',user.get_login_user);

router.post('/login', passport.authenticate('local',{failureRedirect:'/user/login',failureFlash: 'Invalid username or password'}) , user.post_login_user);

router.get('/logout', user.get_logout_user);


module.exports = router;