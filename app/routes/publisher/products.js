const express = require('express');
const router = express.Router();
const product = require('../../controller/publisher/products');
const multer = require('multer');
const upload = multer({dest:'./uploads/product'});
const {ensureAuthenticated} = require('../../middlewares/auth')

// Routes

router.get('/', ensureAuthenticated ,product.get_all_data);

router.get('/dashboard', ensureAuthenticated ,product.get_dashboard);

router.get('/dashboard/page/:pageNum', ensureAuthenticated, product.get_dashboard_page);

router.get('/add', ensureAuthenticated ,product.get_add_product);

router.post('/add', upload.single('productImage'), ensureAuthenticated ,product.post_add_product);

router.get('/edit/:productId', ensureAuthenticated , product.get_edit_product);

router.post('/edit/:productId', ensureAuthenticated , upload.single('productImage'), product.post_edit_product)

router.get('/delete/:productId', ensureAuthenticated ,product.delete_product_byID);


//Orders

router.get('/order',ensureAuthenticated, product.get_orders);


//Like
router.post('/like/product/:productID',ensureAuthenticated, product.post_like_product);

//Getting Single Product Like
router.get('/likes/:productID', ensureAuthenticated, product.get_likes_product_count);

module.exports = router;