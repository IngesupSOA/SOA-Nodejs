/**
 * Created by Ezehollar on 13/11/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pizza = new Schema({
    name: String,
    description: String,
    price: Number,
    sizeType: String,
    doughType: String,
    created_on: Date,
    updated_at: Date
});

mongoose.model('Pizza', Pizza);