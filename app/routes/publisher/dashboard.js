const express = require('express')
const router = express.Router()
const dashboard = require('../../controller/publisher/dashboard');
const {ensureAuthenticated} = require('../../middlewares/auth') 

router.get('/', ensureAuthenticated ,dashboard.get_dashboard);

//Cart

router.get('/cart', ensureAuthenticated , dashboard.get_cart);

router.post('/cart/add/:productID',ensureAuthenticated , dashboard.post_cart_add);

router.delete('/cart/delete/:productID', ensureAuthenticated, dashboard.delete_cart);

router.post('/cart/orderAll', ensureAuthenticated , dashboard.post_order_cart_all);


//Favorite Routes Calling
router.get('/favorite', ensureAuthenticated, dashboard.get_favorite);

router.post('/favorite/add/:productID', ensureAuthenticated, dashboard.post_favorite_add);

router.delete('/favorite/delete/:productID', ensureAuthenticated, dashboard.delete_favorite);

//Order Routes Calling

router.get('/orders', ensureAuthenticated, dashboard.get_orders);

router.post('/order/add/:productID', ensureAuthenticated, dashboard.post_order);


//Profile

router.get('/editprofile', ensureAuthenticated ,dashboard.get_profile_edit);

router.post('/editprofile', ensureAuthenticated ,dashboard.post_profile_edit);

router.get('/changepassword',ensureAuthenticated,dashboard.get_change_password);

router.post('/changepassword',ensureAuthenticated,dashboard.post_change_password);

//Like

router.post('/like/product/:productID', ensureAuthenticated, dashboard.post_like_product);

module.exports = router