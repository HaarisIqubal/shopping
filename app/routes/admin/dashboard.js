const express = require('express')
const router = express.Router()
const dashboard = require('../../controller/admin/dashboard');

//Getting Dashboard

router.get('/', dashboard.get_dashboard);


module.exports = router