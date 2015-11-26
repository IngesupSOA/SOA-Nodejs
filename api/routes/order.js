var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var Cookies = require("cookies");

var OrderDB = require('../Models/OrderDB');
var PizzaDB = require('../Models/PizzaDB');
//var UserDB = require('../Models/UserDB');
//var ClassDB = require('../Models/ClassDB');
var Order = mongoose.model('Order');
var Pizza = mongoose.model('Pizza');
var User = mongoose.model('User');
var Class = mongoose.model('Class');

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
            "return_url": "http://localhost:3000/order/success",
            "cancel_url": "http://localhost:3000/order/success/fail"
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
    res.render('orderSuccess');
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

module.exports = router;