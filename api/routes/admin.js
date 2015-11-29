var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
    UserDB = require('../models/UserDB'),
    User = mongoose.model('User'),
    Pizza = mongoose.model('Pizza'),
    Order = mongoose.model('Order');
var utils = require("../Utils/utils.js");

/* GET admin home page. */
router.get('/', function(req, res) {
    utils.middleware(true, req, res, function() {
        res.render('admin');
    });
});

/* GET admin users page. */
router.get('/users', function(req, res) {
    User.
    find().
    exec(function(err, users){
        if(err) throw err;
        res.render('back-users', { users : users });
    });
    //res.write('hello');
});

/* GET admin users page. */
router.get('/users/delete/:value', function(req, res) {
    console.log(req.params.value);
    User.
    remove({_id: req.params.value}).
    exec(function(err, user){
        res.redirect('/api/admin/users');
    });
    //res.write('hello');
});

/* GET admin orders page. */
router.get('/orders', function(req, res) {
    Order.
    find().
    exec(function(err, orders){
        if(err) console.log(err);
        //TODO get the pizzas and user related to the order
        //create an object and push it in, then send all this to swig
        console.log(orders);
        res.render('back-orders', { orders : JSON.stringify(orders) });
    });
    //res.write('hello');
});

/* GET admin orders page. */
router.post('/orders/:orderId', function(req, res) {
    Order.
    find().
    exec(function(err, orders){
        res.render('back-orders',orders);
    });
    //res.write('hello');
});

module.exports = router;
