var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
    UserDB = require('../models/UserDB'),
    User = mongoose.model('User'),
    Pizza = mongoose.model('Pizza'),
    Order = mongoose.model('Order');

/* GET admin home page. */
router.get('/', function(req, res, next) {
    res.render('admin');
});

/* GET admin users page. */
router.get('/users', function(req, res, next) {
    User.
    find().
    exec(function(err, users){
        res.json(users);
    });
    //res.write('hello');
});

/* GET admin orders page. */
router.get('/orders', function(req, res, next) {
    Order.
    find().
    exec(function(err, orders){
        res.render('back-orders',orders);
    });
    //res.write('hello');
});

/* GET admin orders page. */
router.post('/orders/:orderId', function(req, res, next) {
    Order.
    find().
    exec(function(err, orders){
        res.render('back-orders',orders);
    });
    //res.write('hello');
});

module.exports = router;
