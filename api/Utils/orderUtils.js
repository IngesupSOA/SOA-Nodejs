/**
 * Created by Ezehollar on 26/11/2015.
 */
var mongoose = require('mongoose');
var Order = require('../Models/OrderDB');
var Order = mongoose.model('Order');
var Pizza = mongoose.model('Pizza');
var User = mongoose.model('User');
var Class = mongoose.model('Class');


module.exports.addPizzaIntoOrder = function (pizza, JsonOrder, req, res) {

    var cookieJson = JSON.parse(JsonOrder);

    Order.update({
            _id: cookieJson._id
        }, function (err, order) {
            console.log(order);
            });
    return order;
};

