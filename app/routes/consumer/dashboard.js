const express = require('express');
const router = express.Router();
const dashboard = require('../../controller/consumer/dashboard');
const {ensureAuthenticated} = require('../../middlewares/auth');
const product = require('../../controller/publisher/products');
const multer = require('multer');
const upload = multer({dest:'./uploads/profile'});
const uploadDesign = multer({dest: './uploads/design'});


// Routes


//Cart Routes Calling
router.get('/', ensureAuthenticated ,dashboard.get_dashboard);

router.get('/cart', ensureAuthenticated ,dashboard.get_cart);

router.post('/cart/add/:productID',ensureAuthenticated ,dashboard.post_cart_add);

router.get('/cart/reduce/:productID', ensureAuthenticated, dashboard.get_cart_reduce_one);

router.get('/cart/remove/:productID', ensureAuthenticated, dashboard.get_cart_remove);

router.delete('/cart/delete/:productID', ensureAuthenticated, dashboard.delete_cart);

router.post('/cart/orderAll', ensureAuthenticated ,dashboard.post_order_cart_all);

router.get('/checkout', ensureAuthenticated, dashboard.get_checkout);

router.get('/checkoutfinal', ensureAuthenticated, dashboard.post_get_checkout);

//Favorite Routes Calling
router.get('/favorite', ensureAuthenticated, dashboard.get_favorite);

router.post('/favorite/add/:productID', ensureAuthenticated, dashboard.post_favorite_add);

router.delete('/favorite/delete/:productID', ensureAuthenticated, dashboard.delete_favorite);

//Order Routes Calling

router.get('/orders', ensureAuthenticated, dashboard.get_orders);

router.post('/order/add/:productID', ensureAuthenticated, dashboard.post_order);

router.get('/order/:orderID',ensureAuthenticated,dashboard.get_order_detail);

//Profile

router.get('/editprofile', ensureAuthenticated ,dashboard.get_profile_edit);

router.post('/editprofile', ensureAuthenticated, upload.single('profileImage'),dashboard.post_profile_edit);

router.get('/changepassword',ensureAuthenticated,dashboard.get_change_password);

router.post('/changepassword',ensureAuthenticated,dashboard.post_change_password);

//Designer Routes

router.post('/adddesigner', ensureAuthenticated, dashboard.post_addDesigner);

router.get('/addyourdesign', ensureAuthenticated, dashboard.get_add_your_design)

router.post('/addyourdesign', ensureAuthenticated, uploadDesign.single('designImage'),dashboard.post_add_your_design)

//Like

router.post('/like/product/:productID', ensureAuthenticated, dashboard.post_like_product);

router.post('/like/products/:productID',ensureAuthenticated, dashboard.post_like_products);
//Getting Single Product Like
router.get('/getlikes/products/:productID', ensureAuthenticated, product.get_likes_product_count);


module.exports = router;