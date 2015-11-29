/**
 * Created by Ezehollar on 26/11/2015.
 */
var mongoose = require('mongoose');
var Order = require('../Models/OrderDB');
var Order = mongoose.model('Order');
var Pizza = mongoose.model('Pizza');
var User = mongoose.model('User');
var Class = mongoose.model('Class');
var Cookies = require("cookies");

module.exports.addPizzaIntoOrder = function (pizza, orderToUpdate) {

    var PizzaListTemp = orderToUpdate.pizzaList;
    PizzaListTemp.push(pizza);

    Order.findOneAndUpdate(
          {_id: orderToUpdate._id}
        , {updated_at: Date.now(),
            pizzaList: PizzaListTemp
        }
        , {w:1}, function(err, order) {
            if (err) throw err;
        });

    return orderToUpdate;
};

module.exports.deletePizzaIntoOrder = function (pizza, orderToUpdate,next) {

    var PizzaListTemp = orderToUpdate.pizzaList;
    var index = PizzaListTemp.indexOf(pizza);
    PizzaListTemp.splice(index,1);

    Order.findOneAndUpdate(
        {_id: orderToUpdate._id}
        , {updated_at: Date.now(),
            pizzaList: PizzaListTemp
        }
        , {w:1}, function(err, order) {
            if (err) throw err;
        });

    return next(orderToUpdate);
};

