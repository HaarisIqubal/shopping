const express = require('express')
const router = express.Router()
const product = require('../../controller/admin/products');
const multer = require('multer');
const upload = multer({dest:'./uploads/product'});

//Dashboard Route

router.get('/dashboard' ,product.get_dashboard);

router.get('/dashboard/page/:pageNum' ,product.get_dashboard_page);


//Adding Data

router.get('/add' ,product.get_add_product);

router.post('/add', upload.single('productImage') ,product.post_add_product);

router.delete('/delete/:productId' ,product.delete_product_byID);


//Need to complete
router.get('/edit/:productId' , product.get_edit_product);

router.post('/edit/:productId' , upload.single('productImage'), product.post_edit_product)

module.exports = router