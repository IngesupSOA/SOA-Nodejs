var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var Cookies = require("cookies");
var UtilsOrder = require('../Utils/orderUtils');

var OrderDB = require('../Models/OrderDB');
var PizzaDB = require('../Models/PizzaDB');
//var UserDB = require('../Models/UserDB');
//var ClassDB = require('../Models/ClassDB');
var Order = mongoose.model('Order');
var Pizza = mongoose.model('Pizza');
var User = mongoose.model('User');
var Class = mongoose.model('Class');

router.get('/getAll', function(req, res, next) {
    Order.
    find().
    exec(function(err, orders){
        res.json(orders);
    });
});

router.get('/paypal', function(req, res, next) {
    var configSandbox = {
        'mode' : 'sandbox',
        'client_id' : 'ARfucPqNEtupis2zq9BubXeUs5n6CEPZAbs7fz5nGqZorhvg0yJWhUf6sPVUy8qjQRiWfcWsvD-S2_1b',
        'client_secret' : 'EPaERZ8uHaNr4RUQTX48_6kSf7nuTEvknDM27fawwg0bU7saeQnO-SQJNHrGDX5cQT9waV-uartGM0rV'
    };

    var configLive = {
        'mode' : 'live',
        'client_id' : 'AV6X4wDSvU7ovhLZ6Asbaz_AdaEOoaHNcv1t3SXHKCv2r3IVLPb2q8j9jb8Pqq6mHPwvC7jTVPj5it_g',
        'client_secret' : 'EFUHUkFmATKtn-MIaXq-gYpUIJI8mdFV0mB_EYvT_eDXvXeKoODVEB7-OwPu-BoTksA2S2PGM3nK2toN'
    };

    paypal.configure(configSandbox);

    var paymentDescription = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/api/order/success",
            "cancel_url": "http://localhost:3000/api/order/fail"
        },
        "transactions": [{
            "item_list": {
                "items": []
            },
            "amount": {
                "currency": "EUR",
                "total": "0.00"
            },
            "description": "Votre commande de pizza."
        }]
    };

    var cookieOrder = new Cookies(req, res).get("order");
    parseOrderPaypalJson(paymentDescription, cookieOrder);

    paypal.payment.create(paymentDescription, configSandbox, function(error, payment){
        if (error) {
            console.log(error);
        } else {
            if(payment.payer.payment_method === 'paypal') {
                //req.session.paymentId = payment.id;
                var redirectUrl;
                for(var i=0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
                res.redirect(redirectUrl);
            }
        }
    });
});

router.get('/success', function(req, res, next) {
    var cookieOrder = new Cookies(req, res).get("order");
    var cookieJson = JSON.parse(cookieOrder);
    Order.
    update({_id: cookieJson._id},
        {$set: {
            state: "payed"
        }},
        {multi:true}).
    exec(function(err, order){

        new Cookies(req, res).set("order", "", { httpOnly: true, secure: false });
        res.redirect('/api/order/');
    });
});

router.get('/fail', function(req, res, next) {
    res.redirect('/api/orders/');
});

router.get('/initOrder', function(req, res, next) {
    var class1 = new Class({
        name: 'Expert 1',
        school: 'Ingésup Lyon',
        created_on: Date.now(),
        updated_at: Date.now()
    });
    var nick = new User({
        firstname: 'Nick',
        lastname: 'Cerminara',
        username: 'nick',
        email: 'nick.cerminara@gmail.com',
        password: 'password',
        avatar: 'yoloAvatar',
        address: '5th Main Street Avenue, 35697 NYC, USA',
        phoneNumber: '+45 005 458 223',
        admin: true,
        class: class1,
        created_on: Date.now(),
        updated_at: Date.now()
    });
    var pizza1 = new Pizza({
        name: "Pizza 1",
        description: "Desc Pizza 1",
        price: 10,
        sizeType: "Normal",
        doughType: "Fine"
    });
    var pizza2 = new Pizza({
        name: "Pizza 2",
        description: "Desc Pizza 2",
        price: 12,
        sizeType: "Normal",
        doughType: "Fine"
    });
    var order = new Order({
        "pizzaList": [pizza1, pizza2],
        "user": nick,
        "state": "notPayed",
        "paymentType": "Paypal"
    });
    order.save();
    new Cookies(req, res).set("order", JSON.stringify(order), { httpOnly: true, secure: false });
    res.render('index');
});

