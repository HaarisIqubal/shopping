const express = require('express');
const router = express.Router();
const home = require('../controller/home');

// Routes
router.get('/', home.get_all_data);

router.get('/product/:productID', home.get_product_details);

router.get('/search', home.get_search);

router.get('/products', home.get_all_products);

router.get('/shirts',home.get_all_shirt);

//Getting Data Profile of Designer

router.get('/profile/:userID',home.get_artist_profile);

//Routes for Newsletter

router.post('/subscribe/newsletter', home.post_subscribe_newsletter);

module.exports = router;