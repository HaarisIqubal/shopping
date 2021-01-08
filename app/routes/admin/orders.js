const express = require('express');
const router = express.Router()
const Order = require('../../models/order');
const orders = require('../../controller/admin/orders');

// Order Routes
router.get('/',orders.get_all_order);

router.get('/pending',orders.get_all_pending_order);


module.exports = router