function parseOrderPaypalJson(paymentDescription, order){
    var total = 0;
    var orderJson = JSON.parse(order);
    for(var i = 0; i<orderJson.pizzaList.length; i++){
        var pizza = orderJson.pizzaList[i];
        paymentDescription.transactions[0].item_list.items.push({
            "name": pizza.name + " " + pizza.sizeType + " " + pizza.doughType,
            "sku": pizza.name,
            "price": pizza.price,
            "currency": "EUR",
            "quantity": 1
        });
        total += pizza.price;

        paymentDescription.transactions[0].amount.total = total;
    }
}

router.get('/cleanOrder/:value1', function(req, res, next) {
    Order.findOne({_id: req.params.value1}, function(err,order) {
        if(err) console.log(err.message);

        order.pizzaList.forEach(function(item) {
            Pizza.remove({_id: item}, function(err) {
                if(err) console.log(err.message);
            });
        });

        Order.remove({_id: order._id}, function(err) {
            if(err) console.log(err.message);
        });
    });

    res.clearCookie('order');
    return res.redirect('/api/pizza');
});

router.get('/cleanOrderAll', function(req, res, next) {
    Order.remove( function(err) {
        if(err) console.log(err.message);
    });
    res.clearCookie('order');
    return res.status(200).json({working:true});
});

router.get('/addPizza/name/:value1/price/:value2', function(req, res, next) {
    var cookieJson = new Cookies(req, res).get("order");

    var firstPizza = new Pizza({
        name: req.params.value1,
        description: "Description Pizza",
        price: req.params.value2.substr(0,2),
        sizeType: "Large",
        doughType: "Classic"
    });

    var pizzaToAdd = new Pizza({
        name: req.params.value1,
        description: "Description Pizza",
        price: req.params.value2.substr(0,2),
        sizeType: "Large",
        doughType: "Classic"
    });

    if(cookieJson == undefined || cookieJson == null) {
        //console.log('----------------createdOrder------------');
        var userJson = JSON.parse(new Cookies(req, res).get("user"));
        firstPizza.save();
        //IF order is not create, create a new order
        var orderToInsert = new Order({
            "pizzaList": [firstPizza],
            "user": userJson,
            "state": "ToBePaid",
            "paymentType": "PayPal"
        });

        orderToInsert.save();
        Order.findOne({_id: orderToInsert._id}).populate("user").exec(function(err) {
            if(err) console.log(err.message); else console.log('Populate User;');
        });
        Order.findOne({_id: orderToInsert._id}).populate("pizzaList").exec(function(err) {
            if(err) console.log(err.message); else console.log('Populate Pizza');
        });
        //console.log('----------------createdOrder1------------');

        new Cookies(req, res).set('order', JSON.stringify(orderToInsert), {
            httpOnly: true,
            secure: false      // for your dev environment => true for prod
        });

        return res.redirect('/api/pizza');
    }
    else
    {
        //console.log('------------insert Pizza----------------');
        //Ajout de la pizza
        pizzaToAdd.save();
        var UpdatedOrder = UtilsOrder.addPizzaIntoOrder(pizzaToAdd, JSON.parse(new Cookies(req, res).get("order")));
        Order.findOne({_id: UpdatedOrder._id}).populate("pizzaList").exec(function(err) {
            if(err) console.log(err.message); else console.log('Populate Pizza');
        });
        //console.log('------------insert Pizza1----------------');
        new Cookies(req, res).set('order', JSON.stringify(UpdatedOrder), {
            httpOnly: true,
            secure: false      // for your dev environment => true for prod
        });
        return res.redirect('/api/pizza');
    }
});

module.exports = router;