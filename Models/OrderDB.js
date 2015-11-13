/**
 * Created by Ezehollar on 13/11/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./UserDB');
var Pizza = require('./PizzaDB')


var Order = new Schema({
    pizzaList: new Array(),
    user: User,
    state: String,
    payementType: String,
    created_on: Date,
    updated_at: Date
});


mongoose.model('Order', Order);