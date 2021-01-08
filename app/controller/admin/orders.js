const Order = require('../../models/order');

// Order Controller
module.exports.get_all_order = (req,res) => {
    Order.find({},{},{sort:{date:-1}},(err,orders)=>{
        if(err) throw err;
        res.render('./admin/order_all',{orders})
    })
}

module.exports.get_all_pending_order = (req,res) => {
    Order.find({"order_status": {"$regex": 'Pending', "$options": "i"}},{},{sort:{date:-1}},(err,orders)=>{
        if(err) throw err;
        console.log(orders)
        res.render('./admin/order_pending')
    })
}

module.exports.get_all_progress_order = (req,res) => {
    Order.find({"order_status": {"$regex": 'Progress', "$options": "i"}},{},{sort:{date:-1}},(err,orders)=>{
        if(err) throw err;
        console.log(orders)
        res.render('./admin/order_pending')
    })
}

module.exports.get_all_transit_order = (req,res) => {
    Order.find({"order_status": {"$regex": 'Transit', "$options": "i"}},{},{sort:{date:-1}},(err,orders)=>{
        if(err) throw err;
        console.log(orders)
        res.render('./admin/order_pending')
    })
}

module.exports.get_all_delivered_order = (req,res) => {
    Order.find({"order_status": {"$regex": 'Delivered', "$options": "i"}},{},{sort:{date:-1}},(err,orders)=>{
        if(err) throw err;
        console.log(orders)
        res.render('./admin/order_pending')
    })
}

module.exports.get_all_failed_order = (req,res) => {
    Order.find({"order_status": {"$regex": 'Failed', "$options": "i"}},{},{sort:{date:-1}},(err,orders)=>{
        if(err) throw err;
        console.log(orders)
        res.render('./admin/order_pending')
    })
}

