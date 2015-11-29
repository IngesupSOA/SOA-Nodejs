var https = require('https');
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var Cookie = require("cookies");
var UtilsOrder = require('../Utils/orderUtils');

var OrderDB = require('../Models/OrderDB');
var PizzaDB = require('../Models/PizzaDB');
//var UserDB = require('../Models/UserDB');
//var ClassDB = require('../Models/ClassDB');
var Order = mongoose.model('Order');
var Pizza = mongoose.model('Pizza');
var User = mongoose.model('User');
var Class = mongoose.model('Class');


// http://pizza.dominos.fr/base/Store/GetStore/{ZIPCode}
// http://pizza.dominos.fr/la-carte/nos-pizzas

/* GET home page. */
router.get('/', function (req, res, next) {

    var orderCookie = new Cookie(req, res).get('order');
    var optionsget = {
        host: 'services.dominos.com.au',
        path: '/Rest/fr/menus/31740/products',
        method: 'GET'
    };
    var getData = https.request(optionsget, function (data) {
        var body = '';
        data.on('data', function (resx) {
            body += resx;
        });
        data.on('end', function () {
            console.log('ending http request');
            var bodyParsed = JSON.parse(body);
            var pizzas = bodyParsed.MenuPages[1].SubMenus;
            if(orderCookie == undefined || orderCookie == null)
                res.render('pizza', {menus: pizzas, orderCookies: ""});
            else
                res.render('pizza', {menus: pizzas, orderCookies: JSON.parse(orderCookie)});
        });
    });

    getData.end();

    getData.on('error', function (e) {
        console.error("Error: " + e);
    });
});


router.get('/getAll', function(req, res, next) {
    Pizza.
        find().
        exec(function(err, orders){
            res.json(orders);
        });
});

router.get('/del/:value1', function(req, res, next) {

    var UpdateOrderToDelete = JSON.parse(new Cookie(req, res).get("order"));

    Pizza.findOne({_id: req.params.value1}, function(err,pizza) {
        if (err) console.log(err.message);

        UpdateOrderToDelete = UtilsOrder.deletePizzaIntoOrder(pizza, UpdateOrderToDelete);
        return UpdateOrderToDelete;
    });

    console.log(UpdateOrderToDelete);

    Pizza.remove({_id: req.params.value1}, function(err) {
        if(err) console.log(err.message);
    });

    new Cookie(req, res).set('order', JSON.stringify(UpdateOrderToDelete), {
        httpOnly: true,
        secure: false      // for your dev environment => true for prod
    });



    res.redirect('/api/pizza');
});

router.get('/cleanPizzaAll', function(req, res, next) {
    Pizza.remove( function(err) {
        if(err) console.log(err.message);
    });
    return res.status(200).json({working:true});
});

module.exports = router;
