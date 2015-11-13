/**
 * Created by Ezehollar on 13/11/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Class = require('./ClassDB');

var User = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    avatar: String,
    adress: String,
    phoneNumber: String,
    class: Class,
    created_on: Date,
    updated_at: Date
});

mongoose.model('User', User);